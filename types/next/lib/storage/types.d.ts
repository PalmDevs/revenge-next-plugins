import "../../callback-CpIFpq3_.js";
import "../../error-D0foBB4e.js";
import { AnyObject } from "../../types-Bg9fFOmx.js";
import "../../promise-DVfFbAlR.js";
import "../../proxy-BpNB6oQJ.js";
import { Storage, StorageOptions, index_d_exports } from "../../index-CaB0y8Xp.js";

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