import { Filter, FilterResult, If, MaybeDefaultExportMatched, Metro, Nullish, filters_d_exports } from "./types-CbiwzsWW.js";
import { ReactNative, RunApplicationCallback } from "./types-C9P3gb7i.js";
import { Asset, AssetId, CustomAsset, PackagerAsset, RegisterableAsset } from "./types-BFUIRDrT.js";
import { AfterHook, BeforeHook, InsteadHook, UnknownFunction, UnpatchFunction } from "./types-BVCIFTZV.js";
import * as react4 from "react";
import { ElementType, FunctionComponent, JSX, Key as Key$1, ReactElement } from "react";
import * as react_native0 from "react-native";
import * as react_jsx_runtime0 from "react/jsx-runtime";

//#region lib/patcher/src/hooks/after.d.ts

/**
 * After hooks allow you to modify the return value of the original function, or to perform some action after the original function is called.
 *
 * ```js
 * import { after } from '@revenge-mod/patcher'
 *
 * const obj = {
 *     method: (a) => a * 2
 * }
 *
 * after(obj, 'method', (result) => {
 *     console.log('After method called with result:', result)
 *     // Modify return value
 *     return result + 1
 * })
 *
 * console.log(obj.method(2)) // 5
 * // CONSOLE OUTPUT:
 * // After method called with result: 4
 * // 5
 * ```
 *
 * @param parent The parent object containing the method to patch.
 * @param key The key of the method to patch.
 * @param hook The hook function to execute after the original method.
 *
 * @returns A function to unpatch.
 */
declare function after<Parent extends Record<Key, UnknownFunction>, Key extends keyof Parent>(parent: Parent, key: Key, hook: AfterHook<Parent[Key]>): UnpatchFunction;
//#endregion
//#region lib/patcher/src/hooks/before.d.ts
/**
 * Before hooks allow you to modify the arguments passed to the original function, or to perform some action before the original function is called.
 *
 * ```js
 * import { before } from '@revenge-mod/patcher'
 *
 * const obj = {
 *     method: (a) => console.log('Original method called with:', a)
 * }
 *
 * before(obj, 'method', ([a]) => {
 *     console.log('Before method called with:', a)
 *     // Modify arguments by returning new array
 *     return [a + 1]
 * })
 *
 * obj.method(2)
 * // CONSOLE OUTPUT:
 * // Before method called with: 2
 * // Original method called with: 3
 * ```
 *
 * @param parent The parent object containing the method to patch.
 * @param key The key of the method to patch.
 * @param hook The hook function to execute before the original method.
 *
 * @returns A function to unpatch.
 */
declare function before<Parent extends Record<Key, UnknownFunction>, Key extends keyof Parent>(parent: Parent, key: Key, hook: BeforeHook<Parent[Key]>): UnpatchFunction;
//#endregion
//#region lib/patcher/src/hooks/instead.d.ts
/**
 * Instead hooks allow you to completely replace the original function with a new one, while still being able to call the original function if needed.
 *
 * ```js
 * import { instead } from '@revenge-mod/patcher'
 *
 * const obj = {
 *     method: (a) => {
 *         console.log('Original method called with:', a)
 *         return 'original result'
 *     }
 * }
 *
 * instead(obj, 'method', ([a], original) => {
 *     console.log('Instead method called with:', a)
 *     // Call the original function if needed
 *     const originalResult = original('modified')
 *     console.log('Original method was called')
 *
 *     // Return a new value
 *     return 'new value'
 * })
 *
 * console.log(obj.method('test')) // 'new value'
 * // CONSOLE OUTPUT:
 * // Instead method called with: test
 * // Original method called with: modified
 * // Original method was called
 * // new value
 * ```
 *
 * @param parent The parent object containing the method to patch.
 * @param key The key of the method to patch.
 * @param hook The hook function to execute instead of the original method.
 *
 * @return A function to unpatch.
 */
declare function instead<Parent extends Record<Key, UnknownFunction>, Key extends keyof Parent>(parent: Parent, key: Key, hook: InsteadHook<Parent[Key]>): UnpatchFunction;
declare namespace index_d_exports {
  export { after, before, instead };
}
//#endregion
//#region lib/assets/src/preinit.d.ts
/**
 * If you need to use this ID, unproxify {@link AssetsRegistry} first.
 *
 * ```js
 * preinit() {
 *   unproxify(AssetsRegistry)
 *   // Module ID will now be set!
 *   AssetsRegistryModuleId // ...
 * }
 * ```
 */
