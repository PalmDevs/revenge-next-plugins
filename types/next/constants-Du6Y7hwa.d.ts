import { t as __export } from "./chunk-Bp6m_JJh.js";

//#region lib/plugins/src/constants.d.ts
declare namespace constants_d_exports {
  export { PersistentPluginFlags, PluginFlags, PluginStatus, PluginsStorageDirectory };
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
 * A bitmask of {@link PluginFlags} that are persisted to storage.
 */
declare const PersistentPluginFlags: number;
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
export { constants_d_exports as a, PluginsStorageDirectory as i, PluginFlags as n, PluginStatus as r, PersistentPluginFlags as t };