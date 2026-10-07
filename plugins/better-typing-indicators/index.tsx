import { Design } from '@revenge-mod/discord/design'
import { getModules } from '@revenge-mod/modules/finders'
import { withProps } from '@revenge-mod/modules/finders/filters'
import { after, instead } from '@revenge-mod/patcher'
import { cloneElement, isValidElement } from 'react'
import {
	ChannelTypingIndicator,
	TypingText,
	useChannelTypingIndicator,
} from './components'
import SettingsComponent from './settings'
import { DefaultSettings, setStorage } from './shared'
import {
	findElement,
	insertElementBefore,
	replaceElement,
	wrapComponent,
} from './shared.react'
import type { FC, MemoExoticComponent, ReactElement, ReactNode } from 'react'
import type { BasicChannel, Settings } from './shared'

export type { Settings } from './shared'

interface TypingIndicatorInnerProps {
	channel: BasicChannel
	typingUserIds: string[]
	transitionState: number
	cleanUp: () => void
}

type RenderTypingIndicator = (
	key: string,
	item: { channel: BasicChannel; typingUserIds: string[] },
	transitionState: number,
	cleanUp: () => void,
) => ReactElement<TypingIndicatorInnerProps, FC<TypingIndicatorInnerProps>>

type MemoComponent<P> = MemoExoticComponent<FC<P>> & { type: FC<P> }

interface TextChannelProps {
	channel: BasicChannel
	selected: boolean
	muted: boolean
	isSuggestedSection: boolean
}

interface ThreadChannelProps {
	threadId: string
	threadIndex: number
	threadCount: number
	selected: boolean
}

interface ThreadChannelInnerProps extends ThreadChannelProps {
	channel: BasicChannel
}

interface ThreadChannelItemProps {
	channel: BasicChannel
	muted: boolean
	channelInfo: ReactNode
}

export default plugin<{ jsonStorage: Settings }>({
	jsonStorage: {
		load: true,
		default: DefaultSettings,
	},
	start({ cleanup, jsonStorage, plugin }) {
		// Discord caches rendered components, so we need to reload to apply the patch properly.
		if (plugin.startedLate) {
			plugin.requireReload()
			return
		}

		setStorage(jsonStorage)

		cleanup(
			// modules/chat/native/TypingIndicator.tsx
			getModules(
				withProps<{
					default: MemoComponent<{ channel: BasicChannel }>
					useTypingUserIdsForDisplay: unknown
				}>('useTypingUserIdsForDisplay'),
				TypingIndicatorModule => {
					cleanup(patchTypingIndicator(TypingIndicatorModule.default))
				},
			),
			// modules/channel_list_v2/native/renderRedesignChannelListItem.tsx
			getModules(
				withProps<{ renderChannelListItem(...args: any[]): ReactNode }>(
					'renderChannelListItem',
				),
				ChannelListItemModule => {
					cleanup(patchChannelList(ChannelListItemModule))
				},
			),
		)
	},
	stop({ plugin }) {
		// We could force a re-render, but you aren't going to be constantly enabling and disabling this plugin anyways.
		plugin.requireReload()
	},
	SettingsComponent,
})

const patchedRenderItems = new WeakMap<
	RenderTypingIndicator,
	RenderTypingIndicator
>()

/**
 * <TypingIndicator>
 *   <TransitionItem item={...} renderItem={renderTypingIndicator}>
 *     <TypingIndicatorInner channel={...} typingUserIds={...}>
 *       ...
 *         <Ellipsis />
 *         <Text>A, B, and C are typing...</Text>
 */
function patchTypingIndicator(
	TypingIndicator: MemoComponent<{ channel: BasicChannel }>,
) {
	return after(TypingIndicator, 'type', tree => {
		const transitionItem = tree as ReactElement<{
			renderItem: RenderTypingIndicator
		}>

		const renderItem = transitionItem?.props?.renderItem
		if (typeof renderItem !== 'function') return tree

		let patchedRenderItem = patchedRenderItems.get(renderItem)
		if (!patchedRenderItem) {
			patchedRenderItem = (...args) => {
				const element = renderItem(...args)
				if (!isValidElement(element) || typeof element.type !== 'function')
					return element

				const Inner = wrapComponent(element.type, patchTypingView)
				return <Inner key={element.key} {...element.props} />
			}

			patchedRenderItems.set(renderItem, patchedRenderItem)
		}

		// The element may be cached, so never mutate it
		return cloneElement(transitionItem, { renderItem: patchedRenderItem })
	})
}

