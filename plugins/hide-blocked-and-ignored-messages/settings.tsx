import Page from '@revenge-mod/components/Page'
import TableRowAssetIcon from '@revenge-mod/components/TableRowAssetIcon'
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
                    icon={<TableRowAssetIcon name="DenyIcon" />}
                    label="Hide blocked messages"
                    value={blocked ?? true}
                    onValueChange={blocked => storage.set({ blocked })}
                />
                <TableSwitchRow
                    icon={<TableRowAssetIcon name="EyeSlashIcon" />}
                    label="Hide ignored messages"
                    value={ignored ?? true}
                    onValueChange={ignored => storage.set({ ignored })}
                />
                <TableSwitchRow
                    icon={<TableRowAssetIcon name="ArrowAngleLeftUpIcon" />}
                    label="Hide replies"
                    subLabel="Hide messages replying to blocked or ignored users."
                    value={replies ?? true}
                    onValueChange={replies => storage.set({ replies })}
                />
            </TableRowGroup>
        </Page>
    )
}
