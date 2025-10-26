import { t as __export } from "./chunk-Bp6m_JJh.js";
import * as react_native0 from "react-native";

//#region lib/externals/src/react-native-clipboard.d.ts
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
//#endregion
export { react_native_clipboard_d_exports as n, useClipboard as r, Clipboard as t };