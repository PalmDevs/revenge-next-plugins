import { Stores } from '@revenge-mod/discord/flux'
import { getModules } from '@revenge-mod/modules/finders'
import {
    createFilterGenerator,
    FilterFlag,
    withProps,
} from '@revenge-mod/modules/finders/filters'
import { instead } from '@revenge-mod/patcher'
import { canActuallyUse, ProductCatalog } from '../..'
import { promptNoPermissionsContinueAnyway } from '../../components/NoPermissionsAlert'
import { promptUnsupportedStickerAlert as showUnsupportedStickerAlert } from '../../components/UnsupportedStickerAlert'
import type { DiscordModules } from '@revenge-mod/discord/types'
import type {
    Filter,
    FilterGenerator,
} from '@revenge-mod/modules/finders/filters'
import type { FC, MemoExoticComponent } from 'react'
import type { FakeNitroPluginContext } from '../..'
import type {
    BasicEmoji,
    BasicMessageData,
    BasicSticker,
    EmojiConstants,
    EmojiPickerList,
    EmojiUtils,
} from './types'

const EMBED_LINKS = 1n << 14n
const USE_EXTERNAL_STICKERS = 1n << 37n

let EmojiUtilsModule!: EmojiUtils

export default function fakeifyExpressions(api: FakeNitroPluginContext) {
    patchEmojiPicker(api)
    patchSendAndEditMessages(api)
}

function patchEmojiPicker({
    cleanup,
    plugin,
    unscoped: {
        modules: {
            finders: {
                lookupModuleWithImportedPath,
                getModules,
                filters: { withProps },
            },
        },
        patcher: { before },
    },
}: FakeNitroPluginContext) {
    cleanup(
        // utils/EmojiUtils.tsx
        getModules(withProps<EmojiUtils>('countEmoji'), exports => {
            EmojiUtilsModule = exports

            const [EmojiConstants] =
                lookupModuleWithImportedPath<EmojiConstants>(
                    'modules/emojis/EmojiConstants.tsx',
                )

            if (!EmojiConstants) {
                plugin.errors.push(
                    new Error('Failed to find EmojiConstants module'),
                )
                plugin.disable()
                return
            }

            const ALLOWED_INTENTIONS = new Set([
                EmojiConstants.EmojiIntention.CHAT,
                EmojiConstants.EmojiIntention.POLLS,
                EmojiConstants.EmojiIntention.AUTO_SUGGESTION,
            ])

            cleanup(
                instead(
                    exports.default,
                    'getEmojiUnavailableReason',
                    function (args, orig) {
                        const [{ intention, bypass }] = args

                        if (ALLOWED_INTENTIONS.has(intention) && !bypass)
                            return null

                        return orig.apply(this, args)
                    },
                ),
                // modules/emoji_picker/native/components/EmojiPickerList.tsx
                getModules(
                    withMemoizedNamedFunctionComponent<EmojiPickerList>(
                        'EmojiPickerList',
                    ),
                    EmojiPickerListModule => {
                        const emptySet = new Set<string>()

                        cleanup(
                            before(EmojiPickerListModule, 'type', args => {
                                const [props] = args

                                const isPickingForChat = ALLOWED_INTENTIONS.has(
                                    props.emojiPickerIntention,
                                )

                                if (isPickingForChat) {
                                    for (const cat of props.categories) {
                                        if ('emojisDisabled' in cat) {
                                            cat.emojisDisabled = emptySet
                                            cat.isNitroLocked = false
                                        }
                                    }
                                }

                                return args
                            }),
                        )
                    },
                ),
            )
        }),
    )
}

