import { ReactNavigationParamList } from './react-navigation-CQybBCfP.js'
import { Filter, FilterGenerator, Metro } from './types-cJK__Kwg.js'
import {
	ComponentProps,
	ComponentType,
	FC,
	ReactElement,
	ReactNode,
	RefAttributes,
	RefObject,
} from 'react'
import { EventEmitter } from 'node:events'
import { StackScreenProps } from '@react-navigation/stack'
import {
	ImageSourcePropType,
	ImageStyle,
	PressableProps,
	StyleProp,
	TextInputProps as TextInputProps$1,
	TextProps as TextProps$1,
	TextStyle,
	View,
	ViewProps,
	ViewStyle,
} from 'react-native'
import { NavigationContainerRef } from '@react-navigation/core'

//#region lib/discord/src/types/native.d.ts
declare namespace DiscordNativeModules {
	/**
	 * Key-value storage
	 */
	interface CacheModule {
		/**
		 * Get the value for the given `key`, or null
		 * @param key The key to fetch
		 */
		getItem: (key: string) => Promise<string | null>
		/**
		 * Deletes the value for the given `key`
		 * @param key The key to delete
		 */
		removeItem: (key: string) => void
		/**
		 * Sets the value of `key` to `value`
		 */
		setItem: (key: string, value: string) => void
		/**
		 * Goes through every item in storage and returns it, excluding the keys specified in `exclude`.
		 * @param exclude A list of items to exclude from result
		 */
		refresh: (exclude: string[]) => Promise<Record<string, string>>
		/**
		 * Clears ALL of Discord's settings.
		 */
		clear: () => void
	}
	/**
	 * File manager
	 */
	interface FileModule {
		/**
		 * @param path **Full** path to file
		 */
		fileExists: (path: string) => Promise<boolean>
		/**
		 * Reads an asset from the given URI
		 * @param nameOrUri The name or URI to read from (`http://` scheme is supported)
		 * @param encoding The encoding to read the asset with
		 * @returns
		 */
		readAsset: (
			nameOrUri: string,
			encoding: 'base64' | 'utf8',
		) => Promise<string>
		/**
		 * Allowed URI schemes on Android: `file://`, `content://` ([See here](https://developer.android.com/reference/android/content/ContentResolver#accepts-the-following-uri-schemes:_3))
		 */
		getSize: (uri: string) => Promise<boolean>
		/**
		 * @param path **Full** path to file
		 * @param encoding Set to `base64` in order to encode response
		 */
		readFile(path: string, encoding: 'base64' | 'utf8'): Promise<string>
		saveFileToGallery?(
			uri: string,
			fileName: string,
			fileType: 'PNG' | 'JPEG',
		): Promise<string>
		/**
		 * @param storageDir Either `cache` or `documents`.
		 * @param path Path in `storageDir`, parents are recursively created.
		 * @param data The data to write to the file
		 * @param encoding Set to `base64` if `data` is base64 encoded.
		 * @returns Promise that resolves to path of the file once it got written
		 */
		writeFile(
			storageDir: 'cache' | 'documents',
			path: string,
			data: string,
			encoding: 'base64' | 'utf8',
		): Promise<string>
		/**
		 * Removes a file from the path given.
		 * @param storageDir Either `cache` or `documents`
		 * @param path Path to the file to be removed
		 */
		removeFile(
			storageDir: 'cache' | 'documents',
			path: string,
		): Promise<boolean>
		/**
		 * Clear the folder from the path given
		 * (!) On Android, this only clears all *files* and not subdirectories!
		 * @param storageDir Either `cache` or `documents`
		 * @param path Path to the folder to be cleared
		 * @returns Whether the clearance succeeded
		 */
		clearFolder(
			storageDir: 'cache' | 'documents',
			path: string,
		): Promise<boolean>
		getConstants(): {
			/**
			 * The path the `documents` storage dir (see {@link writeFile}) represents.
			 */
			DocumentsDirPath: string
			CacheDirPath: string
		}
	}
	/**
	 * Client information
	 */
	interface ClientInfoModule {
		getConstants(): {
			/**
			 * Sentry ingestion DSN URL for alpha/beta builds
			 */
			SentryAlphaBetaDsn: string
			/**
			 * Sentry ingestion DSN URL for staff builds (?)
			 */
			SentryStaffDsn: string
			/**
			 * Sentry ingestion DSN URL for stable builds
			 */
			SentryDsn: string
			DeviceVendorID: string
			Manifest: string
			/**
			 * Version code
			 *
			 * Follows the format of `{MINOR}{CHANNEL}{PATCH}` for `{MINOR}.{PATCH} ({CHANNEL})`
			 * - `248200` for `248.0 (alpha)`
			 * - `247105` for `247.5 (beta)`
			 * - `246011` for `246.11 (stable)`
			 */
			Build: string
			/**
			 * Version string
			 *
			 * Eg. `248.0`
			 */
			Version: string
			/**
			 * Release channel
			 */
			ReleaseChannel: string
			/**
			 * Matches `Version`
			 */
			OTABuild: string
			/**
			 * Identifier for the installed client
			 *
			 * - **Android**: Package name
			 * - **iOS**: Bundle ID
			 */
			Identifier: string
		}
	}
	/**
	 * OTA updates, app reloads, etc.
	 */
	interface BundleUpdaterManager {
		/**
		 * Reloads the app
		 */
		reload(): void
	}
	/**
	 * Device information
	 */
	interface DeviceModule {
		/**
		 * Returns the screen size of the device
		 */
		getScreenSize(): {
			width: number
			height: number
		}
		getConstants(): {
			/**
			 * Maximum CPU frequency
			 * @example "2.00"
			 */
			maxCpuFreq: string
			/**
			 * The brand of the device
			 * - On Android, returns the value of `ro.product.brand`
			 */
			deviceBrand: string
			/**
			 * Whether the device is using gesture navigation
			 */
			isGestureNavigationEnabled: boolean
			/**
			 * The manufacturer of the device
			 * - On Android, returns the value of `ro.product.manufacturer`
			 */
			deviceManufacturer: string
			/**
			 * RAM size in gigabytes (most likely an approximation)
			 * @example "3.62"
			 */
			ramSize: string
			/**
			 * The device's DPI setting
			 */
			smallestScreenWidth: number
			/**
			 * The version of the system
			 * - On Android, returns the value of `ro.build.version.sdk`
			 */
			systemVersion: string
			/**
			 * Whether the system taskbar navigation is enabled
			 */
			isTaskBarEnabled: boolean
			/**
			 * The name of the device product
			 * - On Android, returns the value of `ro.product.name`
			 */
			deviceProduct: string
			/**
			 * The model of the device
			 * - On Android, returns the value of `ro.product.model`
			 */
			deviceModel: string
			/**
			 * The name of the device
			 * - On Android, returns the value of `ro.product.device`
			 */
			device: string
			/**
			 * The name of the device board
			 * - On Android, returns the value of `{ro.product.manufacturer}_{ro.soc.model}`
			 * @example "Google_Tensor G4" // ro.product.manufacturer=Google; ro.soc.model=Tensor G4
			 */
			socName: string
		}
	}
	/**
	 * Manage theme settings, saturation settings, etc.
	 *
	 * This only manages the native-side components and already-rendered native components will need to be re-rendered to apply changes.
	 */
	interface ThemeModule {
		/**
		 * Sets the saturation value
		 * @param saturation The saturation value to set
		 */
		updateSaturation(saturation: number): void
		/**
		 * Sets the theme
		 * @param theme The theme to set
		 */
		updateTheme(theme: 'dark' | 'light'): void
	}
}
declare namespace actions_d_exports {
	export { ActionSheetActionCreators, AlertActionCreators, ToastActionCreators }
}
declare let ActionSheetActionCreators: DiscordModules.Actions.ActionSheetActionCreators
declare let AlertActionCreators: DiscordModules.Actions.AlertActionCreators
declare let ToastActionCreators: DiscordModules.Actions.ToastActionCreators
//#endregion
//#region lib/discord/src/preinit.d.ts
declare const AppStartPerformance$1: DiscordModules.AppStartPerformance
declare namespace flux_d_exports$1 {
	export {
		ByStore,
		ByStoreName,
		Dispatcher,
		DispatcherModuleId,
		Stores,
		byStore,
		byStoreName,
		getStore,
	}
}
declare const Dispatcher: DiscordModules.Flux.Dispatcher,
	DispatcherModuleId: number
