import { DiscordModules } from "./index-BpPUM9Sc.js";
import * as react2 from "react";

//#region lib/components/src/TableRowAssetIcon.d.ts
declare function TableRowAssetIcon(props: TableRowAssetIconProps): react2.JSX.Element;
type TableRowAssetIconProps = Omit<DiscordModules.Components.TableRowIconProps, 'source'> & ({
  name: string;
  id?: never;
} | {
  name?: never;
  id: number;
});
//#endregion
export { TableRowAssetIcon, TableRowAssetIconProps };