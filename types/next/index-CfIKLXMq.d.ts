import { AnyObject, DeepPartial } from "./types-FBMSiw9W.js";

//#region lib/storage/src/index.d.ts
declare namespace index_d_exports {
  export { Storage, StorageDirectory, StorageOptions, StorageSubscription, UseStorageFilter, getStorage };
}
type StorageSubscription<T extends AnyObject = AnyObject> = (v: DeepPartial<T>) => void;
declare function Storage<T extends AnyObject>(this: Storage<T>, path: string, options?: StorageOptions<T>): void;
/**
 * Get a storage object for a given path and directory.
 *
 * @param path Path relative to the directory.
 * @param directory Directory to use. Can be either 'cache' or 'documents'.
 */
declare function getStorage<T extends AnyObject = AnyObject>(path: string, options?: StorageOptions<T>): Storage<T>;
interface StorageOptions<T extends AnyObject = AnyObject> {
  /**
   * The directory of the storage file.
   */
  directory?: StorageDirectory;
  /**
   * The default value to use for the storage. This will also be used for cache.
   */
  default?: T;
  /**
   * Automatically load the storage after creating the instance.
   */
  load?: boolean;
}
type UseStorageFilter<T extends AnyObject> = (newValue: DeepPartial<T>) => any;
interface Storage<T extends AnyObject> {
  /**
   * Whether the storage has been loaded. If the storage is not loaded, `storage.cache` may be `undefined`.
   * If you have `options.default` set, you can use this property to check if `storage.cache` is the default value or not.
   */
  loaded: boolean;
  /**
   * The cached storage object. Set once `get()` is called, or `options.default` is set, and updated on `set()`.
   * You should not modify this directly.
   */
  cache?: T | AnyObject;
  /**
   * Use the storage in a React component. The component will re-render when the storage is updated.
   *
   * This can only be used in the `init` stage or later, as it requires React to be initialized.
   *
   * @example
   * ```tsx
   * type Settings = { key: boolean, nested: { key: boolean } }
   *
   * const SettingsStorage = getStorage<Settings>('settings.json')
   *
   * const MyComponent = () => {
   *   // Re-renders every time any of the keys in the settings object change
   *   const settings = SettingsStorage.use()
   *   // const settings: Settings | undefined
   *
   *   // ...
   * }
   *
   * const MyComponent2 = () => {
   *  // Re-renders every time the new value matches the filter
   *  const settings = SettingsStorage.use(val => val.key !== undefined)
   *  // const settings: Settings | undefined
   *
   *  // ...
   * }
   */
  use(filter?: UseStorageFilter<T>): T | undefined;
  /**
   * Get the storage.
   */
  get(): Promise<T>;
  /**
   * Set the storage.
   *
   * @param value The value to merge into the storage.
   */
  set(value: DeepPartial<T>): Promise<void>;
  /**
   * Whether the storage is exists.
   */
  exists(): Promise<boolean>;
  /**
   * Delete the storage.
   */
  delete(): Promise<boolean>;
}
type StorageDirectory = 'cache' | 'documents';
//#endregion
export { Storage, StorageDirectory, StorageOptions, StorageSubscription, UseStorageFilter, getStorage, index_d_exports };