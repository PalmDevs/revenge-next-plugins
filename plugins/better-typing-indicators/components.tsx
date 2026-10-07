import { Design } from '@revenge-mod/discord/design'
import { lookupModule } from '@revenge-mod/modules/finders'
import { withProps } from '@revenge-mod/modules/finders/filters'
import {
	cloneElement,
	isValidElement,
	useCallback,
	useMemo,
	useSyncExternalStore,
} from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import {
	ChannelListAppearance,
	getAvatarSource,
	getName,
	getTypingStore,
	getTypingUserIds,
	getUsers,
	openUserProfile,
	storage,
} from './shared'
import type { DiscordModules } from '@revenge-mod/discord/types'
import type { ComponentProps, FC, ReactElement, ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { BasicChannel, BasicUser, Settings } from './shared'

const { Text } = Design

type EllipsisComponent = FC<{ style?: StyleProp<ViewStyle> }>

let Ellipsis: EllipsisComponent | undefined

/**
 * The same typing ellipsis as the one in chat. (`Design.Ellipsis` is the button loading indicator)
 */
function TypingEllipsis(props: { style?: StyleProp<ViewStyle> }) {
	Ellipsis ??= lookupModule(
		withProps<{ Ellipsis: EllipsisComponent; StatusWithTyping: unknown }>(
			'Ellipsis',
			'StatusWithTyping',
		),
	)[0]?.Ellipsis

	return Ellipsis ? <Ellipsis {...props} /> : null
}

const AVATAR_SIZE = 16

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
	},
	user: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
		marginRight: 4,
	},
	stackedAvatar: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
	},
	stackedAvatarOverlap: {
		marginLeft: -4,
	},
	channelIndicator: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 4,
	},
	channelEllipsis: {
		marginRight: 4,
	},
})

type TextProps = ComponentProps<DiscordModules.Components.Text>

export interface TypingTextProps {
	/**
	 * The original typing text element Discord rendered.
	 */
	text: ReactElement<TextProps>
	channel: BasicChannel
	typingUserIds: string[]
}

/**
 * Replaces Discord's "A, B, and C are typing..." text with tappable avatars and names.
 */
export function TypingText({ text, channel, typingUserIds }: TypingTextProps) {
	const settings = storage.use()!
	const { children, style, ...textProps } = text.props

	const users = useMemo(() => getUsers(typingUserIds), [typingUserIds])

	if (settings.avatar === false && settings.name === false) return text

	const renderText = (key: string, content: ReactNode) => (
		<Text key={key} {...textProps}>
			{content}
		</Text>
	)

	const parts: ReactNode[] = []

	if (Array.isArray(children)) {
		// [<Name />, ', ', <Name />, ', and ', <Name />, ' are typing...']
		let userIndex = 0

		children.forEach((child: ReactNode, i) => {
			if (!isValidElement<{ children?: ReactNode }>(child)) {
				parts.push(renderText(`t${i}`, child))
				return
			}

			const user = users[userIndex++]
			if (!user) {
				parts.push(renderText(`t${i}`, child))
				return
			}

			parts.push(
				<TypingUser
					key={user.id}
					user={user}
					channel={channel}
					settings={settings}
					renderName={name =>
						renderText(
							'name',
							name ? cloneElement(child, undefined, name) : child,
						)
					}
				/>,
			)
		})
	} else {
		// "Several people are typing..."
		if (settings.avatar !== false)
			for (const user of users)
				parts.push(
					<TypingUser
						key={user.id}
						user={user}
						channel={channel}
						settings={{ ...settings, name: false }}
						renderName={() => null}
					/>,
				)

		parts.push(renderText('text', children))
	}

	return <View style={[styles.container, style]}>{parts}</View>
}

function TypingUser({
	user,
	channel,
	settings,
	renderName,
}: {
	user: BasicUser
	channel: BasicChannel
	settings: Settings
	renderName: (name: string | undefined) => ReactNode
}) {
	const onPress = useCallback(
		() => openUserProfile(user.id, channel.id),
		[user.id, channel.id],
	)

	const showAvatar = settings.avatar !== false
	// Never leave the user out completely
	const showName = settings.name !== false || !showAvatar

	return (
		<Pressable style={styles.user} onPress={onPress}>
			{showAvatar && (
				<Image
					source={getAvatarSource(
						user,
						channel.guild_id,
						settings.avatar as number,
					)}
					style={styles.avatar}
				/>
			)}
			{showName &&
				renderName(
					settings.name === false
						? undefined
						: getName(user, channel.guild_id, settings.name),
				)}
		</Pressable>
	)
}

function subscribeToTypingStore(callback: () => void) {
	const TypingStore = getTypingStore()
	TypingStore.addChangeListener(callback)
	return () => TypingStore.removeChangeListener(callback)
}

function useTypingUserIds(channelId: string) {
	// Strings are compared by value, so this only re-renders when the typing users actually change
	const key = useSyncExternalStore(subscribeToTypingStore, () =>
		getTypingUserIds(channelId).join(','),
	)

	return useMemo(() => (key ? key.split(',') : []), [key])
}

/**
 * Typing indicator for channels in the channel list.
 */
export function ChannelTypingIndicator({
	channel,
	muted,
}: {
	channel: BasicChannel
	muted?: boolean
}) {
	return useChannelTypingIndicator(channel, muted)
}

/**
 * Renders the channel list typing indicator, or `null` if there is nothing to show.
 */
export function useChannelTypingIndicator(
	channel: BasicChannel,
	muted?: boolean,
) {
	const settings = storage.use()!
	const { appearance, maxAvatars } = settings.channel

	const typingUserIds = useTypingUserIds(channel.id)

	const showEllipsis = (appearance & ChannelListAppearance.Ellipsis) !== 0
	const showAvatars = (appearance & ChannelListAppearance.Avatars) !== 0
	const includeMuted = (appearance & ChannelListAppearance.IncludeMuted) !== 0

	if (!typingUserIds.length) return null
	if (!showEllipsis && !showAvatars) return null
	if (muted && !includeMuted) return null

	const users = showAvatars ? getUsers(typingUserIds.slice(0, maxAvatars)) : []
	const avatarSource = settings.avatar === false ? 0 : settings.avatar

	return (
		<View key="better-typing-indicators" style={styles.channelIndicator}>
			{showEllipsis && (
				<TypingEllipsis
					style={showAvatars ? styles.channelEllipsis : undefined}
				/>
			)}
			{users.map((user, i) => (
				<Image
					key={user.id}
					source={getAvatarSource(user, channel.guild_id, avatarSource)}
					style={[styles.stackedAvatar, i > 0 && styles.stackedAvatarOverlap]}
				/>
			))}
		</View>
	)
}
