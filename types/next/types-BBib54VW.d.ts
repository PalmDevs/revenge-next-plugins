import { Metro } from "./types-UvuTPXDD.js";
import { ReactNative } from "./types-gnIxC4_N.js";

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
export { Asset, AssetId, CustomAsset, PackagerAsset, RegisterableAsset };