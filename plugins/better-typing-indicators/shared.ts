import { Stores } from '@revenge-mod/discord/flux'
import { lookupModule } from '@revenge-mod/modules/finders'
import {
	withDependencies,
	withName,
} from '@revenge-mod/modules/finders/filters'
import type { AssetId } from '@revenge-mod/assets/types'
import type { DiscordModules } from '@revenge-mod/discord/types'
import type { JsonStorage } from '@revenge-mod/json-storage'
import type { ImageSourcePropType } from 'react-native'

export enum DataSource {
	Global,
	Guild,
	/**
	 * For names only
	 */
	Username,
}

export const ChannelListAppearance = {
	Ellipsis: 1,
	Avatars: 2,
	IncludeMuted: 4,
} as const

export interface Settings {
	avatar: DataSource | false
	name: DataSource | false
	channel: {
		appearance: number
		maxAvatars: number
	}
}

export const DefaultSettings: Settings = {
	avatar: DataSource.Guild,
	name: DataSource.Guild,
	channel: {
		appearance: ChannelListAppearance.Ellipsis | ChannelListAppearance.Avatars,
		maxAvatars: 3,
	},
}

export let storage: JsonStorage<Settings>

export function setStorage(s: JsonStorage<Settings>) {
	storage = s
}

export interface BasicChannel {
	id: string
	guild_id?: string | null
}

export interface BasicUser {
	id: string
	username: string
	globalName: string | null
	getAvatarURL(guildId?: string | null, size?: number): string | AssetId
}

const getUserStore = () =>
	Stores.UserStore as DiscordModules.Flux.Store<{
		getUser(userId: string): BasicUser | undefined
		getCurrentUser(): BasicUser | undefined
	}>

export const getTypingStore = () =>
	Stores.TypingStore as DiscordModules.Flux.Store<{
		getTypingUsers(channelId: string): Record<string, number>
	}>

const getRelationshipStore = () =>
	Stores.RelationshipStore as DiscordModules.Flux.Store<{
		getNickname(userId: string): string | null | undefined
		isBlockedOrIgnored(userId: string): boolean
	}>

const getGuildMemberStore = () =>
	Stores.GuildMemberStore as DiscordModules.Flux.Store<{
		getNick(guildId: string, userId: string): string | null | undefined
	}>

export function getUsers(userIds: readonly string[]) {
	const UserStore = getUserStore()
	const users: BasicUser[] = []

	for (const id of userIds) {
		const user = UserStore.getUser(id)
		if (user) users.push(user)
	}

	return users
}

/**
 * Same filtering as Discord's own `useTypingUserIds`: no current user, no blocked or ignored users.
 */
export function getTypingUserIds(channelId: string) {
	const UserStore = getUserStore()
	const RelationshipStore = getRelationshipStore()

	const currentUserId = UserStore.getCurrentUser()?.id
	const ids: string[] = []

	for (const id in getTypingStore().getTypingUsers(channelId)) {
		if (id === currentUserId) continue
		if (!UserStore.getUser(id)) continue
		if (RelationshipStore.isBlockedOrIgnored(id)) continue
		ids.push(id)
	}

	return ids
}

export function getAvatarSource(
	user: BasicUser,
	guildId: string | null | undefined,
	source: DataSource,
): ImageSourcePropType {
	const avatar = user.getAvatarURL(
		source === DataSource.Guild ? guildId : undefined,
		// 2x for high density screens
		32,
	)

	return typeof avatar === 'string' ? { uri: avatar } : avatar
}

export function getName(
	user: BasicUser,
	guildId: string | null | undefined,
	source: DataSource,
) {
	switch (source) {
		case DataSource.Username:
			return user.username

		// biome-ignore lint/suspicious/noFallthroughSwitchClause: Intentional fallback
		case DataSource.Guild: {
			const nick = guildId && getGuildMemberStore().getNick(guildId, user.id)
			if (nick) return nick
		}

		case DataSource.Global:
			return (
				getRelationshipStore().getNickname(user.id) ||
				user.globalName ||
				user.username
			)
	}
}

type ShowUserProfileActionSheet = (opts: {
	ignoreBlockedSpeedBump?: boolean
	userId: string
	channelId?: string
}) => void

let showUserProfileActionSheet: ShowUserProfileActionSheet | undefined

export function openUserProfile(userId: string, channelId?: string) {
	if (!showUserProfileActionSheet) {
		const { relative } = withDependencies

		const [, AsyncToGeneratorModuleId] = lookupModule(
			withName('_asyncToGenerator'),
		)
		const [, AsyncRequireModuleId] = lookupModule(withName('asyncRequire'))

		// modules/user_profile/native/showUserProfileActionSheet.tsx
		;[showUserProfileActionSheet] = lookupModule(
			withName<ShowUserProfileActionSheet>('showUserProfileActionSheet').and(
				withDependencies([
					AsyncToGeneratorModuleId!,
					null,
					null,
					null,
					null,
					AsyncRequireModuleId!,
					relative(1),
					relative(2),
					null,
					relative(3),
					null,
					null,
					2,
				]),
			),
		)
	}

	showUserProfileActionSheet?.({ userId, channelId })
}
