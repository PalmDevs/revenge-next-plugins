import type { FC } from 'react'

declare enum EmojiIntention {
    REACTION,
    STATUS,
    COMMUNITY_CONTENT,
    CHAT,
    GUILD_STICKER_RELATED_EMOJI,
    GUILD_ROLE_BENEFIT_EMOJI,
    SOUNDBOARD,
    VOICE_CHANNEL_TOPIC,
    GIFT,
    AUTO_SUGGESTION,
    POLLS,
    PROFILE,
    MESSAGE_CONFETTI,
    GUILD_PROFILE,
    CHANNEL_NAME,
    DEFAULT_REACT_EMOJI,
}

interface BaseEmojiPickerListCategory {
    id: string
    name: string
    isNitroLocked: boolean
}

interface UnicodeEmojiPickerListCategory extends BaseEmojiPickerListCategory {
    type: 'UNICODE'
}

interface GuildEmojiPickerListCategory extends BaseEmojiPickerListCategory {
    type: 'GUILD'
    guild: object
    emojis: object[]
    emojisDisabled: Set<string>
}

interface RecentEmojiPickerListCategory extends BaseEmojiPickerListCategory {
    type: 'RECENT'
    emojis: object[]
    emojisDisabled: Set<string>
}

interface TopGuildEmojiPickerListCategory extends BaseEmojiPickerListCategory {
    type: 'TOP_GUILD_EMOJI'
    emojis: object[]
    emojisDisabled: Set<string>
}

export type EmojiPickerList = FC<{
    categories: Array<
        | UnicodeEmojiPickerListCategory
        | GuildEmojiPickerListCategory
        | RecentEmojiPickerListCategory
        | TopGuildEmojiPickerListCategory
    >
    emojiPickerIntention: EmojiIntention
    inActionSheet?: boolean
    inPortalKeyboard?: boolean
    channel: BasicChannel
}>

export interface BasicEmoji {
    animated: boolean
    name: string
    id: string
}

export interface BasicSticker {
    id: string
    name: string
    format_type: number
    available: boolean
    guild_id?: string
    pack_id?: string
}

export interface BasicMessageData {
    content: string
    invalidEmojis?: BasicEmoji[]
    validNonShortcutEmojis?: BasicEmoji[]
}

// GuildTextChannelRecord
export interface BasicChannel {
    guild_id?: string
    id: string
    isPrivate(): boolean
}

export interface EmojiUtils {
    countEmoji(...args: any[]): any
    default: {
        getEmojiUnavailableReason(data: {
            emoji: BasicEmoji
            channel?: BasicChannel
            intention: EmojiIntention
            forceIncludeExternalGuilds?: boolean
            // Our own property
            bypass?: boolean
        }): number | null
    }
}

export interface EmojiConstants {
    EmojiIntention: typeof EmojiIntention
}
