import { Dispatcher } from '@revenge-mod/discord/common/flux'
import { getStore, onFluxEventDispatched } from '@revenge-mod/discord/flux'
import { registerPlugin } from '@revenge-mod/plugins/_'
import { PluginFlags } from '@revenge-mod/plugins/constants'
import { asap } from '@revenge-mod/utils/callback'
import SettingsComponent from './settings'
import type { FluxEventDispatchPatch } from '@revenge-mod/discord/flux'
import type { DiscordModules } from '@revenge-mod/discord/types'

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

const originalEvents = new Set<DiscordModules.Flux.DispatcherPayload>()

function redispatchOriginals() {
    asap(() => {
        for (const event of originalEvents) Dispatcher.dispatch(event)
    })
}

function redispatchOriginalsDispatchPatch(
    payload: DiscordModules.Flux.DispatcherPayload,
) {
    redispatchOriginals()
    return payload
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
            if (plugin.flags & PluginFlags.EnabledLate)
                plugin.flags |= PluginFlags.ReloadRequired

            cleanup(
                getStore<{
                    isBlocked(id: string): boolean
                    isIgnored(id: string): boolean
                }>('RelationshipStore', ({ isBlocked, isIgnored }) => {
                    const isFiltered = (id: string) => {
                        const { blocked, ignored } = storage.cache!

                        return (
                            (blocked && isBlocked(id)) ||
                            (ignored && isIgnored(id))
                        )
                    }

                    const canHide = (msg: BasicMessage) => {
                        if (!msg.author) return false

                        return (
                            isFiltered(msg.author.id) ||
                            (storage.cache!.replies &&
                                msg.referenced_message?.author &&
                                isFiltered(msg.referenced_message.author.id))
                        )
                    }

                    const dropHiddenMessages: FluxEventDispatchPatch<{
                        // Sometimes these events don't have message data for some reason
                        message?: BasicMessage
                        channelId: string
                    }> = event => {
                        const { message } = event
                        if (message && canHide(message)) event.channelId = '-1'
                        return event
                    }

                    cleanup(
                        // Initial message load
                        onFluxEventDispatched<{
                            messages: BasicMessage[]
                        }>('LOAD_MESSAGES_SUCCESS', event => {
                            originalEvents.add(event)

                            return {
                                ...event,
                                messages: event.messages.filter(
                                    msg => !canHide(msg),
                                ),
                            }
                        }),
                        // New messages and message updates
                        onFluxEventDispatched(
                            'MESSAGE_CREATE',
                            dropHiddenMessages,
                        ),
                        onFluxEventDispatched(
                            'MESSAGE_UPDATE',
                            dropHiddenMessages,
                        ),
                        // Relationship changes (blocking/unblocking, ignoring/unignoring)
                        onFluxEventDispatched(
                            'RELATIONSHIP_ADD',
                            redispatchOriginalsDispatchPatch,
                        ),
                        onFluxEventDispatched(
                            'RELATIONSHIP_REMOVE',
                            redispatchOriginalsDispatchPatch,
                        ),
                        onFluxEventDispatched(
                            'RELATIONSHIP_UPDATE',
                            redispatchOriginalsDispatchPatch,
                        ),
                    )
                }),
                // Re-dispatch original events when storage changes
                storage.subscribe(redispatchOriginals),
            )
        },
        stop({ cleanup }) {
            // Run this cleanup last
            cleanup(() => {
                redispatchOriginals()
                originalEvents.clear()
            })
        },
        SettingsComponent,
    },
    PluginFlags.Enabled,
    0,
)
