import { react_navigation_d_exports } from "../../react-navigation-wYcO9zPQ.js";
import * as react_native0 from "react-native";
import * as node_util0 from "node:util";
import * as _shopify_flash_list0 from "@shopify/flash-list";

//#region lib/externals/src/browserify.d.ts
declare namespace browserify_d_exports {
  export { nodeUtil };
}
declare let nodeUtil: typeof node_util0;
declare namespace react_native_clipboard_d_exports {
  export { Clipboard, useClipboard };
}
declare let Clipboard: {
    getString(): Promise<string>;
    getStrings(): Promise<string[]>;
    getImagePNG(): Promise<string>;
    getImageJPG(): Promise<string>;
    setImage(content: string): void;
    getImage(): Promise<string>;
    setString(content: string): void;
    setStrings(content: string[]): void;
    hasString(): Promise<boolean>;
    hasImage(): Promise<boolean>;
    hasURL(): Promise<boolean> | undefined;
    hasNumber(): Promise<boolean> | undefined;
    hasWebURL(): Promise<boolean> | undefined;
    addListener(callback: () => void): react_native0.EmitterSubscription;
    removeAllListeners(): void;
  }, useClipboard: () => [string, (content: string) => void];
declare namespace shopify_d_exports {
  export { FlashList };
}
declare let FlashList: typeof _shopify_flash_list0;
//#endregion
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