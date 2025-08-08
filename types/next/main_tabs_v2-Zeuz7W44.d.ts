import { NavigationContainerRef } from "@react-navigation/core";

//#region lib/discord/src/modules/main_tabs_v2.d.ts
declare namespace main_tabs_v2_d_exports {
  export { RootNavigationRef };
}
interface RootNavigationRef {
  getRootNavigationRef<T extends object = Record<string, unknown>>(): NavigationContainerRef<T>;
}
declare let RootNavigationRef: RootNavigationRef;
//#endregion
export { RootNavigationRef, main_tabs_v2_d_exports };