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
export { PluginFlags, PluginStatus, PluginsStorageDirectory, constants_d_exports };