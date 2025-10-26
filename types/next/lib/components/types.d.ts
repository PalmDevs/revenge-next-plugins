import "../../callback-DNr1bYVq.js";
import "../../error-DWG2BlZz.js";
import "../../types-DW6-O3QH.js";
import "../../promise-Du5Pcai3.js";
import "../../proxy-KNbRcH7H.js";
import "../../react-navigation-BsoHQk3U.js";
import "../../native-BXtyFZ8I.js";
import "../../index-C1hBnhca.js";
import "../../main_tabs_v2-DHNkP9c9.js";
import { t as FormSwitch } from "../../FormSwitch-C36wT_kL.js";
import { t as Page } from "../../Page--uxwNurX.js";
import { t as SearchInput } from "../../SearchInput-QSYxvY8D.js";
import { t as TableRowAssetIcon } from "../../TableRowAssetIcon-BZWt4xkM.js";

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