function patchSendAndEditMessages({
    cleanup,
    storage,
}: FakeNitroPluginContext) {
    cleanup(
        getModules(
            withProps<{
                sendMessage: (
                    channelId: string,
                    data: BasicMessageData,
                    _: unknown,
                    extraData: object,
                ) => Promise<any>
                editMessage: (
                    channelId: string,
                    _: unknown,
                    data: BasicMessageData,
                ) => Promise<any>
                sendStickers: (
                    channelId: string,
                    stickerIds: string[],
                    _: unknown,
                    extraData: object,
                ) => Promise<any>
            }>('sendMessage'),
            MessageActionCreators => {
                const PermissionStore =
                    Stores.PermissionStore as DiscordModules.Flux.Store<{
                        can: (perm: bigint, channel: any) => boolean
                    }>

                const ChannelStore =
                    Stores.ChannelStore as DiscordModules.Flux.Store<{
                        getChannel: (id: string) => any
                    }>

                const StickersStore =
                    Stores.StickersStore as DiscordModules.Flux.Store<{
                        getStickerById(id: string): BasicSticker | undefined
                    }>

                async function patchSendOrEditArgs(
                    channelId: string,
                    data: BasicMessageData,
                ) {
                    const settings = await storage.get()
                    const channel = ChannelStore.getChannel(channelId)

                    let bypassed = false

                    function replaceEmoji(emoji: BasicEmoji) {
                        const link = buildEmojiUrl(
                            emoji,
                            settings.expressions.emojis.size,
                        )

                        const text = !settings.expressions.hyperlink
                            ? `${link}&name=${encodeURIComponent(emoji.name)}`
                            : linkWithConfig(
                                  link,
                                  emoji.name,
                                  settings.expressions.hyperlink,
                              )

                        data.content = data.content.replace(
                            buildEmojiString(emoji),
                            text,
                        )
                    }

                    if (data.invalidEmojis?.length) {
                        bypassed = true

                        for (const emoji of data.invalidEmojis) {
                            replaceEmoji(emoji)
                        }

                        data.invalidEmojis = []
                    }

                    if (data.validNonShortcutEmojis?.length) {
                        const bypassedEmojis = new Set<BasicEmoji>()

                        for (const emoji of data.validNonShortcutEmojis) {
                            const unavailableReason =
                                EmojiUtilsModule.default.getEmojiUnavailableReason(
                                    // @ts-expect-error: We don't need the intention prop really
                                    {
                                        channel,
                                        emoji,
                                        bypass: true,
                                    },
                                )

                            if (unavailableReason === null) continue

                            bypassedEmojis.add(emoji)
                            replaceEmoji(emoji)
                        }

                        data.validNonShortcutEmojis =
                            data.validNonShortcutEmojis.filter(
                                e => !bypassedEmojis.has(e),
                            )

                        bypassed ||= bypassedEmojis.size > 0
                    }

                    if (
                        bypassed &&
                        settings.expressions.checkPermission &&
                        !PermissionStore.can(EMBED_LINKS, channel) &&
                        !(await promptNoPermissionsContinueAnyway())
                    ) {
                        throw new Error('Fake Nitro: Canceled by user')
                    }
                }

                cleanup(
                    instead(
                        MessageActionCreators,
                        'sendMessage',
                        async function patchSendMessage(args, orig) {
                            const settings = await storage.get()
                            if (settings.expressions.emojis.size)
                                await patchSendOrEditArgs(args[0], args[1])
                            return orig.apply(this, args)
                        },
                    ),
                    instead(
                        MessageActionCreators,
                        'editMessage',
                        async function patchEditMessage(args, orig) {
                            const settings = await storage.get()
                            if (settings.expressions.emojis.size)
                                await patchSendOrEditArgs(args[0], args[2])
                            return orig.apply(this, args)
                        },
                    ),
                    instead(
                        MessageActionCreators,
                        'sendStickers',
                        async function (args, original) {
                            const settings = await storage.get()
                            if (!settings.expressions.stickers.size)
                                return await original.apply(this, args)

                            const [channelId, stickerIds, _, extra] = args
                            const channel = ChannelStore.getChannel(channelId)
                            const stickers = stickerIds
                                .map(id => {
                                    const sticker =
                                        StickersStore.getStickerById(id)

                                    const canUseExternalStickers =
                                        canActuallyUse(
                                            ProductCatalog.STICKERS_EVERYWHERE,
                                        ) &&
                                        PermissionStore.can(
                                            USE_EXTERNAL_STICKERS,
                                            channel,
                                        )

                                    if (
                                        !sticker ||
                                        'pack_id' in sticker ||
                                        (sticker.available &&
                                            (canUseExternalStickers ||
                                                sticker.guild_id ===
                                                    channel.guild_id))
                                    )
                                        return

                                    const link = buildStickerUrl(
                                        sticker,
                                        settings.expressions.stickers.size,
                                    )

                                    return linkWithConfig(
                                        link,
                                        sticker.name,
                                        settings.expressions.hyperlink,
                                    )
                                })
                                .filter(Boolean)

                            if (stickers.length) {
                                if (
                                    !PermissionStore.can(
                                        EMBED_LINKS,
                                        channel,
                                    ) &&
                                    settings.expressions.checkPermission &&
                                    !(await promptNoPermissionsContinueAnyway())
                                ) {
                                    throw new Error(
                                        'Fake Nitro: Canceled by user',
                                    )
                                }

                                return await MessageActionCreators.sendMessage(
                                    channelId,
                                    {
                                        content: stickers.join(' '),
                                    },
                                    _,
                                    extra,
                                )
                            }

                            return await original.apply(this, args)
                        },
                    ),
                )
            },
        ),
    )
}

function buildEmojiString(emoji: BasicEmoji) {
    return `<${emoji.animated ? 'a' : ''}:${emoji.name.replace(/~\d+$/, '')}:${emoji.id}>`
}

function buildEmojiUrl(emoji: BasicEmoji, size: number) {
    return `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'webp'}?size=${size}&name=${encodeURIComponent(emoji.name)}`
}

function buildStickerUrl(sticker: BasicSticker, size: number) {
    return `https://media.discordapp.net/stickers/${sticker.id}.${stickerFormatTypeToExtension(sticker.format_type)}?size=${size}&name=${encodeURIComponent(sticker.name)}`
}

function stickerFormatTypeToExtension(formatType: number) {
    switch (formatType) {
        case 1:
        // APNG
        case 2:
            return 'png'
        case 3:
            // LOTTIE stickers are not supported
            showUnsupportedStickerAlert()
            throw new Error('Fake Nitro: Lottie stickers are not supported')
        case 4:
            return 'gif'
    }
}

function linkWithConfig(
    link: string,
    name: string,
    config: 'invisible' | 'name' | false,
) {
    switch (config) {
        case 'invisible':
            return `[⠀](${link})`
        case 'name':
            return `[${name}](${link})`
        default:
            return link
    }
}

type WithMemoizedNamedFunctionComponent = FilterGenerator<
    <T extends FC<any>>(name: string) => Filter<MemoExoticComponent<T>, true>
>

const withMemoizedNamedFunctionComponent = createFilterGenerator(
    ([name], _, exports) => exports.type?.name === name,
    ([name]) => `byMemoizedNamedFunctionComponent(${name})`,
    FilterFlag.RequiresExports,
) as WithMemoizedNamedFunctionComponent
