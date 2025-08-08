import * as _react_navigation_stack0 from "@react-navigation/stack";
import * as _react_navigation_native0 from "@react-navigation/native";

//#region lib/externals/src/react-navigation.d.ts
declare namespace react_navigation_d_exports {
  export { ReactNavigationNative, ReactNavigationParamList, ReactNavigationStack };
}
declare let ReactNavigationNative: typeof _react_navigation_native0;
declare let ReactNavigationStack: typeof _react_navigation_stack0;
interface ReactNavigationParamList {
  [Page: string]: any;
}
declare global {
  namespace ReactNavigation {
    interface RootParamList extends ReactNavigationParamList {}
  }
}
//#endregion
export { ReactNavigationNative, ReactNavigationParamList, ReactNavigationStack, react_navigation_d_exports };