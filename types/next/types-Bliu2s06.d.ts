import { n as Metro } from "./types-DW6-O3QH.js";
import { t as ReactNative } from "./types-B3fMYLLv.js";

//#region lib/assets/src/types.d.ts
type Asset = PackagerAsset | CustomAsset;
type AssetId = number;
type PackagerAsset = ReactNative.AssetsRegistry.PackagerAsset;
interface CustomAsset extends Pick<PackagerAsset, 'name' | 'width' | 'height' | 'type' | 'id'> {
  uri: string;
  moduleId?: undefined;
}
type RegisterableAsset = Omit<CustomAsset, 'id'>;
declare module '@revenge-mod/react/types' {
  namespace ReactNative {
    namespace AssetsRegistry {
      interface PackagerAsset {
        id: AssetId;
        moduleId: Metro.ModuleID;
      }
    }
  }
}
//#endregion
export { RegisterableAsset as a, PackagerAsset as i, AssetId as n, CustomAsset as r, Asset as t };