/**
 * A proxy object that allows you to access Flux stores by their name, including uninitialized stores.
 *
 * Use `Reflect.ownKeys()` on this proxy to get a list of all initialized stores.
 *
 * @see {@link getStore} for a way to get stores lazily.
 */
declare const Stores: Record<string, DiscordModules.Flux.Store<object>>
/**
 * Gets a Flux store by its name, and calls the provided callback with the store.
 *
 * @param name The name of the store to get.
 * @param callback A callback that will be called with the store once it is found.
 * @returns A function that can be used to cancel the wait for the store.
 */
declare function getStore<T>(
	name: string,
	callback: (store: DiscordModules.Flux.Store<T>) => void,
): () => void
type ByStore = FilterGenerator<
	<T>() => Filter<DiscordModules.Flux.Store<T>, boolean>
>
/**
 * A dynamic filter that matches all Flux stores.
 */
declare const byStore: ByStore
type ByStoreName = FilterGenerator<
	<T>(name: string) => Filter<DiscordModules.Flux.Store<T>, true>
>
/**
 * A with-exports filter that matches a Flux store by its name.
 */
declare const byStoreName: ByStoreName
declare namespace utils_d_exports {
	export { TypedEventEmitter$1 as TypedEventEmitter }
}
/**
 * Do not use the `error` event, as the module will handle it specially for some reason.
 */
