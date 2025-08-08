import "../../callback-CpIFpq3_.js";
import "../../error-D0foBB4e.js";
import { AnyObject } from "../../types-FBMSiw9W.js";
import "../../promise-DVfFbAlR.js";
import "../../proxy-DDf0OBup.js";
import { Storage, StorageOptions, index_d_exports } from "../../index-CfIKLXMq.js";

//#region lib/storage/src/types.d.ts
declare module '@revenge-mod/plugins/types' {
  interface UnscopedPreInitPluginApi {
    storage: typeof index_d_exports;
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