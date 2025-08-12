import { getModule, lookupModule } from '@revenge-mod/modules/finders'
import { createFilterGenerator } from '@revenge-mod/modules/finders/filters'
import { after, before } from '@revenge-mod/patcher'
import { registerPlugin } from '@revenge-mod/plugins/_'
import { PluginFlags } from '@revenge-mod/plugins/constants'
import { findInReactFiber } from '@revenge-mod/utils/react'
import { SettingsComponent } from './settings'
import type {
    Filter,
    FilterGenerator,
} from '@revenge-mod/modules/finders/filters'
import type {
    ForwardRefRenderFunction,
    MemoExoticComponent,
    NamedExoticComponent,
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

registerPlugin<{ storage: Settings }>(
    {
        id: 'palmdevs.better-chat-buttons',
        name: 'Better Chat Buttons',
        description:
            'Hiding all annoying chat buttons, or making them never collapse, all configurable.',
        author: 'PalmDevs',
        icon: 'ChatCheckIcon',
    },
    {
        storage: {
            load: true,
            default: {
                collapse: {
                    actions: false,
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
        async start({ cleanup, storage }) {
            cleanup(
                getModule(
                    byMemoizedNamedExoticComponent<
                        SendButtonRef,
                        {
                            hasPendingAttachments: boolean
                            canSendVoiceMessage: boolean
                        }
                    >('ChatInputSendButton'),
                    ChatInputSendButton => {
                        const [ChatInputActions] = lookupModule(
                            byMemoizedNamedExoticComponent<
                                ActionsRef,
                                {
                                    canStartThreads: boolean
                                    isAppLauncherEnabled: boolean
                                    shouldShowGiftButton: boolean
                                }
                            >('ChatInputActions'),
                        )

                        let patchedOnDismissActions: ActionsRef['onDismissActions']

                        cleanup(
                            after(ChatInputSendButton.type, 'render', tree => {
                                const node = findInReactFiber(
                                    tree as Extract<typeof tree, object>,
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
                                    item.sendVoiceMessageEnabled =
                                        !settings.hide.voice

                                if (settings.collapse.send) {
                                    const { isOnCooldown, sendEnabled } = item
                                    if (isOnCooldown || !sendEnabled)
                                        return null
                                }

                                return tree
                            }),

                            before(ChatInputActions!.type, 'render', args => {
                                const [props] = args

                                if (props.isAppLauncherEnabled)
                                    props.isAppLauncherEnabled =
                                        !settings.hide.app
                                if (props.canStartThreads)
                                    props.canStartThreads =
                                        !settings.hide.thread
                                props.shouldShowGiftButton = !settings.hide.gift

                                return args
                            }),
                            before(ChatInputActions!.type, 'render', args => {
                                const ref = args[1] as
                                    | RefObject<ActionsRef | null>
                                    | undefined // When using DevTools, the ref is undefined

                                if (ref) {
                                    // Ref is only available after the first render
                                    requestAnimationFrame(() => {
                                        const { current } = ref
                                        if (!current) return

                                        const { onDismissActions } = current

                                        if (
                                            onDismissActions ===
                                            patchedOnDismissActions
                                        )
                                            return

                                        patchedOnDismissActions =
                                            current.onDismissActions = () =>
                                                (settings.collapse.actions
                                                    ? onDismissActions
                                                    : current.onShowActions
                                                ).call(current)

                                        cleanup(() => {
                                            current.onDismissActions =
                                                onDismissActions
                                        })
                                    })
                                }

                                return args
                            }),
                        )
                    },
                ),
            )

            const settings = await storage.get()
        },
        SettingsComponent,
    },
    PluginFlags.Enabled,
    0,
)

interface ForwardRefExoticComponent<T, P = object>
    extends NamedExoticComponent<P> {
    render: ForwardRefRenderFunction<T, P>
}

type ByMemoizedNamedExoticComponent = FilterGenerator<
    <T, P = object>(
        name: string,
    ) => Filter<MemoExoticComponent<ForwardRefExoticComponent<T, P>>, true>
>

const byMemoizedNamedExoticComponent = createFilterGenerator(
    ([name], _, exports) =>
        exports.type?.render?.length === 2 && exports.type.displayName === name,
    ([name]) => `byMemoizedNamedExoticComponent(${name})`,
) as ByMemoizedNamedExoticComponent

interface ActionsRef {
    onDismissActions(): void
    onShowActions(): void
}

interface SendButtonRef {
    setHasText(hasText: boolean): void
}