declare let AssetsRegistryModuleId: Metro.ModuleID | undefined;
declare let AssetsRegistry: ReactNative.AssetsRegistry;
declare namespace index_d_exports$1 {
  export { AssetsRegistry, AssetsRegistryModuleId, addAssetOverride, getAssetByName, getAssetIdByName, getAssets, getAssetsByName, getCustomAssets, getPackagerAssets, registerAsset, removeAssetOverride, setPreferredAssetType };
}
/**
 * Set the preferred asset type. This is used to determine which asset to use when multiple types are available.
 *
 * @param type The preferred asset type.
 */
declare function setPreferredAssetType(type: Asset['type']): void;
/**
 * Yields all assets, both packager and custom.
 */
declare function getAssets(): Generator<Asset>;
/**
 * Yields all registered custom assets.
 */
declare function getCustomAssets(): Generator<CustomAsset>;
/**
 * Yields all registered packager assets, including ones with same name but different types.
 */
declare function getPackagerAssets(): Generator<PackagerAsset>;
/**
 * Get an asset by its name.
 * If more than one asset is registered with the same name, this will return the one with the preferred type, or the first registered one.
 *
 * @param name The asset name.
 * @param type The preferred asset type, defaults to the current preferred type.
 */
declare function getAssetByName(name: string, type?: Asset['type']): Asset | undefined;
/**
 * Gets all assets matching the name.
 *
 * @param name The asset name.
 * @returns A record keyed by the type of the asset, with the value being the asset itself.
 */
declare function getAssetsByName(name: string): Record<Asset['type'], Asset> | undefined;
/**
 * Get an asset ID by its name.
 *
 * If more than one asset is registered with the same name, this will return the one with the preferred type.
 *
 * Unless **explicitly** calling with a preferred type,
 * another asset with type mismatching the {@link setPreferredAssetType current preferred type} may be returned as a fallback.
 *
 * @param name The asset name.
 * @param type The preferred asset type, defaults to the current preferred type.
 */
declare function getAssetIdByName(name: string, type?: Asset['type']): AssetId | undefined;
/**
 * Register an asset with the given name.
 *
 * @param asset The asset to register.
 * @returns The asset ID.
 */
declare function registerAsset(asset: RegisterableAsset): AssetId;
/**
 * Override an asset with a custom asset.
 *
 * @param asset The asset to override.
 * @param override The custom asset to override with.
 */
declare function addAssetOverride(asset: Asset, override: Asset): void;
/**
 * Remove an asset override.
 *
 * @param asset The asset to remove the override for.
 * @returns The asset that was removed.
 */
