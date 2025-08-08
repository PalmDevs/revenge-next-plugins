declare namespace error_d_exports {
  export { getCurrentStack, getErrorStack };
}
declare function getErrorStack(e: unknown): string | undefined;
declare function getCurrentStack(): string;
//#endregion
export { error_d_exports, getCurrentStack, getErrorStack };