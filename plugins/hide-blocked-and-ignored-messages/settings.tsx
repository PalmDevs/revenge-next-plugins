import Page from '@revenge-mod/components/Page'
import { Design } from '@revenge-mod/discord/design'
import type { PluginSettingsComponent } from '@revenge-mod/plugins/types'
import type { ComponentProps } from 'react'
import type { Settings } from '.'

const { TableRowGroup, TableSwitchRow } = Design

type SettingComponentProps = ComponentProps<
	PluginSettingsComponent<{ storage: Settings }>
>

export default function SettingsComponent({
	api: { storage },
}: SettingComponentProps) {
	const { blocked, ignored, replies } = storage.use()!

	return (
		<Page>
			<TableRowGroup>
				<TableSwitchRow
					label="Hide blocked messages"
					value={blocked ?? true}
					onValueChange={blocked => storage.set({ blocked })}
				/>
				<TableSwitchRow
					label="Hide ignored messages"
					value={ignored ?? true}
					onValueChange={ignored => storage.set({ ignored })}
				/>
				<TableSwitchRow
					label="Hide replies"
					subLabel="Hide messages replying to blocked or ignored users."
					value={replies ?? true}
					onValueChange={replies => storage.set({ replies })}
				/>
			</TableRowGroup>
		</Page>
	)
}
