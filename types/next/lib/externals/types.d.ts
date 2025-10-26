import { i as react_navigation_d_exports } from "../../react-navigation-BsoHQk3U.js";
import { t as browserify_d_exports } from "../../browserify-CGsvxXZL.js";
import { n as react_native_clipboard_d_exports } from "../../react-native-clipboard-CrPpTkCh.js";
import { n as shopify_d_exports } from "../../shopify-D-OLaWXP.js";

//#region lib/externals/src/types.d.ts
interface PluginApiExternals {
  Browserify: typeof browserify_d_exports;
  ReactNativeClipboard: typeof react_native_clipboard_d_exports;
  ReactNavigation: typeof react_navigation_d_exports;
  Shopify: typeof shopify_d_exports;
}
declare module '@revenge-mod/plugins/types' {
  interface UnscopedInitPluginApi {
    externals: PluginApiExternals;
  }
}
//#endregion
export { PluginApiExternals };