declare let TypedEventEmitter$1: typeof DiscordModules.Utils.TypedEventEmitter
declare namespace index_d_exports {
	export {
		AppStartPerformance$1 as AppStartPerformance,
		Constants$1 as Constants,
		ConstantsModuleId,
		Logger$1 as Logger,
		LoggerModuleId,
		Tokens,
		TokensModuleId,
		flux_d_exports$1 as flux,
		utils_d_exports as utils,
	}
}
declare const Logger$1: typeof DiscordModules.Logger, LoggerModuleId: number
declare const Tokens: any, TokensModuleId: number
/**
 * If you need to use this ID, unproxify {@link Constants} first.
 *
 * ```js
 * preinit() {
 *   unproxify(Constants)
 *   // Module ID will now be set!
 *   ConstantsModuleId // ...
 * }
 * ```
 */
declare let ConstantsModuleId: Metro.ModuleID | undefined
declare let Constants$1: DiscordModules.Constants
declare namespace design_d_exports {
	export { Design, FormSwitch }
}
declare let Design: Design
declare let FormSwitch: DiscordModules.Components.FormSwitch
interface Design {
	createStyles: DiscordModules.Components.Styles.CreateStylesFunction
	useTooltip: DiscordModules.Components.UseTooltipFunction
	ActionSheet: DiscordModules.Components.ActionSheet
	ActionSheetRow: DiscordModules.Components.ActionSheetRow
	ActionSheetSwitchRow: DiscordModules.Components.ActionSheetSwitchRow
	BottomSheetTitleHeader: DiscordModules.Components.BottomSheetTitleHeader
	AlertActionButton: DiscordModules.Components.AlertActionButton
	AlertModal: DiscordModules.Components.AlertModal
	Button: DiscordModules.Components.Button
	Card: DiscordModules.Components.Card
	ContextMenu: DiscordModules.Components.ContextMenu
	ContextMenuItem: DiscordModules.Components.ContextMenuItem
	IconButton: DiscordModules.Components.IconButton
	ImageButton: DiscordModules.Components.ImageButton
	LayerScope: DiscordModules.Components.LayerScope
	NavigatorHeader: DiscordModules.Components.NavigatorHeader
	Stack: DiscordModules.Components.Stack
	Slider: DiscordModules.Components.Slider
	TableCheckboxRow: DiscordModules.Components.TableCheckboxRow
	TableRadioGroup: typeof DiscordModules.Components.TableRadioGroup
	TableRadioRow: typeof DiscordModules.Components.TableRadioRow
	TableRow: DiscordModules.Components.TableRow
	TableRowGroup: DiscordModules.Components.TableRowGroup
	TableRowTrailingText: DiscordModules.Components.TableRowTrailingText
	TableSwitchRow: DiscordModules.Components.TableSwitchRow
	Text: DiscordModules.Components.Text
	TextArea: DiscordModules.Components.TextArea
	TextField: DiscordModules.Components.TextField
	TextInput: DiscordModules.Components.TextInput
}
declare namespace flux_d_exports {
	export {
		FluxEventDispatchPatch,
		onAnyFluxEventDispatched,
		onFluxEventDispatched,
	}
}
type FluxEventDispatchPatch = (
	payload: DiscordModules.Flux.DispatcherPayload,
) => DiscordModules.Flux.DispatcherPayload | undefined | void
/**
 * Registers a patch for all Flux events.
 *
 * @see {@link onFluxEventDispatched} for more details.
 *
 * @param patch The patch function to apply when any Flux event is dispatched.
 * @returns A function that can be used to remove the patch.
 */