declare function removeAssetOverride(asset: Asset): boolean;
//#endregion
//#region lib/modules/src/finders/_internal.d.ts
interface RunFilterOptions {
  /**
   * Whether to skip checking the default export.
   *
   * @default false
   */
  skipDefault?: boolean;
  /**
   * Whether to allow initializing modules to check their exports.
   *
   * @default true
   */
  initialize?: boolean;
}
type RunFilterReturnExportsOptions<ReturnNamespace extends boolean = boolean> = RunFilterOptions & If<ReturnNamespace, {
  /**
   * Whether to return the whole module with all exports instead of just the default export **if the default export matches**.
   *
   * @default false
   */
  returnNamespace: true;
}, {
  returnNamespace?: false;
}>;
declare namespace lookup_d_exports {
  export { LookupModulesOptions, LookupModulesResult, lookupModule, lookupModuleByImportedPath, lookupModules };
}
type LookupModulesOptionsWithAll<A extends boolean> = If<A, {
  /**
   * Whether to include all modules in the lookup, including blacklisted ones.
   *
   * **This overrides {@link BaseLookupModulesOptions.initialized} and {@link BaseLookupModulesOptions.uninitialized}.**
   */
  all: A;
}, {
  /**
   * You can only use `all` with exportsless filters!
   */
  all?: false;
}>;
type LookupModulesOptionsWithInitializedUninitialized<U extends boolean> = {
  /**
   * Whether to include initialized modules in the lookup.
   *
   * @default true
   */
  initialized?: boolean;
} & If<U, {
  /**
   * Whether to include uninitialized modules in the lookup.
   *
   * Set {@link BaseLookupModulesOptions.initialize} `true` to initialize uninitialized modules.
   *
   * @default false
   */
  uninitialized: U;
}, {
  /**
   * You can only use `uninitialized` with exportsless filters!
   */
  uninitialized?: false;
}>;
type LookupModulesOptions<ReturnNamespace extends boolean = boolean, Uninitialized extends boolean = boolean, All extends boolean = boolean, Initialize extends boolean = boolean> = RunFilterReturnExportsOptions<ReturnNamespace> & {
  /**
   * Whether to use cached lookup results.
   */
  cached?: boolean;
} & If<Initialize, {
  /**
   * Whether to initialize matching uninitialized modules.
   *
   * **This will initialize any modules that match the exportsless filter and may cause unintended side effects.**
   */
  initialize?: Initialize;
}, {
  initialize: false;
}> & If<All, LookupModulesOptionsWithAll<All> & { [K in keyof LookupModulesOptionsWithInitializedUninitialized<Uninitialized>]?: never }, LookupModulesOptionsWithInitializedUninitialized<Uninitialized> & { [K in keyof LookupModulesOptionsWithAll<All>]?: never }>;
type LookupModulesResult<F extends Filter, O extends LookupModulesOptions> = [exports: O extends LookupModulesOptions<boolean, boolean, boolean, false> ? LookupFilterResult<F, O> | Nullish : LookupFilterResult<F, O>, id: Metro.ModuleID];
type LookupFilterResult<F extends Filter, O extends LookupModulesOptions> = O extends RunFilterReturnExportsOptions<true> ? MaybeDefaultExportMatched<FilterResult<F>> : FilterResult<F>;
declare const NotFoundResult: [];
type LookupNotFoundResult = typeof NotFoundResult;
/**
 * Lookup modules.
 *
 * You can lookup uninitialized modules by passing `options.uninitialized` when filtering via exportsless filters (eg. `byDependencies`).
 * Use the `moduleStateAware` helper to filter dynamically based on whether the module is initialized or not.
 *
 * @param filter The filter to use.
 * @param options The options to use for the lookup.
 * @returns A generator that yields the module exports that match the filter.
 *
 * @example
 * ```ts
 * const lookup = lookupModules(byProps('x'))
 * // Log all module exports that has exports.x
 * for (const exports of lookup) console.log(exports)
 * ```
 */
declare function lookupModules<F extends Filter>(filter: F): Generator<LookupModulesResult<F, object>, undefined>;
declare function lookupModules<F extends Filter, const O extends (F extends Filter<any, infer WE> ? If<WE, LookupModulesOptions<boolean, false, false>, LookupModulesOptions> : never)>(filter: F, options: O): Generator<LookupModulesResult<F, O>, undefined>;
/**
 * Lookup a module. Skipping creating a `Generator`.
 *
 * @see {@link lookupModules} for more documentation.
 *
 * @param filter The filter to use.
 * @param options The options to use for the lookup.
 * @returns The first module exports that match the filter.
 *
 * @example
 * ```ts
 * const React = lookupModule(byProps<typeof import('react')>('createElement'))
 * ```
 */
declare function lookupModule<F extends Filter>(filter: F): LookupModulesResult<F, object> | LookupNotFoundResult;
declare function lookupModule<F extends Filter, const O extends (F extends Filter<any, infer WE> ? If<WE, LookupModulesOptions<boolean, false, false>, LookupModulesOptions> : never)>(filter: F, options: O): LookupModulesResult<F, O> | LookupNotFoundResult;
/**
 * Lookup an initialized module by its imported path.
 *
 * Think of it as if you are doing a `import * as exports from path`, the app must have already initialized the module or this will return `undefined`.
 *
 * @param path The path to lookup the module by.
 * @returns The module exports if the module is initialized, or `undefined` if the module is not found or not initialized.
 *
 * @example
 * ```ts
 * const [{ default: Logger }] = lookupModuleByImportedPath<{ default: typeof DiscordModules.Logger }>('modules/debug/Logger.tsx')
 * ```
 */
