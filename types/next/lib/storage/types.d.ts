import "../../callback-CpIFpq3_.js";
import "../../error-D0foBB4e.js";
import { AnyObject } from "../../types-Cp614Xl1.js";
import "../../promise-DVfFbAlR.js";
import "../../proxy-DDf0OBup.js";
import { Storage, StorageOptions } from "../../index-B_b2GFhC.js";

//#region lib/storage/src/types.d.ts
declare module '@revenge-mod/plugins/types' {
  interface UnscopedPreInitPluginApi {
    storage: typeof _0;
  }
  interface PluginApiExtensionsOptions {
    storage?: AnyObject;
  }
  interface PluginOptions<O extends PluginApiExtensionsOptions> {
    storage?: Omit<StorageOptions<NonNullable<O['storage']>>, 'directory'>;
  }
  interface InitPluginApi<O extends PluginApiExtensionsOptions> {
    /**
     * The plugin storage.
     *
     * Note that the instance is only created when the plugin accesses the API.
     * This is to prevent unnecessary storage instances from being created.
     *
     * To preload storage, simply call `api.storage.get()`.
     */
    storage: Storage<NonNullable<O['storage']>>;
  }
}