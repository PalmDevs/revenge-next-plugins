declare module '@revenge-mod' {
	type Root = import('./lib/plugins/types.d.ts').UnscopedPluginApi
	export const assets: Root['assets'],
		discord: Root['discord'],
		utils: Root['utils'],
		components: Root['components'],
		externals: Root['externals'],
		modules: Root['modules'],
		patcher: Root['patcher'],
		plugins: Root['plugins'],
		react: Root['react'],
		storage: Root['storage']
}
declare module '@revenge-mod/assets' {
	type Root = import('./lib/plugins/types.d.ts').UnscopedPluginApi['assets']
	export const setPreferredAssetType: Root['setPreferredAssetType'],
		getAssets: Root['getAssets'],
		getCustomAssets: Root['getCustomAssets'],
		getPackagerAssets: Root['getPackagerAssets'],
		getAssetByName: Root['getAssetByName'],
		getAssetsByName: Root['getAssetsByName'],
		getAssetIdByName: Root['getAssetIdByName'],
		registerAsset: Root['registerAsset'],
		addAssetOverride: Root['addAssetOverride'],
		removeAssetOverride: Root['removeAssetOverride'],
		AssetsRegistry: Root['AssetsRegistry'],
		AssetsRegistryModuleId: Root['AssetsRegistryModuleId']
}
declare module '@revenge-mod/components' {
	type Root = import('./lib/plugins/types.d.ts').UnscopedPluginApi['components']
	export const FormSwitch: Root['FormSwitch'],
		Page: Root['Page'],
		SearchInput: Root['SearchInput'],
		TableRowAssetIcon: Root['TableRowAssetIcon']
}
declare module '@revenge-mod/discord' {
	type Root = import('./lib/plugins/types.d.ts').UnscopedPluginApi['discord']
	export const actions: Root['actions'],
		common: Root['common'],
		design: Root['design'],
		flux: Root['flux'],
		modules: Root['modules'],
		native: Root['native']
}
declare module '@revenge-mod/discord/common' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['discord']['common']
	export const AppStartPerformance: Root['AppStartPerformance'],
		flux: Root['flux'],
		utils: Root['utils'],
		Logger: Root['Logger'],
		LoggerModuleId: Root['LoggerModuleId'],
		Tokens: Root['Tokens'],
		TokensModuleId: Root['TokensModuleId'],
		ConstantsModuleId: Root['ConstantsModuleId'],
		Constants: Root['Constants']
}
declare module '@revenge-mod/discord/common/flux' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['discord']['common']['flux']
	export const getStore: Root['getStore'],
		Dispatcher: Root['Dispatcher'],
		DispatcherModuleId: Root['DispatcherModuleId'],
		Stores: Root['Stores'],
		byStore: Root['byStore'],
		byStoreName: Root['byStoreName']
}
declare module '@revenge-mod/discord/common/utils' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['discord']['common']['utils']
	export const TypedEventEmitter: Root['TypedEventEmitter']
}
declare module '@revenge-mod/discord/modules' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['discord']['modules']
	export const mainTabsV2: Root['mainTabsV2'], settings: Root['settings']
}
declare module '@revenge-mod/discord/modules/settings' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['discord']['modules']['settings']
	export const isSettingsModulesLoaded: Root['isSettingsModulesLoaded'],
		onSettingsModulesLoaded: Root['onSettingsModulesLoaded'],
		registerSettingsSection: Root['registerSettingsSection'],
		registerSettingsItem: Root['registerSettingsItem'],
		registerSettingsItems: Root['registerSettingsItems'],
		addSettingsItemToSection: Root['addSettingsItemToSection'],
		refreshSettingsOverviewScreen: Root['refreshSettingsOverviewScreen'],
		refreshSettingsNavigator: Root['refreshSettingsNavigator'],
		renderer: Root['renderer']
}
declare module '@revenge-mod/discord/modules/settings/renderer' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['discord']['modules']['settings']['renderer']
	export const SettingListRenderer: Root['SettingListRenderer']
}
declare module '@revenge-mod/discord/modules/mainTabsV2' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['discord']['modules']['mainTabsV2']
	export const RootNavigationRef: Root['RootNavigationRef']
}
declare module '@revenge-mod/discord/actions' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['discord']['actions']
	export const ActionSheetActionCreators: Root['ActionSheetActionCreators'],
		AlertActionCreators: Root['AlertActionCreators'],
		ToastActionCreators: Root['ToastActionCreators']
}
declare module '@revenge-mod/discord/design' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['discord']['design']
	export const Design: Root['Design'], FormSwitch: Root['FormSwitch']
}
declare module '@revenge-mod/discord/flux' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['discord']['flux']
	export const onAnyFluxEventDispatched: Root['onAnyFluxEventDispatched'],
		onFluxEventDispatched: Root['onFluxEventDispatched']
}
declare module '@revenge-mod/discord/native' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['discord']['native']
	export const CacheModule: Root['CacheModule'],
		FileModule: Root['FileModule'],
		ClientInfoModule: Root['ClientInfoModule'],
		DeviceModule: Root['DeviceModule'],
		ThemeModule: Root['ThemeModule'],
		BundleUpdaterManager: Root['BundleUpdaterManager']
}
declare module '@revenge-mod/externals' {
	type Root = import('./lib/plugins/types.d.ts').UnscopedPluginApi['externals']
	export const Browserify: Root['Browserify'],
		ReactNativeClipboard: Root['ReactNativeClipboard'],
		ReactNavigation: Root['ReactNavigation'],
		Shopify: Root['Shopify']
}
declare module '@revenge-mod/externals/Browserify' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['externals']['Browserify']
	export const nodeUtil: Root['nodeUtil']
}
declare module '@revenge-mod/externals/ReactNativeClipboard' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['externals']['ReactNativeClipboard']
	export const Clipboard: Root['Clipboard'], useClipboard: Root['useClipboard']
}
declare module '@revenge-mod/externals/ReactNavigation' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['externals']['ReactNavigation']
	export const ReactNavigationNative: Root['ReactNavigationNative'],
		ReactNavigationStack: Root['ReactNavigationStack']
}
declare module '@revenge-mod/externals/Shopify' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['externals']['Shopify']
	export const FlashList: Root['FlashList']
}
declare module '@revenge-mod/modules' {
	type Root = import('./lib/plugins/types.d.ts').UnscopedPluginApi['modules']
	export const finders: Root['finders'],
		metro: Root['metro'],
		native: Root['native']
}
declare module '@revenge-mod/modules/finders' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['modules']['finders']
	export const getModule: Root['getModule'],
		getModuleByImportedPath: Root['getModuleByImportedPath'],
		lookupModules: Root['lookupModules'],
		lookupModule: Root['lookupModule'],
		lookupModuleByImportedPath: Root['lookupModuleByImportedPath'],
		waitForModules: Root['waitForModules'],
		waitForModuleByImportedPath: Root['waitForModuleByImportedPath'],
		filters: Root['filters']
}
declare module '@revenge-mod/modules/metro' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['modules']['metro']
	export const getModuleDependencies: Root['getModuleDependencies'],
		isModuleInitialized: Root['isModuleInitialized'],
		getInitializedModuleExports: Root['getInitializedModuleExports'],
		isModuleExportBad: Root['isModuleExportBad'],
		onAnyModuleInitialized: Root['onAnyModuleInitialized'],
		onModuleInitialized: Root['onModuleInitialized'],
		onModuleFinishedImporting: Root['onModuleFinishedImporting'],
		onAnyModuleFirstRequired: Root['onAnyModuleFirstRequired'],
		onModuleFirstRequired: Root['onModuleFirstRequired']
}
declare module '@revenge-mod/modules/native' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['modules']['native']
	export const getNativeModule: Root['getNativeModule']
}
declare module '@revenge-mod/patcher' {
	type Root = import('./lib/plugins/types.d.ts').UnscopedPluginApi['patcher']
	export const after: Root['after'],
		before: Root['before'],
		instead: Root['instead']
}
declare module '@revenge-mod/plugins' {
	type Root = import('./lib/plugins/types.d.ts').UnscopedPluginApi['plugins']
	export const constants: Root['constants']
}
declare module '@revenge-mod/plugins/constants' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['plugins']['constants']
	export const PluginFlags: Root['PluginFlags'],
		PluginStatus: Root['PluginStatus'],
		PluginsStorageDirectory: Root['PluginsStorageDirectory']
}
declare module '@revenge-mod/react' {
	type Root = import('./lib/plugins/types.d.ts').UnscopedPluginApi['react']
	export const ReactModuleId: Root['ReactModuleId'],
		ReactNativeModuleId: Root['ReactNativeModuleId'],
		ReactJSXRuntimeModuleId: Root['ReactJSXRuntimeModuleId'],
		React: Root['React'],
		ReactNative: Root['ReactNative'],
		ReactJSXRuntime: Root['ReactJSXRuntime'],
		jsxRuntime: Root['jsxRuntime'],
		native: Root['native']
}
declare module '@revenge-mod/react/native' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['react']['native']
	export const onRunApplication: Root['onRunApplication'],
		onRunApplicationFinished: Root['onRunApplicationFinished']
}
declare module '@revenge-mod/utils' {
	type Root = import('./lib/plugins/types.d.ts').UnscopedPluginApi['utils']
	export const react: Root['react'],
		discord: Root['discord'],
		callback: Root['callback'],
		error: Root['error'],
		object: Root['object'],
		promise: Root['promise'],
		proxy: Root['proxy'],
		tree: Root['tree']
}
declare module '@revenge-mod/utils/callback' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['utils']['callback']
	export const debounce: Root['debounce'],
		asap: Root['asap'],
		noop: Root['noop']
}
declare module '@revenge-mod/utils/discord' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['utils']['discord']
	export const lookupGeneratedIconComponent: Root['lookupGeneratedIconComponent'],
		byGeneratedIconComponent: Root['byGeneratedIconComponent']
}
declare module '@revenge-mod/utils/error' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['utils']['error']
	export const getErrorStack: Root['getErrorStack'],
		getCurrentStack: Root['getCurrentStack']
}
declare module '@revenge-mod/utils/object' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['utils']['object']
	export const isObject: Root['isObject'],
		mergeDeep: Root['mergeDeep'],
		defineLazyProperty: Root['defineLazyProperty'],
		defineLazyProperties: Root['defineLazyProperties']
}
declare module '@revenge-mod/utils/promise' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['utils']['promise']
	export const allSettled: Root['allSettled'],
		sleep: Root['sleep'],
		sleepReject: Root['sleepReject']
}
declare module '@revenge-mod/utils/proxy' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['utils']['proxy']
	export const isProxy: Root['isProxy'],
		isProxified: Root['isProxified'],
		getProxyTarget: Root['getProxyTarget'],
		proxify: Root['proxify'],
		unproxify: Root['unproxify'],
		destructure: Root['destructure']
}
declare module '@revenge-mod/utils/react' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['utils']['react']
	export const useIsFirstRender: Root['useIsFirstRender'],
		useReRender: Root['useReRender'],
		findInReactFiber: Root['findInReactFiber']
}
declare module '@revenge-mod/utils/tree' {
	type Root =
		import('./lib/plugins/types.d.ts').UnscopedPluginApi['utils']['tree']
	export const findInTree: Root['findInTree']
}
