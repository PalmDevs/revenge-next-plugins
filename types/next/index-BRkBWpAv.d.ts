import { Metro } from "./types-UvuTPXDD.js";
import { ReactNative } from "./types-gnIxC4_N.js";
import { Asset, AssetId, CustomAsset, PackagerAsset, RegisterableAsset } from "./types-BBib54VW.js";

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
declare namespace index_d_exports {
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
export { AssetsRegistry, AssetsRegistryModuleId, addAssetOverride, getAssetByName, getAssetIdByName, getAssets, getAssetsByName, getCustomAssets, getPackagerAssets, index_d_exports, registerAsset, removeAssetOverride, setPreferredAssetType };