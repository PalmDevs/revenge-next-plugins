import { getModules } from '@revenge-mod/modules/finders'
import { withProps } from '@revenge-mod/modules/finders/filters'
import { instead } from '@revenge-mod/patcher'
import SettingsComponent from './settings'
import type { DiscordModules } from '@revenge-mod/discord/types'
import type { JsonStorage } from '@revenge-mod/json-storage'

/** Tenor API v1 key Discord used before it moved to its own GIF provider. */
const TenorKey = '3Z0688EVWYKH'
const TenorApiUrl = 'https://api.tenor.com/v1'

/** Tenor sends no more than this many results per request. */
const MaxResultsPerRequest = 50
/** The number of pages a search requests before it stops. */
const MaxSearchPages = 5

// /** The module that makes the GIF picker search bar's placeholder. */
// const GifPickerUtilsPath = 'modules/gif_picker/GifPickerUtils.tsx'
// /** The GIF provider Discord names in the placeholder. */
// const DiscordProvider = 'Klipy'
// const Provider = 'Tenor'

export const GridQualities = ['gif', 'tinygif', 'nanogif'] as const
export type GridQuality = (typeof GridQualities)[number]
export const DefaultGridQuality: GridQuality = 'tinygif'

export interface Settings {
	/** The media format requested from Tenor for GIFs shown in the picker. */
	gridQuality: GridQuality
}

let logger: DiscordModules.Logger
let storage: JsonStorage<Settings>

export default plugin<{ jsonStorage: Settings }>({
	jsonStorage: {
		load: true,
		default: {
			gridQuality: DefaultGridQuality,
		},
	},
	start({ cleanup, jsonStorage, logger: pluginLogger }) {
		storage = jsonStorage
		logger = pluginLogger

		cleanup(
			getModules(
				withProps<HttpModule>('HTTP', 'get', 'post', 'put', 'patch', 'del'),
				({ HTTP }) => cleanup(patchGifRequests(HTTP)),
			),
			// // The search bar names Discord's provider, not the one that answers
			// getModuleWithImportedPath<GifPickerUtilsModule>(
			// 	GifPickerUtilsPath,
			// 	GifPickerUtils => cleanup(patchSearchPlaceholder(GifPickerUtils)),
			// ),
			abortRequests,
		)
	},
	SettingsComponent,
})

// TENOR API

interface TenorMediaFormat {
	url: string
	dims?: [width: number, height: number]
	preview?: string
	size?: number
}

type TenorMediaFormatName =
	| GridQuality
	| 'mp4'
	| 'tinymp4'
	| 'nanomp4'
	| 'loopedmp4'
	| 'webm'
	| 'tinywebm'
	| 'nanowebm'

type TenorMedia = Partial<Record<TenorMediaFormatName, TenorMediaFormat>>

interface TenorGif {
	id: string
	title?: string
	itemurl: string
	media?: TenorMedia[]
}

interface TenorSearchResponse {
	results?: TenorGif[]
	/** The position to send as `pos` to get the next page. */
	next?: string
}

interface TenorCategory {
	searchterm: string
	image: string
}

interface TenorCategoriesResponse {
	tags?: TenorCategory[]
	results?: TenorCategory[]
}

interface TenorTermsResponse {
	results?: string[]
}

// DISCORD

/** A GIF in the shape Discord's GIF picker expects. */
interface DiscordGif {
	id: string
	title: string
	url: string
	src: string
	gif_src: string
	width: number
	height: number
	preview: string
}

interface HttpQuery {
	q?: string
	/** The ID of the GIF that was picked. Only sent for `/gifs/select`. */
	id?: string
	limit?: number
	locale?: string
}

interface HttpRequestOptions {
	url?: string
	query?: HttpQuery
}

interface HttpModule {
	HTTP: {
		get(options: HttpRequestOptions): Promise<{ body: unknown }>
	}
	get: unknown
	post: unknown
	put: unknown
	patch: unknown
	del: unknown
}

