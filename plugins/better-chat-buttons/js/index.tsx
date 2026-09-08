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
import type {
	ForwardRefRenderFunction,
	MemoExoticComponent,
	NamedExoticComponent,
	ReactElement,
	RefObject,
} from 'react'

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
				withMemoizedNamedForwardRefExoticComponent<
					SendButtonRef,
					{
						hasPendingAttachments: boolean
						canSendVoiceMessage: boolean
					}
				>('ChatInputSendButton'),
				ChatInputSendButton => {
					cleanup(
						after(ChatInputSendButton.type, 'render', tree => {
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
				withMemoizedNamedForwardRefExoticComponent<
					ActionsRef,
					{
						shouldShowGiftButton: boolean
					}
				>('ChatInputRightActions'),
				ChatInputRightActions => {
					cleanup(
						before(ChatInputRightActions.type, 'render', args => {
							const [props] = args

							props.shouldShowGiftButton = !settings.hide.gift

							return args
						}),
						before(ChatInputRightActions.type, 'render', args => {
							const ref = args[1] as RefObject<ActionsRef | null> | undefined // When using DevTools, the ref is undefined

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
					before(ChatInputRightActions.type, 'render', args => {
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

interface ForwardRefExoticComponent<T, P = object>
	extends NamedExoticComponent<P> {
	render: ForwardRefRenderFunction<T, P>
}

type ByMemoizedNamedForwardRefExoticComponent = FilterGenerator<
	<T, P = object>(
		name: string,
	) => Filter<{
		Result: MemoExoticComponent<ForwardRefExoticComponent<T, P>>
		Scopes: [typeof FilterScopes.Initialized]
	}>
>

const withMemoizedNamedForwardRefExoticComponent = createFilterGenerator(
	([name], _, exports) =>
		exports?.type?.render?.length === 2 && exports.type.displayName === name,
	([name]) => `memoizedNamedForwardRefExoticComponent(${name})`,
) as ByMemoizedNamedForwardRefExoticComponent

interface ActionsRef {
	onDismissActions(): void
	onShowActions(): void
}

interface SendButtonRef {
	setHasText(hasText: boolean): void
}
