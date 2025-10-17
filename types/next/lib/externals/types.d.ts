import { react_navigation_d_exports } from "../../react-navigation-DfGB4RR1.js";
import { browserify_d_exports } from "../../browserify-BxcihDgV.js";
import { react_native_clipboard_d_exports } from "../../react-native-clipboard-fHNosp5j.js";
import { shopify_d_exports } from "../../shopify-jZDPwvM6.js";

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