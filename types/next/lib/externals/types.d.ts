import { react_navigation_d_exports } from "../../react-navigation-CSMv1yLA.js";
import { browserify_d_exports } from "../../browserify-Cxev1HMu.js";
import { react_native_clipboard_d_exports } from "../../react-native-clipboard-Cs-QPNpJ.js";
import { shopify_d_exports } from "../../shopify-DwPBpQ_q.js";

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