function patchTypingView(tree: ReactNode, props: TypingIndicatorInnerProps) {
	if (!props.typingUserIds.length) return tree

	return replaceElement(
		tree,
		element => element.type === Design.Text,
		text => (
			<TypingText
				text={text}
				channel={props.channel}
				typingUserIds={props.typingUserIds}
			/>
		),
	)
}

/**
 * The channel row components are not exported anywhere they can be found reliably,
 * so we grab them from what Discord renders.
 *
 * <>
 *   <TextChannel channel={...} selected muted isSuggestedSection />
 * </>
 *
 * <View>
 *   <ThreadChannel threadId={...} threadIndex={0} threadCount={1} selected />
 * </View>
 */
function patchChannelList(ChannelListItemModule: {
	renderChannelListItem(...args: any[]): ReactNode
}) {
	let unpatchTextChannel: (() => unknown) | undefined

	const unpatchRenderItem = after(
		ChannelListItemModule,
		'renderChannelListItem',
		tree => {
			if (!unpatchTextChannel) {
				const row = findElement<TextChannelProps>(
					tree,
					element =>
						'isSuggestedSection' in element.props &&
						element.props.channel != null &&
						typeof (element.type as MemoComponent<TextChannelProps>)?.type ===
							'function',
				)

				if (row)
					unpatchTextChannel = patchTextChannel(
						row.type as MemoComponent<TextChannelProps>,
					)
			}

			// ThreadChannel is a plain function component captured at import time,
			// so the element type has to be swapped instead of patching the module
			return replaceElement(
				tree,
				element =>
					'threadId' in element.props &&
					!('channel' in element.props) &&
					typeof element.type === 'function',
				thread => {
					const ThreadChannel = wrapComponent(
						thread.type as FC<ThreadChannelProps>,
						patchThreadChannelView,
					)

					return <ThreadChannel key={thread.key} {...thread.props} />
				},
			)
		},
	)

	return () => {
		unpatchRenderItem()
		unpatchTextChannel?.()
	}
}

const isChannelTrailing = (element: ReactElement<any>) =>
	'isChannelSelected' in element.props

/**
 * <>
 *   ...
 *   <Pressable>
 *     <View>
 *       <ChannelIcon />
 *       <Text>channel-name</Text>
 *       <ChannelTypingIndicator /> <- Inserted
 *       <ChannelTrailing channel={...} isChannelSelected muted />
 */
function patchTextChannel(TextChannel: MemoComponent<TextChannelProps>) {
	return instead(TextChannel, 'type', function (args, orig) {
		const [{ channel, muted }] = args

		return insertElementBefore(
			Reflect.apply(orig, this, args) as ReactNode,
			isChannelTrailing,
			<ChannelTypingIndicator
				key="better-typing-indicators"
				channel={channel}
				muted={muted}
			/>,
		)
	})
}

/**
 * <ThreadChannel threadId={...}>
 *   <ThreadChannelInner channel={...} threadId={...} />
 */
function patchThreadChannelView(tree: ReactNode) {
	if (!isValidElement<ThreadChannelInnerProps>(tree)) return tree
	if (typeof tree.type !== 'function' || !tree.props.channel) return tree

	const ThreadChannelInner = wrapComponent(
		tree.type as FC<ThreadChannelInnerProps>,
		useThreadChannelInnerView,
	)

	return <ThreadChannelInner key={tree.key} {...tree.props} />
}

const isThreadChannelItem = (element: ReactElement<any>) =>
	'channelInfo' in element.props && 'channel' in element.props

/**
 * <>
 *   ...
 *   <View>
 *     ...
 *     <ChannelItem channel={...} muted channelInfo={<>
 *       <ChannelTypingIndicator /> <- Inserted
 *       <Badge />
 *     </>} />
 */
function useThreadChannelInnerView(
	tree: ReactNode,
	{ channel }: ThreadChannelInnerProps,
) {
	const item = findElement<ThreadChannelItemProps>(tree, isThreadChannelItem)
	// Rendered here, so the trailing area is left alone (it adds padding when non-null) if nobody is typing
	const indicator = useChannelTypingIndicator(channel, item?.props.muted)

	if (!item || !indicator) return tree

	return replaceElement(tree, isThreadChannelItem, item => {
		const { channelInfo } = item.props as ThreadChannelItemProps

		return cloneElement(item, {
			channelInfo: (
				<>
					{indicator}
					{channelInfo}
				</>
			),
		})
	})
}
