import { DiscordModules } from "./index-DNiry_Zd.js";
import * as react0 from "react";

//#region lib/components/src/TableRowAssetIcon.d.ts
declare function TableRowAssetIcon(props: TableRowAssetIconProps): react0.JSX.Element;
type TableRowAssetIconProps = Omit<DiscordModules.Components.TableRowIconProps, 'source'> & ({
  name: string;
  id?: never;
} | {
  name?: never;
  id: number;
});
//#endregion
export { TableRowAssetIcon, TableRowAssetIconProps };