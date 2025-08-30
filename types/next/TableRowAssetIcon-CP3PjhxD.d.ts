import { DiscordModules } from "./index-DE2r-wBx.js";
import * as react3 from "react";

//#region lib/components/src/TableRowAssetIcon.d.ts
declare function TableRowAssetIcon(props: TableRowAssetIconProps): react3.JSX.Element;
type TableRowAssetIconProps = Omit<DiscordModules.Components.TableRowIconProps, 'source'> & ({
  name: string;
  id?: never;
} | {
  name?: never;
  id: number;
});
//#endregion
export { TableRowAssetIcon, TableRowAssetIconProps };