import { t as __export } from "./chunk-Bp6m_JJh.js";

//#region lib/modules/src/native/index.d.ts
declare namespace index_d_exports {
  export { BridgeInfo, MethodArgs, MethodName, MethodResult, Methods, callBridgeMethod, callBridgeMethodSync, getBridgeInfo, getNativeModule };
}
/**
 * Backwards compatible way to get a native module. Throws an error if the module is not found.
 *
 * Use this as a replacement to `TurboModuleRegistry.getEnforcing()`.
 *
 * @see {@link https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/TurboModule/TurboModuleRegistry.js#L19-L39 React Native's source}
 *
 * @param name The name of the native module to get.
 */
declare function getNativeModule<T>(name: string): T | null;
/**
 * Calls a method on the native module and returns a promise that resolves with the result.
 *
 * @param name The name of the native method to call.
 * @param args The arguments to pass to the native method.
 * @returns A promise that resolves with the result of the native method call.
 */
declare function callBridgeMethod<N extends MethodName>(name: N, args: MethodArgs<N>): Promise<MethodResult<N>>;
/**
 * Calls a method on the native module synchronously and returns the result.
 *
 * Only use synchronous methods when absolutely necessary, as they block JS execution until the native method returns.
 *
 * @param name The name of the native method to call.
 * @param args The arguments to pass to the native method.
 * @returns The result of the native method call.
 */
declare function callBridgeMethodSync<N extends MethodName>(name: N, args: MethodArgs<N>): MethodResult<N>;
/**
 * Get the bridge information.
 */
declare function getBridgeInfo(): BridgeInfo | null;
interface BridgeInfo {
  name: string;
  version: number;
}
type MethodName = Extract<keyof Methods, string>;
type MethodArgs<T extends MethodName> = Methods[T][0];
type MethodResult<T extends MethodName> = Methods[T][1];
interface Methods {
  'revenge.info': [[], BridgeInfo];
}
//#endregion
export { Methods as a, getBridgeInfo as c, MethodResult as i, getNativeModule as l, MethodArgs as n, callBridgeMethod as o, MethodName as r, callBridgeMethodSync as s, BridgeInfo as t, index_d_exports as u };