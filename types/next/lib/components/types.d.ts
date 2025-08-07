import "../../types-CbiwzsWW.js";
import "../../react-navigation-wYcO9zPQ.js";
import { DiscordModules } from "../../index-BWBPNZ8p.js";
import * as react1 from "react";

//#region lib/components/src/FormSwitch.d.ts
/**
 * A switch component that is styled to match Discord's configuration
 */
declare function FormSwitch(props: DiscordModules.Components.FormSwitchProps): react1.JSX.Element;
//#endregion
//#region lib/components/src/Page.d.ts
declare function Page(props: DiscordModules.Components.StackProps): react1.JSX.Element;
//#endregion
//#region lib/components/src/SearchInput.d.ts
declare function SearchInput(props: DiscordModules.Components.TextInputProps): react1.JSX.Element;
//#endregion
//#region lib/components/src/TableRowAssetIcon.d.ts
declare function TableRowAssetIcon(props: TableRowAssetIconProps): react1.JSX.Element;
type TableRowAssetIconProps = Omit<DiscordModules.Components.TableRowIconProps, 'source'> & ({
  name: string;
  id?: never;
} | {
  name?: never;
  id: number;
});
//#endregion
//#region lib/components/src/types.d.ts
interface PluginApiComponents {
  FormSwitch: typeof FormSwitch;
  Page: typeof Page;
  SearchInput: typeof SearchInput;
  TableRowAssetIcon: typeof TableRowAssetIcon;
}
declare module '@revenge-mod/plugins/types' {
  interface UnscopedInitPluginApi {
    components: PluginApiComponents;
  }
}
//#endregion
export { PluginApiComponents };