declare function lookupModuleByImportedPath<T = any>(path: string): [exports: T, id: Metro.ModuleID] | [];
declare namespace wait_d_exports {
  export { BaseWaitForModulesOptions, WaitForModulesCallback, WaitForModulesOptions, WaitForModulesResult, WaitForModulesUnsubscribeFunction, waitForModuleByImportedPath, waitForModules };
}
interface BaseWaitForModulesOptions<All extends boolean = boolean> {
  /**
   * Whether to include all modules, including blacklisted ones.
   *
   * @default false
   */
  all?: All;
}
type WaitForModulesUnsubscribeFunction = () => void;
type WaitForModulesCallback<T> = (exports: T, id: Metro.ModuleID) => any;
type WaitForModulesOptions<ReturnNamespace extends boolean = boolean, All extends boolean = boolean> = RunFilterReturnExportsOptions<ReturnNamespace> & BaseWaitForModulesOptions<All> & {
  /**
   * Use cached results **only** (if possible).
   * If there is no cache result, this works as if you did not pass this option at all.
   *
   * By default, waits cache results but does not use them, because new modules may still be found.
   * Use this option as an optimization if you are sure that you don't need to find new modules once results are cached.
   *
   * @default false
   */
  cached?: boolean;
};
type WaitForModulesResult<F extends Filter, O extends WaitForModulesOptions> = O extends RunFilterReturnExportsOptions<true> ? MaybeDefaultExportMatched<FilterResult<F>> : FilterResult<F>;
/**
 * Wait for modules to initialize. **Callback won't be called if the module is already initialized!**
 *
 * @param filter The filter to use.
 * @param callback The callback to call when matching modules are initialized.
 * @param options The options to use for the wait.
 * @returns A function to unsubscribe.
 *
 * @example
 * ```ts
 * const unsub = waitForModules(
 *   byName<typeof import('@shopify/flash-list')>('FlashList'),
 *   // (exports: typeof import('@shopify/flash-list'), id: Metro.ModuleID) => any
 *   (exports, id) => {
 *     unsub()
 *     // Do something with the module...
 *   }
 * )
 * ```
 */
declare function waitForModules<F extends Filter>(filter: F, callback: WaitForModulesCallback<WaitForModulesResult<F, object>>): WaitForModulesUnsubscribeFunction;
declare function waitForModules<F extends (O extends WaitForModulesOptions<boolean, true> ? Filter<any, false> : Filter), O extends WaitForModulesOptions>(filter: F, callback: WaitForModulesCallback<WaitForModulesResult<F, O>>, options: O): WaitForModulesUnsubscribeFunction;
/**
 * Wait for a module to initialize by its imported path. **Callback won't be called if the module is already initialized!**
 *
 * Once callback is called, the subscription will be removed automatically, because modules have unique imported paths.
 *
 * Think of it as if you are doing `import * as exports from path`, and you are also waiting for the app to initialize the module by itself.
 *
 * @param path The path to wait for.
 * @param callback The callback to call once the module is initialized.
 * @param options The options to use for the wait.
 * @returns A function to unsubscribe.
 *
 * @example
 * ```ts
 * waitForModuleByImportedPath(
 *   'utils/PlatformUtils.tsx',
 *   (exports, id) => {
 *      // Do something with the module...
 *   }
 * )
 * ```
 */
declare function waitForModuleByImportedPath<T = any>(path: string, callback: WaitForModulesCallback<T>, options?: BaseWaitForModulesOptions): WaitForModulesUnsubscribeFunction;
declare namespace get_d_exports {
  export { GetModuleCallback, GetModuleOptions, GetModuleResult, GetModuleUnsubscribeFunction, getModule, getModuleByImportedPath };
}
type GetModuleOptions<ReturnNamespace extends boolean = boolean, Uninitialized extends boolean = boolean, All extends boolean = boolean> = WaitForModulesOptions<ReturnNamespace> & LookupModulesOptions<ReturnNamespace, Uninitialized, All, true> & {
  /**
   * The maximum number of modules to get.
   *
   * @default 1
   */
  max?: number;
};
type GetModuleResult<F extends Filter, O extends GetModuleOptions> = O extends RunFilterReturnExportsOptions<true> ? MaybeDefaultExportMatched<FilterResult<F>> : FilterResult<F>;
type GetModuleCallback<T> = (exports: T, id: Metro.ModuleID) => any;
type GetModuleUnsubscribeFunction = () => void;
/**
 * Get modules matching the filter.
 *
 * This is a combination of {@link lookupModule} and {@link waitForModules}.
 *
 * @param filter The filter to use to find the module.
 * @param options The options to use for the find.
 * @returns A promise that resolves to the module's exports or rejects if the find is aborted before a module is found.
 *
 * @example
 * ```ts
 * getModule(byProps<typeof import('react')>('createElement'), React => {
 *   // Immediately called because React is always initialized when plugins are loaded
 * })
 *
 * getModule(byProps<typeof import('@shopify/flash-list')>('FlashList'), FlashList => {
 *   // Called when the module is initialized
 * })
 *
 * // Get multiple modules matching the filter
 * getModule(byProps<ReactNative.AssetsRegistry>('registerAsset'), AssetsRegistry => {
 *   // Called 2 times, once for each module that matches the filter
 * }, { max: 2 })
 * ```
 */
