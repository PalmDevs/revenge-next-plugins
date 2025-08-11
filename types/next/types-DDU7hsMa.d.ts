import { filters_d_exports } from "./types-Cp614Xl1.js";
import { get_d_exports, lookup_d_exports, wait_d_exports } from "./get-CYr5UUWr.js";
import { index_d_exports, utils_d_exports } from "./utils-Ct3efe6s.js";
import { index_d_exports as index_d_exports$1 } from "./index-TB3Bhfb_.js";
import { native_d_exports } from "./native-DyvCsXCB.js";
import { index_d_exports as index_d_exports$2 } from "./index-Ct3qDCb_.js";
import { constants_d_exports } from "./constants-NMvHIMl8.js";
import { index_d_exports as index_d_exports$3 } from "./index-BTPKjoF0.js";
import { index_d_exports as index_d_exports$4 } from "./index-Bh48FrSP.js";
import { index_d_exports as index_d_exports$5 } from "./index-wMnB9IQd.js";
import { FunctionComponent } from "react";

//#region lib/plugins/src/apis/modules.d.ts
interface PluginApiModules {
  finders: PluginApiModulesFinders;
  metro: PluginApiModulesMetro;
  native: PluginApiModulesNative;
}
type PluginApiModulesNative = typeof native_d_exports;
type PluginApiModulesMetro = typeof utils_d_exports & typeof index_d_exports;
type PluginApiModulesFinders = typeof get_d_exports & typeof lookup_d_exports & typeof wait_d_exports & {
  filters: typeof filters_d_exports;
};
//#endregion
//#region lib/plugins/src/apis/plugins.d.ts
interface PluginApiPlugins {
  constants: typeof constants_d_exports;
}
//#endregion
//#region lib/plugins/src/apis/react.d.ts
type PluginApiReact = typeof index_d_exports$3 & {
  jsxRuntime: typeof index_d_exports$4;
  native: typeof index_d_exports$5;
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
  patcher: typeof index_d_exports$2;
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