// interface GifPickerUtilsModule {
// 	getSearchPlaceholder(): string
// }

/** The query of a `/gifs/*` request, normalized to what Tenor expects. */
interface GifsRequest {
	q: string
	id?: string
	limit: number
	locale?: string
}

/**
 * Handles a `/gifs/*` request. Resolves with the response body.
 *
 * The signal aborts once the picker requests the same endpoint again.
 *
 * Return `undefined` to let Discord handle the request.
 */
type GifsEndpointHandler = (
	request: GifsRequest,
	signal: AbortSignal,
) => Promise<unknown> | undefined

// REQUESTS

// Only one request per endpoint runs at a time. A newer request replaces an
// older one. Endpoints must not share a key, because the picker requests
// several of them at once.
const controllers = new Map<string, AbortController>()

function abortable(endpoint: string) {
	controllers.get(endpoint)?.abort()

	const controller = new AbortController()
	controllers.set(endpoint, controller)

	return controller.signal
}

function abortRequests() {
	for (const controller of controllers.values()) controller.abort()
	controllers.clear()
}

function logFailure(error: unknown) {
	// Aborts are expected. They mean a newer request replaced this one.
	if ((error as Error | undefined)?.name !== 'AbortError')
		logger.error(`Tenor request failed: ${error}`)
}

/** The GIF picker has no error state, so requests must never reject. */
function recover<T>(value: T) {
	return (error: unknown) => {
		logFailure(error)
		return value
	}
}

async function tenorFetch<T>(
	path: string,
	params: Record<string, string>,
	signal?: AbortSignal,
) {
	const query = new URLSearchParams({ key: TenorKey, ...params })
	const response = await fetch(`${TenorApiUrl}/${path}?${query}`, { signal })

	if (!response.ok)
		throw new Error(`Tenor responded with ${response.status} for /${path}`)

	return (await response.json()) as T
}

// CONVERSION

function pickFormat(media: TenorMedia) {
	const { gridQuality } = storage.cache as Settings

	return (
		media[gridQuality] ?? media.tinygif ?? media.gif ?? media.mp4 ?? media.webm
	)
}

function toDiscordGif(gif: TenorGif): DiscordGif | undefined {
	const media = gif.media?.[0]
	if (!media) return

	const format = pickFormat(media)
	if (!format?.url) return

	const [width = 0, height = 0] = format.dims ?? []

	return {
		id: gif.id,
		title: gif.title ?? '',
		url: gif.itemurl,
		src: format.url,
		gif_src: format.url,
		width,
		height,
		preview: (media.tinygif ?? media.nanogif ?? format).url,
	}
}

function toDiscordGifs(gifs: TenorGif[]) {
	const converted: DiscordGif[] = []

	for (const gif of gifs) {
		const discordGif = toDiscordGif(gif)
		if (discordGif) converted.push(discordGif)
	}

	return converted
}

// ENDPOINTS

async function searchGifs(
	{ q, limit, locale }: GifsRequest,
	signal: AbortSignal,
) {
	const gifs: TenorGif[] = []
	const seen = new Set<string>()
	let position = ''

	for (let page = 0; page < MaxSearchPages && gifs.length < limit; page++) {
		const { results, next } = await tenorFetch<TenorSearchResponse>(
			'search',
			{
				q,
				limit: String(Math.min(limit - gifs.length, MaxResultsPerRequest)),
				...(locale && { locale }),
				...(position && { pos: position }),
			},
			signal,
		)

		if (!results?.length) break

		for (const gif of results) {
			// Pages can overlap, and the picker keys GIFs by ID
			if (seen.has(gif.id)) continue
			seen.add(gif.id)

			gifs.push(gif)
			if (gifs.length >= limit) break
		}

		// Tenor sends the same position once nothing is left
		if (!next || next === position) break
		position = next
	}

	return toDiscordGifs(gifs)
}

