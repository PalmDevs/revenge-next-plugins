import { Stores } from '@revenge-mod/discord/flux'
import { getModules } from '@revenge-mod/modules/finders'
import { withName } from '@revenge-mod/modules/finders/filters'
import { instead } from '@revenge-mod/patcher'
import { registerPlugin } from '@revenge-mod/plugins/_'
import { PluginFlags } from '@revenge-mod/plugins/constants'
import SettingsComponent from './settings'
import type { DiscordModules } from '@revenge-mod/discord/types'

export interface Settings {
    blocked: boolean
    ignored: boolean
    replies: boolean
}

interface BasicUser {
    id: string
}

interface BasicMessage {
    id: string
    authorId?: string
    channelId: string
    referencedMessage?: {
        state: number
        message?: BasicMessage
    }
}

interface MessageRow {
    type: number
    content?: MessageRow[]
    message?: BasicMessage
}

interface MessageStoreMessage {
    // Webhooks have no author
    author?: BasicUser
    messageReference?: {
        message_id: string
    }
}

interface ChatManager {
    prototype: {
        createRow(row: MessageRow): void
    }
}

registerPlugin<{ storage: Settings }>(
    {
        name: 'Hide Blocked Messages',
        id: 'palmdevs.hide-blocked-messages',
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
            function patchChatManager(ChatManager: ChatManager) {
                const RelationshipStore =
                    Stores.RelationshipStore as DiscordModules.Flux.Store<{
                        isIgnored(userId: string): boolean
                        isBlocked(userId: string): boolean
                    }>

                const MessageStore =
                    Stores.MessageStore as DiscordModules.Flux.Store<{
                        getMessage(
                            channelId: string,
                            messageId: string,
                        ): MessageStoreMessage | undefined
                    }>

                const canHide = (userId?: string) => {
                    if (!userId) return false

                    const { blocked, ignored } = storage.cache!

                    return (
                        (blocked && RelationshipStore.isBlocked(userId)) ||
                        (ignored && RelationshipStore.isIgnored(userId))
                    )
                }

                // Doesn't need cleanup because we need to restart the plugin to apply changes anyway
                instead(
                    ChatManager.prototype,
                    'createRow',
                    function (args, orig) {
                        const [{ type, message, content }] = args

                        switch (type) {
                            // Normal message row
                            case 1: {
                                // Do some checking so we don't hide false positives
                                const { channelId, id, referencedMessage } =
                                    message!

                                if (
                                    // We can hide replies
                                    storage.cache!.replies &&
                                    // And the referenced message is not loaded (0 = loaded, 1 = not loaded, 2 = deleted)
                                    referencedMessage?.state === 1
                                ) {
                                    const referenceData =
                                        MessageStore.getMessage(
                                            channelId,
                                            id,
                                        )!.messageReference

                                    if (!referenceData) break

                                    const reference = MessageStore.getMessage(
                                        channelId,
                                        // referenceId
                                        referenceData.message_id,
                                    )

                                    if (
                                        reference?.author &&
                                        canHide(reference.author.id)
                                    )
                                        return
                                }

                                break
                            }
                            // Blocked/Ignored row
                            case 2: {
                                // Why does this work?
                                // - The generated row is either a blocked or ignored row, and will always have a message
                                // - If they stack (2+ ignored/blocked messages), the row is of the same type, so we can just check the first message
                                // - We already know that this user is blocked or ignored,
                                //   so this is just a logic to avoid hiding the row if the user turns the respective setting off
                                if (canHide(content![0]?.message?.authorId))
                                    return
                            }
                        }

                        return Reflect.apply(orig, this, args)
                    },
                )
            }

            cleanup(
                getModules(
                    withName<ChatManager>('ChatManager'),
                    patchChatManager,
                ),
                // If settings change, mark plugin as needing reload to apply changes
                // We can potentially try to regenerate the rows, but that would be more complex, and probably not worth it
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
