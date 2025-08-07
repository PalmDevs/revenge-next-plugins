import '../../react-navigation-CQybBCfP.js'
import { DiscordModules } from '../../index-avp1GUJG.js'
import '../../types-cJK__Kwg.js'
import * as react0 from 'react'

//#region lib/components/src/FormSwitch.d.ts
/**
 * A switch component that is styled to match Discord's configuration
 */
declare function FormSwitch(
	props: DiscordModules.Components.FormSwitchProps,
): react0.JSX.Element
//#endregion
//#region lib/components/src/Page.d.ts
declare function Page(
	props: DiscordModules.Components.StackProps,
): react0.JSX.Element
//#endregion
//#region lib/components/src/SearchInput.d.ts
declare function SearchInput(
	props: DiscordModules.Components.TextInputProps,
): react0.JSX.Element
//#endregion
//#region lib/components/src/TableRowAssetIcon.d.ts
declare function TableRowAssetIcon(
	props: TableRowAssetIconProps,
): react0.JSX.Element
type TableRowAssetIconProps = Omit<
	DiscordModules.Components.TableRowIconProps,
	'source'
> &
	(
		| {
				name: string
				id?: never
		  }
		| {
				name?: never
				id: number
		  }
	)
//#endregion
//#region lib/components/src/types.d.ts
interface PluginApiComponents {
	FormSwitch: typeof FormSwitch
	Page: typeof Page
	SearchInput: typeof SearchInput
	TableRowAssetIcon: typeof TableRowAssetIcon
}
declare module '@revenge-mod/plugins/types' {
	interface UnscopedInitPluginApi {
		components: PluginApiComponents
	}
}
//#endregion
export { PluginApiComponents }
//# sourceMappingURL=types.d.ts.map