declare function getModule<F extends Filter>(filter: F, callback: GetModuleCallback<FilterResult<F>>): GetModuleUnsubscribeFunction;
declare function getModule<F extends Filter, const O extends (F extends Filter<any, infer WE> ? If<WE, GetModuleOptions<boolean, boolean, false>, GetModuleOptions> : never)>(filter: F, callback: GetModuleCallback<FilterResult<F>>, options: O): GetModuleUnsubscribeFunction;
/**
 * Get a single module by its imported path.
 * Once a module is found, unsubscription happens automatically, since imported paths are unique.
 *
 * @param path The path to find the module by.
 * @param options The options to use for the find.
 * @returns A promise that resolves to the module's exports or rejects if the find is aborted before the module is found.
 *
 * @example
 * ```ts
 * getModuleByImportedPath('modules/main_tabs_v2/native/settings/SettingsConstants.tsx', SettingsConstants => {
 *   console.log('Settings page opened') // Logs once the module is initialized
 * })
 * ```
 */
declare function getModuleByImportedPath<T>(path: string, callback: GetModuleCallback<T>): GetModuleUnsubscribeFunction;
declare namespace index_d_exports$5 {
  export { ModuleFinishedImportingCallback, ModuleFirstRequiredCallback, ModuleInitializedCallback, onAnyModuleFirstRequired, onAnyModuleInitialized, onModuleFinishedImporting, onModuleFirstRequired, onModuleInitialized };
}
type ModuleFirstRequiredCallback = (id: Metro.ModuleID) => void;
type ModuleInitializedCallback = (id: Metro.ModuleID, exports: Metro.ModuleExports) => void;
type ModuleFinishedImportingCallback = (id: Metro.ModuleID, path: string) => void;
/**
 * Registers a callback to be called when any module is initialized.
 *
 * This runs after the module factory has been executed, but before the module is considered initialized by Metro.
 * However, Revenge APIs will consider the module initialized at this point.
 *
 * @see {@link initializedModuleHasBadExports} to avoid bad module exports.
 *
 * @param callback The callback to be called.
 * @returns A function that unregisters the callback.
 */
declare function onAnyModuleInitialized(callback: ModuleInitializedCallback): () => void;
/**
 * Registers a callback to be called when a specific module is initialized.
 *
 * This runs after the module factory has been executed, but before the module is considered initialized by Metro.
 * However, Revenge APIs will consider the module initialized at this point.
 *
 * @see {@link initializedModuleHasBadExports} to avoid bad module exports.
 *
 * @param id The ID of the module.
 * @param callback The callback to be called.
 * @returns A function that unregisters the callback.
 */
declare function onModuleInitialized(id: Metro.ModuleID, callback: ModuleInitializedCallback): () => void;
/**
 * Registers a callback to be called when a module with a specific import path is initialized.
 *
 * @see {@link initializedModuleHasBadExports} to avoid bad module exports.
 *
 * @param callback The callback to be called.
 * @returns A function that unregisters the callback.
 */
declare function onModuleFinishedImporting(callback: ModuleFinishedImportingCallback): () => void;
/**
 * Registers a callback to be called when any module is being initialized.
 *
 * This runs before the module factory is executed.
 *
 * @see {@link initializedModuleHasBadExports} to avoid bad module exports.
 *
 * @param callback The callback to be called.
 * @returns A function that unregisters the callback.
 */
declare function onAnyModuleFirstRequired(callback: ModuleFirstRequiredCallback): () => void;
/**
 * Registers a callback to be called when a specific module is being initialized.
 *
 * This runs before the module factory is executed.
 *
 * @see {@link initializedModuleHasBadExports} to avoid bad module exports.
 *
 * @param id The ID of the module.
 * @param callback The callback to be called.
 * @returns A function that unregisters the callback.
 */
declare function onModuleFirstRequired(id: Metro.ModuleID, callback: ModuleFirstRequiredCallback): () => void;
declare namespace utils_d_exports {
  export { getInitializedModuleExports, getModuleDependencies, isModuleExportBad, isModuleInitialized };
}
/**
 * Returns the dependencies of a module.
 * @param id The module ID.
 * @returns The dependency map of the module, or `undefined` if the module does not exist.
 */
