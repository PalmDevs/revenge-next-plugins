import { getStore, onFluxEventDispatched } from '@revenge-mod/discord/flux'
import { registerPlugin } from '@revenge-mod/plugins/_'
import { PluginFlags } from '@revenge-mod/plugins/constants'
import SettingsComponent from './settings'
import type { FluxEventDispatchPatch } from '@revenge-mod/discord/flux'

export interface Settings {
    blocked: boolean
    ignored: boolean
    replies: boolean
}

interface BasicMessage {
    id: string
    referenced_message?: BasicMessage
    // Webhooks have no author
    author?: BasicUser
}

interface BasicUser {
    id: string
}

registerPlugin<{ storage: Settings }>(
    {
        name: 'Hide Blocked and Ignored Messages',
        id: 'palmdevs.hide-blocked-and-ignored-messages',
        author: 'Palm',
        description:
            'Hides messages from blocked or ignored users, and optionally removes replies to them.',
        icon: 'DenyIcon',
    },
    {
        storage: {
            load: true,
            default: {
                blocked: true,
                ignored: true,
                replies: false,
            },
        },
        start({ cleanup, storage, plugin }) {
            cleanup(
                getStore<{
                    isIgnoredForMessage(msg: BasicMessage): boolean
                    isBlockedForMessage(msg: BasicMessage): boolean
                }>('RelationshipStore', store => {
                    const isFilteredMessage = (msg: BasicMessage) => {
                        const { blocked, ignored } = storage.cache!

                        return (
                            (blocked && store.isBlockedForMessage(msg)) ||
                            (ignored && store.isIgnoredForMessage(msg))
                        )
                    }

                    const canHide = (msg: BasicMessage) =>
                        isFilteredMessage(msg) ||
                        (storage.cache!.replies &&
                            msg.referenced_message &&
                            isFilteredMessage(msg.referenced_message))

                    const dropHiddenMessages: FluxEventDispatchPatch<{
                        // Sometimes these events don't have message data for some reason
                        message?: BasicMessage
                        channelId: string
                    }> = event => {
                        const { message } = event
                        if (message && canHide(message)) return
                        return event
                    }

                    cleanup(
                        // Initial message load
                        onFluxEventDispatched<{
                            messages: BasicMessage[]
                        }>('LOAD_MESSAGES_SUCCESS', event => {
                            event.messages = event.messages.filter(
                                msg => !canHide(msg),
                            )

                            return event
                        }),
                        // New messages
                        onFluxEventDispatched(
                            'MESSAGE_CREATE',
                            dropHiddenMessages,
                        ),
                    )
                }),
                // If settings change, mark plugin as needing reload to apply changes
                storage.subscribe(() => {
                    plugin.flags |= PluginFlags.ReloadRequired
                }),
            )
        },
        SettingsComponent,
    },
    PluginFlags.Enabled,
    0,
)
