import { t as __export } from "./chunk-Bp6m_JJh.js";
import { n as Metro } from "./types-Q9nY_LVo.js";

//#region lib/modules/src/metro/subscriptions/index.d.ts
declare namespace index_d_exports {
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
//#endregion
export { utils_d_exports as a, ModuleInitializedCallback as c, onAnyModuleInitialized as d, onModuleFinishedImporting as f, isModuleInitialized as i, index_d_exports as l, onModuleInitialized as m, getModuleDependencies as n, ModuleFinishedImportingCallback as o, onModuleFirstRequired as p, isModuleExportBad as r, ModuleFirstRequiredCallback as s, getInitializedModuleExports as t, onAnyModuleFirstRequired as u };