declare function getModuleDependencies(id: Metro.ModuleID): Metro.DependencyMap | undefined;
/**
 * Returns whether a module is initialized.
 * @param id The module ID.
 * @returns Non-zero number if the module is initialized, `0` if it is not initialized or does not exist.
 */
declare function isModuleInitialized(id: Metro.ModuleID): number | undefined;
/**
 * Returns the exports of an initialized module.
 *
 * @see {@link isModuleInitialized} to check if the module is initialized.
 *
 * @param id The module ID.
 * @returns The exports of the module, or `undefined` if the module is not initialized or does not exist.
 */
declare function getInitializedModuleExports(id: Metro.ModuleID): Metro.ModuleExports | undefined;
/**
 * Returns whether a particular module export is bad. This is used for filter functions to check whether an export is filterable.
 * @param exp The export to check.
 */
declare function isModuleExportBad(exp: Metro.ModuleExports[PropertyKey]): boolean;
declare namespace native_d_exports {
  export { getNativeModule };
}
/**
 * Backwards compatible way to get a native module. Throws an error if the module is not found.
 *
 * Use this as a replacement to `TurboModuleRegistry.getEnforcing()`.
 *
 * @see {@link https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/TurboModule/TurboModuleRegistry.js#L19-L39 React Native's source}
 *
 * @param name The name of the native module to get.
 */
declare function getNativeModule<T>(name: string): T | null;
//#endregion
//#region lib/plugins/src/apis/modules.d.ts
interface PluginApiModules {
  finders: PluginApiModulesFinders;
  metro: PluginApiModulesMetro;
  native: PluginApiModulesNative;
}
type PluginApiModulesNative = typeof native_d_exports;
type PluginApiModulesMetro = typeof utils_d_exports & typeof index_d_exports$5;
type PluginApiModulesFinders = typeof get_d_exports & typeof lookup_d_exports & typeof wait_d_exports & {
  filters: typeof filters_d_exports;
};
declare namespace constants_d_exports {
  export { PluginFlags, PluginStatus, PluginsStorageDirectory };
}
/**
 * The plugin flags.
 */
declare const PluginFlags: {
  /**
   * The plugin is enabled.
   */
  Enabled: number;
  /**
   * The plugin requires a reload to apply changes.
   */
  ReloadRequired: number;
  /**
   * The plugin has errors.
   */
  Errored: number;
  /**
   * The plugin was enabled after the app was started.
   * This is usually caused by a newly installed plugin, or a plugin that was re-enabled.
   */
  EnabledLate: number;
};
/**
 * The plugin status.
 */
declare const PluginStatus: {
  PreIniting: number;
  PreInited: number;
  Initing: number;
  Inited: number;
  Starting: number;
  Started: number;
  Stopping: number;
};
declare const PluginsStorageDirectory = "revenge/plugins/storage";
//#endregion
//#region lib/plugins/src/apis/plugins.d.ts
interface PluginApiPlugins {
  constants: typeof constants_d_exports;
}
declare namespace index_d_exports$2 {
  export { React, ReactJSXRuntime, ReactJSXRuntimeModuleId, ReactModuleId, ReactNative$1 as ReactNative, ReactNativeModuleId };
}
declare let ReactModuleId: Metro.ModuleID;
declare let ReactNativeModuleId: Metro.ModuleID;
declare let ReactJSXRuntimeModuleId: Metro.ModuleID;
declare let React: typeof react4;
declare let ReactNative$1: typeof react_native0;
declare let ReactJSXRuntime: typeof react_jsx_runtime0;
declare namespace index_d_exports$3 {
  export { AfterJSXCallback, AnyJSXFactoryFunction, BeforeJSXCallback, InsteadJSXCallback, afterJSX, beforeJSX, insteadJSX };
}
type AnyJSXFactoryFunction = (typeof ReactJSXRuntime)['jsx' | 'jsxs'];
type BeforeJSXCallback<E extends ElementType> = (args: [element: E, props: ElementTypeProps<E>, key?: Key$1 | undefined]) => Parameters<AnyJSXFactoryFunction>;
type InsteadJSXCallback<E extends ElementType> = (args: [element: E, props: ElementTypeProps<E>, key?: Key$1 | undefined], jsx: AnyJSXFactoryFunction) => ReturnType<AnyJSXFactoryFunction> | null;
type AfterJSXCallback<E extends ElementType> = (fiber: ReactElement<ElementTypeProps<E>, E>) => ReturnType<AnyJSXFactoryFunction> | null;
type ElementTypeProps<E extends ElementType> = E extends ElementType<infer Props> ? Props : E extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[E] : never;
/**
 * Registers a hook to be called after a JSX element with the specified type is created.
 *
 * @param type The type of the element.
 * @param patch The hook.
 * @returns A function to unpatch.
 */
