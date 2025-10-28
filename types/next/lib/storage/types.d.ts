import "../../callback-DNr1bYVq.js";
import "../../error-DWG2BlZz.js";
import { i as AnyObject } from "../../types-Q9nY_LVo.js";
import "../../promise-Du5Pcai3.js";
import "../../proxy-KNbRcH7H.js";
import { c as index_d_exports, r as StorageOptions, t as Storage } from "../../index-CdcgEdm1.js";

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