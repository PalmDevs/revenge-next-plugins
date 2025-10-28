import { t as __export } from "./chunk-Bp6m_JJh.js";
import { M as Filter, R as FilterResult, n as Metro, s as If, t as MaybeDefaultExportMatched, u as Not } from "./types-Q9nY_LVo.js";

//#region lib/modules/src/finders/_internal.d.ts
interface RunFilterOptions {
  /**
   * Whether to skip checking the default export.
   *
   * @default false
   */
  skipDefault?: boolean;
  /**
   * Whether to allow initializing modules to confirm their exports.
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
//#endregion
//#region lib/modules/src/finders/lookup.d.ts
type LookupModulesOptions<ReturnNamespace extends boolean = boolean, Initialize extends boolean = boolean> = RunFilterReturnExportsOptions<ReturnNamespace> & {
  /**
   * Whether to use cached lookup results.
   */
  cached?: boolean;
} & If<Not<Initialize>, {
  /**
   * Whether to initialize matching uninitialized modules.
   *
   * **This will initialize any modules that match the exportsless filter and may cause unintended side effects.**
   */
  initialize: false;
}, {
  initialize?: true;
}>;
type LookupModulesResult<F extends Filter, O extends LookupModulesOptions> = [exports: LookupFilterResult<F, O>, id: Metro.ModuleID];
type LookupFilterResult<F extends Filter, O extends LookupModulesOptions> = O extends LookupModulesOptions<any, false> ? InitializedLookupFilterResult<F, O> | undefined : InitializedLookupFilterResult<F, O>;
type InitializedLookupFilterResult<F extends Filter, O extends LookupModulesOptions> = O extends RunFilterReturnExportsOptions<true> ? MaybeDefaultExportMatched<FilterResult<F>> : FilterResult<F>;
declare const NotFoundResult: readonly [];
type LookupNotFoundResult = typeof NotFoundResult;
/**
 * Lookup modules.
 *
 * @param filter The filter to use.
 * @param options The options to use for the lookup.
 * @returns A generator that yields the module exports that match the filter.
 *
 * @example
 * ```ts
 * const lookup = lookupModules(withProps('x'))
 * // Log all module exports that has exports.x
 * for (const [exports, id] of lookup) console.log(id, exports)
 * ```
 */
declare function lookupModules<F extends Filter>(filter: F): Generator<LookupModulesResult<F, object>, undefined>;
declare function lookupModules<F extends Filter, const O extends LookupModulesOptions>(filter: F, options: O): Generator<LookupModulesResult<F, O>, undefined>;
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
 * const [React, ReactModuleId] = lookupModule(withProps<typeof import('react')>('createElement'))
 * ```
 */
declare function lookupModule<F extends Filter>(filter: F): LookupModulesResult<F, object> | LookupNotFoundResult;
declare function lookupModule<F extends Filter, const O extends LookupModulesOptions>(filter: F, options: O): LookupModulesResult<F, O> | LookupNotFoundResult;
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
 * const [{ default: Logger }] = lookupModuleWithImportedPath<{ default: typeof DiscordModules.Logger }>('modules/debug/Logger.tsx')
 * ```
 */
