import "../../callback-DNr1bYVq.js";
import "../../error-DWG2BlZz.js";
import { i as AnyObject } from "../../types-DW6-O3QH.js";
import "../../promise-Du5Pcai3.js";
import "../../proxy-KNbRcH7H.js";
import { r as StorageOptions, t as Storage } from "../../index-DSmo0zbS.js";

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
     */
    storage: Storage<NonNullable<O['storage']>>;
  }
}