declare function onAnyFluxEventDispatched(
	patch: FluxEventDispatchPatch,
): () => void
/**
 * Registers a patch for a specific Flux event type.
 * @param type The type of the Flux event to patch.
 * @param patch The patch function to apply when the event is dispatched.
 * @returns A function that can be used to remove the patch.
 *
 * @example Blocking the disptach
 * ```ts
 * // Returning falsy values will prevent the event from being dispatched.
 * onFluxEventDispatched('TYPING_START', () => {})
 * ```
 *
 * @example Modifying the payload
 * ```ts
 * onFluxEventDispatched('TYPING_START', payload => {
 *   // Send the typing event to this channel instead.
 *   payload.channelId = '123456789012345678'
 *   // Make sure to return the modified payload!
 *   return payload
 * })
 * ```
 *
 * @example Reading and passing through the payload
 * ```ts
 * onFluxEventDispatched('TYPING_START', payload => {
 *   console.log('Typing started:', payload)
 *   // Do nothing, just return the payload.
 *   return payload
 * })
 * ```
 */
declare function onFluxEventDispatched(
	type: DiscordModules.Flux.DispatcherPayload['type'],
	patch: FluxEventDispatchPatch,
): () => void
declare namespace native_d_exports {
	export {
		BundleUpdaterManager,
		CacheModule,
		ClientInfoModule,
		DeviceModule,
		FileModule,
		ThemeModule,
	}
}
/**
 * Naming conventions:
 * - Always use the most recent module name (if we can do it in a non-breaking way)
 * - If the module name starts with "Native", remove it
 * - If the module name starts with "RTN", remove it
 * - If the module name ends with "Module", include it
 * - If the module name ends with "Manager", include it
 */
declare let CacheModule: DiscordNativeModules.CacheModule
declare let FileModule: DiscordNativeModules.FileModule
declare let ClientInfoModule: DiscordNativeModules.ClientInfoModule
declare let DeviceModule: DiscordNativeModules.DeviceModule
declare let ThemeModule: DiscordNativeModules.ThemeModule
declare let BundleUpdaterManager: DiscordNativeModules.BundleUpdaterManager
declare namespace main_tabs_v2_d_exports {
	export { RootNavigationRef }
}
interface RootNavigationRef {
	getRootNavigationRef<
		T extends object = Record<string, unknown>,
	>(): NavigationContainerRef<T>
}
declare let RootNavigationRef: RootNavigationRef
declare namespace index_d_exports$1 {
	export {
		SettingsItem,
		SettingsModulesLoadedSubscription,
		SettingsSection,
		addSettingsItemToSection,
		isSettingsModulesLoaded,
		onSettingsModulesLoaded,
		refreshSettingsNavigator,
		refreshSettingsOverviewScreen,
		registerSettingsItem,
		registerSettingsItems,
		registerSettingsSection,
	}
}
type SettingsItem = DiscordModules.Modules.Settings.SettingsItem
type SettingsSection = DiscordModules.Modules.Settings.SettingsSection
type SettingsModulesLoadedSubscription = () => void
/**
 * Checks if the settings modules are loaded.
 */
declare function isSettingsModulesLoaded(): boolean
/**
 * Subscribes to when settings modules are loaded.
 * Plugins should ideally register their settings in the given callback to ensure fast startup time.
 *
 * If settings modules are already loaded, the callback will be called immediately.
 *
 * @param subcription The subscription function to call when the settings modules are loaded.
 * @returns A function to unsubscribe from the event.
 */
declare function onSettingsModulesLoaded(
	subcription: SettingsModulesLoadedSubscription,
): () => void
/**
 * Registers a settings section with a given key.
 *
 * @param key The key to register the settings section with.
 * @param section The settings section to register.
 * @returns A function to unregister the settings section.
 */
declare function registerSettingsSection(
	key: string,
	section: SettingsSection,
): () => void
/**
 * Registers a settings item with a given key.
 *
 * @param key The key to register the settings item with.
 * @param item The settings item to register.
 * @returns A function to unregister the settings item.
 */
declare function registerSettingsItem(
	key: string,
	item: SettingsItem,
): () => void
/**
 * Registers multiple settings items at once.
 *
 * @param record The settings items to register.
 * @returns A function to unregister the settings items.
 */
declare function registerSettingsItems(
	record: Record<string, SettingsItem>,
): () => void
/**
 * Adds a settings item to an existing section.
 *
 * @param key The section to add the settings item to.
 * @param item The settings item to add.
 * @returns A function to remove the settings item from the section.
 */