declare function lookupModuleWithImportedPath<T = any>(path: string): [exports: T, id: Metro.ModuleID] | LookupNotFoundResult;
//#endregion
//#region lib/modules/src/finders/wait.d.ts
type WaitForModulesUnsubscribeFunction = () => void;
type WaitForModulesCallback<T> = (exports: T, id: Metro.ModuleID) => any;
type WaitForModulesOptions<ReturnNamespace extends boolean = boolean> = RunFilterReturnExportsOptions<ReturnNamespace> & {
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
 *   withName<typeof import('@shopify/flash-list')>('FlashList'),
 *   // (exports: typeof import('@shopify/flash-list'), id: Metro.ModuleID) => any
 *   (exports, id) => {
 *     unsub()
 *     // Do something with the module...
 *   }
 * )
 * ```
 */
declare function waitForModules<F extends Filter>(filter: F, callback: WaitForModulesCallback<WaitForModulesResult<F, object>>): WaitForModulesUnsubscribeFunction;
declare function waitForModules<F extends Filter, O extends WaitForModulesOptions>(filter: F, callback: WaitForModulesCallback<WaitForModulesResult<F, O>>, options: O): WaitForModulesUnsubscribeFunction;
/**
 * Wait for a module to initialize by its imported path. **Callback won't be called if the module is already initialized!**
 *
 * Once callback is called, the subscription will be removed automatically, because modules have unique imported paths.
 *
 * Think of it as if you are doing `import * as exports from path`, and you are also waiting for the app to initialize the module by itself.
 *
 * @param path The path to wait for.
 * @param callback The callback to call once the module is initialized.
 * @returns A function to unsubscribe.
 *
 * @example
 * ```ts
 * waitForModuleWithImportedPath(
 *   'utils/PlatformUtils.tsx',
 *   (exports, id) => {
 *      // Do something with the module...
 *   }
 * )
 * ```
 */
declare function waitForModuleWithImportedPath<T = any>(path: string, callback: WaitForModulesCallback<T>): WaitForModulesUnsubscribeFunction;
//#endregion
//#region lib/modules/src/finders/get.d.ts
type GetModulesOptions<ReturnNamespace extends boolean = boolean> = WaitForModulesOptions<ReturnNamespace> & LookupModulesOptions<ReturnNamespace, true> & {
  /**
   * The maximum number of modules to get.
   *
   * @default 1
   */
  max?: number;
};
type GetModulesResult<F extends Filter, O extends GetModulesOptions> = WaitForModulesResult<F, O>;
type GetModulesCallback<T> = (exports: T, id: Metro.ModuleID) => any;
type GetModulesUnsubscribeFunction = () => void;
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
 * getModules(withProps<typeof import('react')>('createElement'), React => {
 *   // Immediately called because React is always initialized when plugins are loaded
 * })
 *
 * getModules(withProps<typeof import('@shopify/flash-list')>('FlashList'), FlashList => {
 *   // Called when the module is initialized
 * })
 *
 * // Get multiple modules matching the filter
 * getModules(withProps<ReactNative.AssetsRegistry>('registerAsset'), AssetsRegistry => {
 *   // Called 2 times, once for each module that matches the filter
 * }, { max: 2 })
 * ```
 */
declare function getModules<F extends Filter>(filter: F, callback: GetModulesCallback<FilterResult<F>>): GetModulesUnsubscribeFunction;
declare function getModules<F extends Filter, const O extends GetModulesOptions>(filter: F, callback: GetModulesCallback<GetModulesResult<F, O>>, options: O): GetModulesUnsubscribeFunction;
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
 * getModuleWithImportedPath('modules/main_tabs_v2/native/settings/SettingsConstants.tsx', SettingsConstants => {
 *   console.log('Settings page opened') // Logs once the module is initialized
 * })
 * ```
 */
declare function getModuleWithImportedPath<T>(path: string, callback: GetModulesCallback<T>): GetModulesUnsubscribeFunction;
declare namespace index_d_exports {
  export { GetModulesCallback, GetModulesOptions, GetModulesResult, GetModulesUnsubscribeFunction, LookupModulesOptions, LookupModulesResult, WaitForModulesCallback, WaitForModulesOptions, WaitForModulesResult, WaitForModulesUnsubscribeFunction, getModuleWithImportedPath, getModules, lookupModule, lookupModuleWithImportedPath, lookupModules, waitForModuleWithImportedPath, waitForModules };
}
//#endregion
export { lookupModuleWithImportedPath as _, GetModulesUnsubscribeFunction as a, WaitForModulesCallback as c, WaitForModulesUnsubscribeFunction as d, waitForModuleWithImportedPath as f, lookupModule as g, LookupModulesResult as h, GetModulesResult as i, WaitForModulesOptions as l, LookupModulesOptions as m, GetModulesCallback as n, getModuleWithImportedPath as o, waitForModules as p, GetModulesOptions as r, getModules as s, index_d_exports as t, WaitForModulesResult as u, lookupModules as v };