async function loadTrendingGifs(
	limit: number,
	locale: string | undefined,
	signal: AbortSignal,
) {
	const { results } = await tenorFetch<TenorSearchResponse>(
		'trending',
		{ limit: String(limit), ...(locale && { locale }) },
		signal,
	)

	return toDiscordGifs(results ?? [])
}

async function loadCategories(locale: string | undefined, signal: AbortSignal) {
	const response = await tenorFetch<TenorCategoriesResponse>(
		'categories',
		{ type: 'featured', ...(locale && { locale }) },
		signal,
	)

	const tags = response.tags ?? response.results ?? []

	return tags.map(tag => ({ name: tag.searchterm, src: tag.image }))
}

const Handlers: Record<string, GifsEndpointHandler> = {
	// The search terms shown as suggestions before the user types
	'trending-search': ({ limit, locale }, signal) =>
		tenorFetch<TenorTermsResponse>(
			'trending_terms',
			{ limit: String(limit), ...(locale && { locale }) },
			signal,
		)
			.then(response => response.results ?? [])
			.catch(recover([])),

	'trending-gifs': ({ limit, locale }, signal) =>
		loadTrendingGifs(limit, locale, signal).catch(recover([])),

	search: (request, signal) => searchGifs(request, signal).catch(recover([])),

	// The GIF picker's first view: categories, each with a preview image
	trending: async ({ locale }, signal) => {
		const [categories, gifs] = await Promise.all([
			loadCategories(locale, signal).catch(recover([])),
			loadTrendingGifs(1, locale, signal).catch(recover([])),
		])

		// The picker always shows a header GIF, so it needs one GIF
		return { categories, gifs: gifs.length ? gifs : [{ src: '' }] }
	},

	suggest: ({ q, limit, locale }, signal) => {
		// Nothing to suggest for. Let Discord handle it.
		if (!q) return

		return tenorFetch<TenorTermsResponse>(
			'search_suggestions',
			{ q, limit: String(limit), ...(locale && { locale }) },
			signal,
		)
			.then(response => response.results ?? [])
			.catch(recover([]))
	},

	select: async ({ q, id, locale }) => {
		// Tenor gives better results if it knows which GIF was picked. The picker
		// does not have to wait for it.
		if (id)
			tenorFetch('registershare', {
				id,
				...(q && { q }),
				...(locale && { locale }),
			}).catch(logFailure)

		return {}
	},
}

// PATCHES

/**
 * Answers a GIF picker request with Tenor's data.
 *
 * Returns `undefined` for every request the plugin does not handle.
 */
function handleGifsRequest(options: HttpRequestOptions | undefined) {
	const url = options?.url?.toLowerCase()
	if (!url?.includes('/gifs/')) return

	// Discord uses both `trending-gifs` and `trending_gifs`
	const endpoint = url.slice(url.lastIndexOf('/') + 1).replaceAll('_', '-')

	const handler = Handlers[endpoint]
	if (!handler) return

	const { q, id, limit, locale } = options!.query ?? {}

	return handler(
		{
			q: q ?? '',
			id,
			limit: limit ?? MaxResultsPerRequest,
			// Discord's locales look like `en-US`. Tenor's look like `en_us`.
			locale: locale?.replace('-', '_').toLowerCase(),
		},
		abortable(endpoint),
	)
}

function patchGifRequests(HTTP: HttpModule['HTTP']) {
	return instead(HTTP, 'get', function (args, orig) {
		const body = handleGifsRequest(args[0])

		return body?.then(body => ({ body })) ?? Reflect.apply(orig, this, args)
	})
}

// function patchSearchPlaceholder(GifPickerUtils: GifPickerUtilsModule) {
// 	// The placeholder is localized, so replace only the provider's name
// 	return after(GifPickerUtils, 'getSearchPlaceholder', placeholder =>
// 		placeholder.replace(DiscordProvider, Provider),
// 	)
// }
