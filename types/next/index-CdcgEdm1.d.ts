import { t as __export } from "./chunk-Bp6m_JJh.js";
import { a as DeepPartial, i as AnyObject, s as If } from "./types-Q9nY_LVo.js";

//#region lib/storage/src/index.d.ts
declare namespace index_d_exports {
  export { Storage, StorageDirectory, StorageOptions, StorageSubscription, StorageUpdateMode, UseStorageFilter, getStorage };
}
type StorageSubscription<T extends AnyObject = AnyObject> = (update: DeepPartial<T>, mode: (typeof StorageUpdateMode)[keyof typeof StorageUpdateMode]) => void;
declare const StorageUpdateMode: {
  /**
   * The update will be merged into the existing storage.
   */
  readonly Merge: 0;
  /**
   * The update will replace the existing storage.
   */
  readonly Replace: 1;
  /**
   * Same behavior as {@link StorageUpdateMode.Replace}, but for the intial load of the storage.
   */
  readonly Load: 2;
};
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
   *
   * @default 'documents'
   */
  directory?: StorageDirectory;
  /**
   * The default value to use for the storage. This will also be used for cache.
   *
   * @default {}
   */
  default?: T;
  /**
   * Automatically load the storage after creating the instance.
   *
   * @default false
   */
  load?: boolean;
}
type UseStorageFilter<T extends AnyObject = AnyObject> = (...params: Parameters<StorageSubscription<T>>) => any;
interface Storage<T extends AnyObject> {
  /**
   * Whether the storage has been loaded. If the storage is not loaded, `storage.cache` may be `undefined`.
   * If you have `options.default` set, you can use this property to check if `storage.cache` is the default value or not.
   */
  loaded: boolean;
  /**
   * The cached storage object. Set once `get()` is called, and updated on `set()`.
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
   * Subscribe to storage updates.
   *
   * @param callback The callback to call when the storage is updated.
   * @returns A function to unsubscribe.
   */
  subscribe(callback: StorageSubscription<T>): () => void;
  /**
   * Get the storage.
   */
  get(): Promise<T>;
  /**
   * Set the storage.
   *
   * @param value The value to merge into the storage.
   * @param replace If true, replaces the entire storage instead of merging.
   */
  set(value: DeepPartial<T>): Promise<void>;
  set<Replace extends boolean>(value: If<Replace, T, DeepPartial<T>>, replace: Replace): Promise<void>;
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
export { StorageUpdateMode as a, index_d_exports as c, StorageSubscription as i, StorageDirectory as n, UseStorageFilter as o, StorageOptions as r, getStorage as s, Storage as t };