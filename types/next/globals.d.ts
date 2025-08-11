import "./callback-CpIFpq3_.js";
import "./error-D0foBB4e.js";
import { Metro } from "./types-Cp614Xl1.js";
import "./promise-DVfFbAlR.js";
import "./proxy-DDf0OBup.js";
import "./get-CYr5UUWr.js";
import "./utils-Ct3efe6s.js";
import "./types-D-OD8n69.js";
import "./types-CHrPZm8H.js";
import "./index-TB3Bhfb_.js";
import "./native-DyvCsXCB.js";
import "./types-BwbmL3IL.js";
import "./index-Ct3qDCb_.js";
import "./constants-NMvHIMl8.js";
import { PluginApiExtensionsOptions, PluginManifest, PluginOptions } from "./types-DDU7hsMa.js";
import "./index-BTPKjoF0.js";
import "./index-Bh48FrSP.js";
import "./index-wMnB9IQd.js";
import { ImageProps, ScrollViewProps, TextProps, ViewProps } from "react-native";

//#region types/globals.d.ts
/// REACT NATIVE COMPONENTS
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      // TODO(PalmDevs): more intrinsic elements?
      RCTView: ViewProps;
      RCTImage: ImageProps;
      RCTScrollView: ScrollViewProps;
      RCTText: TextProps;
    }
  }
}

/// HERMES

declare global {
  const HermesInternal: HermesInternalObject;
  function setTimeout(cb: (...args: unknown[]) => unknown, timeout?: number): number;
  /**
   * Calls the garbage collector
   */
  function gc(): void;
  interface HermesInternalObject {
    getRuntimeProperties(): Record<string, string>;
    // biome-ignore lint/complexity/noBannedTypes: You can pass any function here
    getFunctionLocation(fn: Function): {
      fileName: string;
      lineNumber: number;
      columnNumber: number;
      segmentID: number;
      virtualOffset: number;
      isNative: boolean;
    };
  }
}

/// HERMES PROMISES

declare global {
  // biome-ignore lint/correctness/noUnusedVariables: Type parameter names must match
  interface Promise<T> {
    /// PROMISE POLYFILLS FROM: https://github.com/then/promise
    /// AND: https://github.com/facebook/hermes/blob/main/lib/InternalBytecode/01-Promise.js
    _h: 0 | 1 | 2;
    /**
     * The resolved value of the promise, if it has been resolved.
     */
    _j: any;
  }
  type HermesPromiseRejectionHandler = (promise: Promise<any>, error: any) => void;
  interface PromiseConstructor {
    _m: HermesPromiseRejectionHandler;
  }
}

/// REACT DEVTOOLS

declare global {
  var __REACT_DEVTOOLS_GLOBAL_HOOK__: unknown | undefined;
  var __REACT_DEVTOOLS__: {
    version: number;
    exports: {
      connectToDevTools(opts: {
        host?: string;
        port?: number;
        websocket?: WebSocket;
      }): void;
    };
  } | undefined;
}

/// METRO

declare global {
  var __METRO_GLOBAL_PREFIX__: '';
  var __d: Metro.DefineFn;
  var __r: Metro.RequireFn & {
    importDefault: Metro.ImportDefaultFn;
    importAll: Metro.ImportAllFn;
  };
  var __c: Metro.ClearFn;
}

/// REACT NATIVE

declare global {
  var nativeModuleProxy: Record<string, unknown>;
  var __turboModuleProxy: ((name: string) => unknown) | undefined;
  function nativeLoggingHook(str: string, level: number): void;
  function alert(message: unknown): void;
  var nativePerformanceNow: typeof performance.now;
  var performance: {
    now(): number;
  };
}
//#endregion
//#region types/globals.consumers.d.ts
declare global {
  export function plugin<O extends PluginApiExtensionsOptions>(manifest: PluginManifest, options: PluginOptions<O>): void;
}