declare function afterJSX<E extends ElementType>(type: E, patch: AfterJSXCallback<E>): () => boolean;
/**
 * Registers a hook to be called before a JSX element with the specified type is created.
 *
 * @param type The type of the element.
 * @param patch The hook.
 * @returns A function to unpatch.
 */
declare function beforeJSX<E extends ElementType>(type: E, patch: BeforeJSXCallback<E>): () => boolean;
/**
 * Registers a callback to run instead when a JSX element with the specified type is created.
 *
 * @param type The type of the element.
 * @param patch The hook.
 * @returns A function to unpatch.
 */
declare function insteadJSX<E extends ElementType>(type: E, patch: InsteadJSXCallback<E>): () => boolean;
declare namespace index_d_exports$4 {
  export { onRunApplication, onRunApplicationFinished };
}
/**
 * Registers a callback to be run when a call to {@link AppRegistry.runApplication} is made.
 *
 * @param callback The callback to be called.
 * @returns A function to unregister the callback.
 */
declare function onRunApplication(callback: RunApplicationCallback): () => void;
/**
 * Registers a callback to be run when a call to {@link AppRegistry.runApplication} is finished.
 *
 * @param callback The callback to be called.
 * @returns A function to unregister the callback.
 */
declare function onRunApplicationFinished(callback: RunApplicationCallback): () => void;
//#endregion
//#region lib/plugins/src/apis/react.d.ts
type PluginApiReact = typeof index_d_exports$2 & {
  jsxRuntime: typeof index_d_exports$3;
  native: typeof index_d_exports$4;
};
//#endregion
//#region lib/plugins/src/types.d.ts
interface PluginApiExtensionsOptions {}
/**
 * The unscoped plugin API (very limited). This API is available as a global for plugins.
 * Available in the `preInit` phase.
 */
interface UnscopedPreInitPluginApi<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions> {
  modules: PluginApiModules;
  patcher: typeof index_d_exports;
  plugins: PluginApiPlugins;
  react: PluginApiReact;
}
/**
 * The unscoped plugin API (limited). This API is available as a global for plugins.
 * Available in the `init` phase.
 */
interface UnscopedInitPluginApi<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions> extends UnscopedPreInitPluginApi<O> {
  assets: typeof index_d_exports$1;
}
/**
 * The unscoped plugin API. This API is available as a global for plugins.
 * Available in the `start` and `stop` phase.
 */
interface UnscopedPluginApi<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions> extends UnscopedInitPluginApi<O> {}
/**
 * A cleanup function that can be registered to be called when the plugin is stopped.
 */
type PluginCleanup = () => any;
/**
 * Registers cleanup functions to be called when the plugin is stopped.
 *
 * @example
 * ```ts
 * cleanup(unpatch)
 * cleanup(unsub)
 * ```
 */
type PluginCleanupApi = (...fns: PluginCleanup[]) => void;
/**
 * Decorates the plugin API for the dependents of the plugin with a decorator function.
 * @param decorator The decorator function to apply.
 *
 * @example
 * ```ts
 * // Your plugin's `init` function:
 * init({ decorate }) {
 *   decorate((plugin, options) => {
 *     plugin.api.customMethod = () => {
 *       console.log('Custom method called!')
 *     }
 *   })
 * }
 *
 * // In another plugin, with your plugin as a dependency:
 * init({ customMethod }) {
 *   customMethod() // Logs: "Custom method called!"
 * }
 * ```
 */
type PluginDecorateApi<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions, S extends keyof PluginApiInLifecycleMap<O> = keyof PluginApiInLifecycleMap<O>> = (decorator: PluginApiDecorator<O, S>) => void;
/**
 * The decorator function that modifies the plugin API.
 *
 * @param plugin The plugin being decorated.
 * @param options The options the plugin passed.
 *
 * @see {@link PluginDecorateApi}
 */