declare function addSettingsItemToSection(key: string, item: string): () => void
/**
 * Refreshes the SettingsOverviewScreen.
 */
declare function refreshSettingsOverviewScreen(): void
/**
 * Refreshes the settings navigator.
 */
declare function refreshSettingsNavigator(): void
declare namespace renderer_d_exports {
	export { SettingListRenderer }
}
type SettingListRenderer = DiscordModules.Modules.Settings.SettingListRenderer
declare let SettingListRenderer: SettingListRenderer
//#endregion
//#region lib/discord/src/types/revenge.d.ts
interface PluginApiDiscord {
	actions: PluginApiDiscord.Actions
	common: PluginApiDiscord.Common
	design: PluginApiDiscord.Design
	flux: PluginApiDiscord.Flux
	modules: PluginApiDiscord.Modules
	native: PluginApiDiscord.Native
}
declare namespace PluginApiDiscord {
	type Actions = typeof actions_d_exports
	type Common = typeof index_d_exports
	type Design = typeof design_d_exports
	type Flux = typeof flux_d_exports
	type Native = typeof native_d_exports
	interface Modules {
		mainTabsV2: typeof main_tabs_v2_d_exports
		settings: typeof index_d_exports$1 & {
			renderer: typeof renderer_d_exports
		}
	}
}
declare module '@revenge-mod/plugins/types' {
	interface UnscopedInitPluginApi {
		discord: PluginApiDiscord
	}
	interface InitPluginApi {
		logger: DiscordModules.Logger
	}
}
//#endregion
//#region lib/discord/src/types/index.d.ts
declare namespace DiscordModules {
	namespace Flux {
		interface DispatcherPayload {
			type: string
			[key: PropertyKey]: any
		}
		type DispatcherDependency = any
		interface StoreChangeCallbacks {
			add(cb: () => void): void
			addConditional(cb: () => boolean): void
			listeners: Set<() => void>
			remove(cb: () => void): void
			has(cb: () => void): boolean
			hasAny(): boolean
			invokeAll(): void
		}
		type Store<T = object> = T & {
			addChangeListener(cb: () => void): void
			removeChangeListener(cb: () => void): void
			addReactChangeListener(cb: () => void): void
			removeReactChangeListener(cb: () => void): void
			addConditionalChangeListener(cb: () => boolean): void
			callback(cb: () => void): void
			throttledCallback(): unknown
			getName(): string
			__getLocalVars?(): object
			_changeCallbacks: StoreChangeCallbacks
			_isInitialized: boolean
			_version: number
			_reactChangeCallbacks: StoreChangeCallbacks
			_dispatchToken: string
		}
		interface Dispatcher {
			_actionHandlers: unknown
			_interceptors?: ((payload: DispatcherPayload) => undefined | boolean)[]
			_currentDispatchActionType: undefined | string
			_processingWaitQueue: boolean
			_subscriptions: Record<string, Set<(payload: DispatcherPayload) => void>>
			_waitQueue: unknown[]
			addDependencies(
				node1: DispatcherDependency,
				node2: DispatcherDependency,
			): void
			dispatch(payload: DispatcherPayload): Promise<void>
			flushWaitQueue(): void
			isDispatching(): boolean
			register(
				name: string,
				actionHandler: Record<string, (e: DispatcherPayload) => void>,
				storeDidChange: (e: DispatcherPayload) => boolean,
			): string
			setInterceptor(
				interceptor?: (payload: DispatcherPayload) => undefined | boolean,
			): void
			/**
			 * Subscribes to an action type
			 * @param actionType The action type to subscribe to
			 * @param callback The callback to call when the action is dispatched
			 */
			subscribe(
				actionType: string,
				callback: (payload: DispatcherPayload) => void,
			): void
			/**
			 * Unsubscribes from an action type
			 * @param actionType The action type to unsubscribe from
			 * @param callback The callback to remove
			 */
			unsubscribe(
				actionType: string,
				callback: (payload: DispatcherPayload) => void,
			): void
			wait(cb: () => void): void
		}
	}
	namespace AppStartPerformance {
		type MarkArgs = [emoji: string, log: string, delta?: number]
	}
	interface AppStartPerformance {
		mark(...args: AppStartPerformance.MarkArgs): void
		markAndLog(logger: Logger, ...args: AppStartPerformance.MarkArgs): void
		[index: string]: unknown
	}
	interface Constants {
		[K: string]:
			| string
			| number
			| boolean
			| null
			| ((...args: any[]) => any)
			| Constants
	}
	/**
	 * Discord's `Logger` class.
	 *
	 * Logs will be shown in the **Debug Logs** section in settings.
	 */
	class Logger {
		constructor(tag: string)
		logDangerously(...args: unknown[]): void
		log(...args: unknown[]): void
		error(...args: unknown[]): void
		warn(...args: unknown[]): void
		info(...args: unknown[]): void
		time(...args: unknown[]): void
		trace(...args: unknown[]): void
		fileOnly(...args: unknown[]): void
		verboseDangerously(...args: unknown[]): void
		verbose(...args: unknown[]): void
	}
	namespace Actions {
		interface AlertActionCreators {
			openAlert(key: string, alert: ReactElement): void
			dismissAlert(key: string): void
			dismissAlerts(): void
			useAlertStore(): unknown
		}
		interface ToastActionCreators {
			open(options: {
				key: string
				content?: string
				icon?: number | FC
				IconComponent?: FC
				/**
				 * The icon's color, same string format as `<Text>`'s color prop
				 */
				iconColor?: string
				containerStyle?: ViewStyle
			}): void
			close(): void
		}
		interface ActionSheetActionCreators {
			openLazy<T extends ComponentType<any>>(
				sheet: Promise<{
					default: T
				}>,
				key: string,
				props: ComponentProps<T>,
			): void
			hideActionSheet(key?: string): void
		}
	}
	namespace Components {
		namespace Styles {
			type TextType = 'heading' | 'text'
			type BasicTextSize = 'sm' | 'md' | 'lg'
			type BasicTextSizeWithExtraLarges = BasicTextSize | 'xl' | 'xxl'
			type TextSize = BasicTextSizeWithExtraLarges | 'xs' | 'xxs'
			type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'
			type TextWeightWithExtraBold = TextWeight | 'extrabold'
			type RedesignTextCategory = 'message-preview' | 'channel-title'
			type TextVariant =
				| `heading-${BasicTextSizeWithExtraLarges}/${TextWeightWithExtraBold}`
				| `text-${TextSize}/${TextWeight}`
				| `display-${BasicTextSize}`
				| `redesign/${RedesignTextCategory}/${TextWeight}`
				| 'redesign/heading-18/bold'
				| 'eyebrow'
			type TextStyleSheet = Record<TextVariant, TextProps$1>
			type CreateStylesFunction = <
				const S extends Record<string, TextStyle | ViewStyle | ImageStyle>,
			>(
				styles: S,
			) => () => S
		}
		type UseTooltipFunction = (
			ref: RefObject<View | null>,
			props: UseTooltipFunctionProps,
		) => unknown
		interface UseTooltipFunctionProps {
			label: string
			position?: 'top' | 'bottom'
			visible?: boolean
			onPress?: () => void
		}
		interface BaseButtonProps extends PressableProps, RefAttributes<View> {
			disabled?: boolean
			size?: ButtonSize
			variant?:
				| 'primary'
				| 'secondary'
				| 'tertiary'
				| 'destructive'
				| 'active'
				| 'primary-overlay'
				| 'secondary-overlay'
			loading?: boolean
			grow?: boolean
			scaleAmountInPx?: number
		}
		interface ButtonProps extends BaseButtonProps {
			icon?: number
			loading?: boolean
			iconPosition?: 'start' | 'end'
			renderIcon?(): ReactNode
			renderRightIcon?(): ReactNode
			renderShine?(): ReactNode
			renderLinearGradient?(): ReactNode
			cornerRadius?: number
			textStyle?: TextStyle
			loadingColorLight?: string
			loadingColorDark?: string
			text: string
		}
		type ButtonSize = 'sm' | 'md' | 'lg'
		type Button = FC<ButtonProps>
		interface IconButtonProps extends BaseButtonProps {
			icon: number
			label?: string
		}
		type IconButton = FC<IconButtonProps>
		interface ImageButtonProps extends BaseButtonProps {
			image: ImageSourcePropType
		}
		type ImageButton = FC<ImageButtonProps>
		interface StackProps extends ViewProps {
			spacing?: number
			direction?: 'vertical' | 'horizontal'
		}
		type Stack = FC<StackProps>
		interface CardProps extends ViewProps {
			start?: boolean
			end?: boolean
			variant?: 'primary' | 'secondary' | 'transparent'
			border?: 'faint' | 'normal' | 'strong' | 'subtle' | 'none'
			shadow?: 'none' | 'low' | 'medium' | 'high' | 'border' | 'ledge'
			children: ReactNode
		}
		type Card = FC<CardProps>
		interface TextFieldProps {
			onChange?: (value: string) => void
			onBlur?: () => void
			onFocus?: () => void
			leadingIcon?: FC
			trailingIcon?: FC
			leadingText?: string
			trailingText?: string
			description?: string
			errorMessage?: string
			isDisabled?: boolean
			focusable?: boolean
			editable?: boolean
			status?: TextFieldStatus
			defaultValue?: string
			value?: string
			placeholder?: string
			placeholderTextColor?: string
			maxLength?: number
			multiline?: boolean
			autoFocus?: boolean
			secureTextEntry?: boolean
			returnKeyType?: TextInputProps$1['returnKeyType']
			isClearable?: boolean
			size?: TextFieldSize
			style?: StyleProp<ViewStyle>
		}
		type TextFieldSize = 'sm' | 'md' | 'lg'
		type TextFieldStatus = 'default' | 'error'
		interface TextInputProps extends TextFieldProps {
			isRound?: boolean
			label?: string
		}
		interface TextAreaProps extends Omit<TextInputProps, 'multiline'> {}
		type TextInput = FC<TextInputProps>
		type TextField = FC<TextFieldProps>
		type TextArea = FC<TextAreaProps>
		interface FormSwitchProps extends ViewProps {
			value: boolean
			onValueChange(value: boolean): void
			disabled?: boolean
		}
		type FormSwitch = FC<FormSwitchProps>
		interface ActionSheetProps {
			children: ReactNode
		}
		type ActionSheet = FC<ActionSheetProps>
		interface ActionSheetCloseButtonProps
			extends Pick<ComponentProps<IconButton>, 'variant' | 'onPress'> {}
		type ActionSheetCloseButton = FC<ActionSheetCloseButtonProps>
		type ActionSheetRow = TableRow
		type ActionSheetRowIcon = TableRowIcon
		type ActionSheetRowGroup = TableRowGroup
		type ActionSheetSwitchRow = TableSwitchRow
		interface BottomSheetTitleHeaderProps {
			leading?: ReactNode
			title: string
			trailing?: ReactNode
		}
		type BottomSheetTitleHeader = FC<BottomSheetTitleHeaderProps>
		type IconSize =
			| 'extraSmall10'
			| 'extraSmall'
			| 'small'
			| 'small20'
			| 'medium'
			| 'large'
			| 'custom'
			| 'refreshSmall16'
			| 'small14'
		type TableRowVariant = 'default' | 'danger'
		interface TableCheckboxRowProps extends Omit<TableRowProps, 'trailing'> {
			checked: boolean
			value: string
		}
		type TableCheckboxRow = FC<TableCheckboxRowProps>
		interface TableRadioGroupProps<T = string> extends TableRowGroupProps {
			children: ReactNode
			onChange: (value: T) => void
			defaultValue?: T
		}
		interface TableRadioRowProps<T = any> extends TableRowProps {
			label: string
			value: T
		}
		function TableRadioGroup<T>(props: TableRadioGroupProps<T>): ReactElement
		function TableRadioRow<T>(props: TableRadioRowProps<T>): ReactElement
		interface TableRowProps {
			label: string
			subLabel?: string
			icon?: ReactNode
			trailing?: ReactNode
			arrow?: boolean
			onPress?: PressableProps['onPress']
			disabled?: boolean
			draggable?: boolean
			dragHandlePressableProps?: PressableProps
			labelLineClamp?: number
			subLabelLineClamp?: number
			start?: boolean
			end?: boolean
			variant?: TableRowVariant
		}
		interface TableRow extends FC<TableRowProps> {
			Arrow: FC
			Icon: TableRowIcon
			Group: TableRowGroup
		}
		interface TableSwitchRowProps extends Omit<TableRowProps, 'trailing'> {
			accessibilityHint?: string
			value: boolean
			onValueChange(value: boolean): void
		}
		type TableSwitchRow = FC<TableSwitchRowProps>
		interface TableRowGroupProps {
			title?: string
			description?: string
			hasIcons?: boolean
			accessibilityLabel?: string
			accessibilityRole?: string
			children: ReactNode
		}
		type TableRowGroup = FC<TableRowGroupProps>
		interface TableRowGroupTitleProps {
			title: string
		}
		type TableRowGroupTitle = FC<TableRowGroupTitleProps>
		type TableRowIconVariant =
			| 'default'
			| 'blurple'
			| 'boosting-pink'
			| 'status-online'
			| 'status-idle'
			| 'status-dnd'
			| 'status-offline'
			| 'xbox'
			| 'playstation'
			| 'danger'
			| 'secondary'
			| 'translucent'
		interface TableRowIconProps {
			source: ImageSourcePropType
			variant?: TableRowIconVariant
		}
		type TableRowIcon = FC<TableRowIconProps>
		interface TableRowTrailingTextProps {
			text: string
		}
		type TableRowTrailingText = FC<TableRowTrailingTextProps>
		interface AlertModalProps {
			title?: ReactNode
			content?: ReactNode
			extraContent?: ReactNode
			actions?: ReactNode
		}
		type AlertModal = FC<AlertModalProps>
		type AlertActionButton = Button
		interface ContextMenuProps {
			title: ReactNode
			triggerOnLongPress?: boolean
			items: Array<ContextMenuItem | ContextMenuItem[]>
			align?: 'left' | 'right' | 'above' | 'below'
			children: (props: Partial<BaseButtonProps>) => ReactNode
		}
		type ContextMenu = FC<ContextMenuProps>
		interface ContextMenuItem {
			label: string
			IconComponent?: FC
			variant?: 'default' | 'destructive'
			action(): void
		}
		interface TextProps extends TextProps$1 {
			variant?: Styles.TextVariant
			color?: string
			style?: StyleProp<TextStyle>
			lineClamp?: number
			ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip'
			tabularNumbers?: boolean
			children?: ReactNode
		}
		type Text = FC<TextProps>
		interface IntlLinkProps {
			target: string
			children?: ReactNode
		}
		type IntlLink = FC<IntlLinkProps>
		interface SliderProps {
			step: number
			value: number
			minimumValue: number
			maximumValue: number
			onValueChange: (value: number) => void
			onSlidingStart?: () => void
			onSlidingComplete?: (value: number) => void
			startIcon?: ReactNode
			endIcon?: ReactNode
		}
		type Slider = FC<SliderProps>
		interface NavigatorHeaderProps {
			icon?: ReactNode
			title: string
			subtitle?: string
		}
		type NavigatorHeader = FC<NavigatorHeaderProps>
		interface LayerScopeProps {
			children?: ReactNode
			zIndex?: number
		}
		type LayerScope = FC<LayerScopeProps>
	}
	namespace Modules {
		namespace Settings {
			export interface SettingListRenderer {
				SettingsList: SettingsList
			}
			export interface SettingsListProps {
				ListHeaderComponent?: ComponentType
				sections: Array<{
					label?: string | ReactNode
					settings: string[]
					subLabel?: string | ReactNode
				}>
			}
			export type SettingsList = FC<SettingsListProps>
			export interface SettingsSection {
				label: string
				settings: string[]
				index?: number
			}
			interface BaseSettingsItem {
				title: () => string
				parent: string | null
				unsearchable?: boolean
				variant?: Components.TableRowProps['variant']
				IconComponent?: () => ReactNode
				usePredicate?: () => boolean
				useTrailing?: () => ReactNode
				useDescription?: () => string
				useIsDisabled?: () => boolean
			}
			export interface PressableSettingsItem extends BaseSettingsItem {
				type: 'pressable'
				onPress?: () => void
			}
			export interface ToggleSettingsItem extends BaseSettingsItem {
				type: 'toggle'
				useValue: () => boolean
				onValueChange?: (value: boolean) => void
			}
			export interface RouteSettingsItem extends BaseSettingsItem {
				type: 'route'
				screen: {
					route: string
					getComponent(): ComponentType<
						StackScreenProps<ReactNavigationParamList>
					>
				}
			}
			export interface StaticSettingsItem extends BaseSettingsItem {
				type: 'static'
			}
			export type SettingsItem =
				| PressableSettingsItem
				| ToggleSettingsItem
				| RouteSettingsItem
				| StaticSettingsItem
		}
	}
	namespace Utils {
		namespace TypedEventEmitter {
			type DefaultEventMap = [never]
			type EventMap<T> = Record<keyof T, any[]> | DefaultEventMap
		}
		class TypedEventEmitter<
			T extends
				TypedEventEmitter.EventMap<T> = TypedEventEmitter.DefaultEventMap,
		> extends EventEmitter<T> {}
	}
}
//#endregion
export { DiscordModules, DiscordNativeModules, PluginApiDiscord }
//# sourceMappingURL=index-avp1GUJG.d.ts.map
