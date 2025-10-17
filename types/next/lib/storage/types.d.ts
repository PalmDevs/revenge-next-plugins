import "../../callback-CpIFpq3_.js";
import "../../error-D0foBB4e.js";
import { AnyObject } from "../../types-BPYGQFpF.js";
import "../../promise-DVfFbAlR.js";
import "../../proxy-BpNB6oQJ.js";
import { Storage, StorageOptions, index_d_exports } from "../../index-BXTIQcgg.js";

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
     */
    storage: Storage<NonNullable<O['storage']>>;
  }
}