type PluginApiDecorator<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions, S extends keyof PluginApiInLifecycleMap<O> = keyof PluginApiInLifecycleMap<O>> = (plugin: Plugin<O, S>, options: O) => void;
/**
 * The plugin API (very limited).
 * Available in the `preInit` phase.
 */
interface PreInitPluginApi<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions> {
  decorate: PluginDecorateApi<O, 'PreInit'>;
  unscoped: UnscopedPreInitPluginApi;
  cleanup: PluginCleanupApi;
  plugin: Plugin;
}
/**
 * The plugin API (limited).
 * Available in the `init` phase.
 */
interface InitPluginApi<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions> extends PreInitPluginApi<O> {
  decorate: PluginDecorateApi<O, 'Init'>;
  unscoped: UnscopedInitPluginApi;
}
/**
 * The plugin API.
 * Available in the `start` and `stop` phase.
 */
interface PluginApi<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions> extends InitPluginApi<O> {
  decorate: PluginDecorateApi<O, 'Start'>;
  unscoped: UnscopedPluginApi;
}
/**
 * The plugin manifest.
 */
interface PluginManifest {
  /**
   * The unique identifier for the plugin.
   */
  id: string;
  /**
   * The name of the plugin.
   */
  name: string;
  /**
   * The author of the plugin.
   */
  author: string;
  /**
   * The description of the plugin.
   */
  description: string;
  /**
   * The icon of the plugin.
   */
  icon?: string;
  /**
   * The dependencies of the plugin.
   */
  dependencies?: PluginDependency[];
}
interface PluginDependency {
  /**
   * The ID of this dependency.
   */
  id: string;
}
interface PluginOptions<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions> extends PluginLifecycles<O> {
  SettingsComponent?: PluginSettingsComponent<O>;
}
/**
 * The plugin lifecycles.
 */
interface PluginLifecycles<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions> {
  /**
   * Runs as soon as possible with very limited APIs.
   * Before the index module (module 0)'s factory is run.
   *
   * @param api Plugin API (very limited).
   */
  preInit?: (api: PreInitPluginApi<O>) => any;
  /**
   * Runs as soon as all important modules are initialized.
   * After the index module (module 0)'s factory is run.
   *
   * @param api Plugin API (limited).
   */
  init?: (api: InitPluginApi<O>) => any;
  /**
   * Runs when the plugin can be started with all APIs available.
   *
   * @param api Plugin API.
   */
  start?: (api: PluginApi<O>) => any;
  /**
   * Runs when the plugin is stopped.
   *
   * @param api Plugin API.
   */
  stop?: (api: PluginApi<O>) => any;
}
interface Plugin<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions, S extends keyof PluginApiInLifecycleMap<O> = keyof PluginApiInLifecycleMap<O>> {
  manifest: PluginManifest;
  lifecycles: PluginLifecycles<O>;
  /**
   * @see {@link PluginFlags}
   */
  flags: number;
  /**
   * @see {@link PluginStatus}
   */
  status: number;
  /**
   * Errors encountered during the plugin lifecycles.
   */
  errors: unknown[];
  SettingsComponent?: PluginSettingsComponent<O>;
  /**
   * Disable the plugin.
   * This will also stop the plugin if it is running.
   */
  disable(): Promise<void>;
  /**
   * Stop the plugin.
   */
  stop(): Promise<void>;
  /**
   * The plugin API.
   *
   * Not recommended to use this directly.
   */
  api: PluginApiInLifecycleMap<O>[S];
}
/**
 * The plugin API in a specific stage.
 */
type PluginApiInLifecycleMap<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions> = {
  Register: undefined;
  PreInit: PreInitPluginApi<O>;
  Init: InitPluginApi<O>;
  Start: PluginApi<O>;
};
/**
 * The component that renders the plugin settings page.
 */
interface PluginSettingsComponent<O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions> extends FunctionComponent<{
  api: PluginApi<O>;
}> {}
//#endregion
export { InitPluginApi, Plugin, PluginApi, PluginApiDecorator, PluginApiExtensionsOptions, PluginApiInLifecycleMap, PluginCleanup, PluginCleanupApi, PluginDecorateApi, PluginDependency, PluginLifecycles, PluginManifest, PluginOptions, PluginSettingsComponent, PreInitPluginApi, UnscopedInitPluginApi, UnscopedPluginApi, UnscopedPreInitPluginApi };