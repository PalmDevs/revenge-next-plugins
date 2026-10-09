import { getModules } from '@revenge-mod/modules/finders'
import { createFilterGenerator } from '@revenge-mod/modules/finders/filters'
import { after, before } from '@revenge-mod/patcher'
import { findInReactFiber, useReRender } from '@revenge-mod/utils/react'
import { SettingsComponent } from './settings'
import type {
	Filter,
	FilterGenerator,
	FilterScopes,
} from '@revenge-mod/modules/finders/filters'
import type { FC, MemoExoticComponent, ReactElement, RefObject } from 'react'

export interface Settings {
	hide: {
		app: boolean
		thread: boolean
		gift: boolean
		voice: boolean
	}
	collapse: {
		actions: boolean
		send: boolean
	}
}

let reRenderActions: ReturnType<typeof useReRender>

export default plugin<{ jsonStorage: Settings }>({
	jsonStorage: {
		load: true,
		default: {
			collapse: {
				actions: true,
				send: false,
			},
			hide: {
				gift: true,
				app: true,
				thread: true,
				voice: true,
			},
		},
	},
	async start({ cleanup, jsonStorage: storage }) {
		let patchedOnDismissActions: ActionsRef['onDismissActions']

		cleanup(
			storage.subscribe(_ => {
				reRenderActions?.()
			}),
			getModules(
				withMemoizedNamedExoticComponent<{
					hasPendingAttachments: boolean
					canSendVoiceMessage: boolean
				}>('ChatInputSendButton'),
				ChatInputSendButton => {
					cleanup(
						after(ChatInputSendButton, 'type', tree => {
							const node = findInReactFiber(
								tree as ReactElement,
								(
									tree,
								): tree is {
									props: {
										items: Array<{
											isOnCooldown: boolean
											sendEnabled: boolean
											sendVoiceMessageEnabled: boolean
										}>
									}
								} => Array.isArray(tree.props?.items),
							)

							if (!node) return tree

							const {
								props: {
									items: [item],
								},
							} = node

							if (item.sendVoiceMessageEnabled)
								item.sendVoiceMessageEnabled = !settings.hide.voice

							const { sendEnabled } = item

							reRenderActions?.()

							if (settings.collapse.send) {
								if (!sendEnabled) return null
							}

							return tree
						}),
					)
				},
			),
			getModules(
				withMemoizedNamedExoticComponent<{
					shouldShowGiftButton: boolean
					// When using DevTools, the ref is undefined
					ref: RefObject<ActionsRef | null> | undefined
				}>('ChatInputRightActions'),
				ChatInputRightActions => {
					cleanup(
						before(ChatInputRightActions, 'type', args => {
							const [props] = args

							props.shouldShowGiftButton = !settings.hide.gift

							return args
						}),
						before(ChatInputRightActions, 'type', args => {
							const ref = args[0].ref

							if (ref) {
								// Ref is only available after the first render
								requestAnimationFrame(() => {
									const { current } = ref
									if (!current) return

									const { onDismissActions } = current

									if (onDismissActions === patchedOnDismissActions) return

									patchedOnDismissActions = current.onDismissActions = () =>
										(settings.collapse.actions
											? onDismissActions
											: current.onShowActions
										).call(current)

									cleanup(() => {
										current.onDismissActions = onDismissActions
									})
								})
							}

							return args
						}),
					)

					// No cleanup to prevent breaking rules of React hooks
					before(ChatInputRightActions, 'type', args => {
						reRenderActions = useReRender()
						return args
					})
				},
			),
		)

		const settings = await storage.get()
	},
	stop() {
		reRenderActions()
	},
	SettingsComponent,
})

type WithMemoizedNamedExoticComponent = FilterGenerator<
	<P = object>(
		name: string,
	) => Filter<{
		Result: MemoExoticComponent<FC<P>>
		Scopes: [typeof FilterScopes.Initialized]
	}>
>

const withMemoizedNamedExoticComponent = createFilterGenerator(
	([name], _, exports) =>
		exports?.type?.length === 1 && exports.type.displayName === name,
	([name]) => `memoizedNamedExoticComponent(${name})`,
) as WithMemoizedNamedExoticComponent

interface ActionsRef {
	onDismissActions(): void
	onShowActions(): void
}
