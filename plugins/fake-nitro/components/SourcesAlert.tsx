import TableRowAssetIcon from '@revenge-mod/components/TableRowAssetIcon'
import { AlertActionCreators } from '@revenge-mod/discord/actions'
import { Design } from '@revenge-mod/discord/design'
import { Linking } from 'react-native'
import type { DiscordModules } from '@revenge-mod/discord/types'

const { AlertActionButton, AlertModal, TableRow, TableRowGroup } = Design

function SourcesAlert() {
    return (
        <AlertModal
            title="Sources"
            content="Fake Nitro was made with help from several other projects."
            extraContent={
                <TableRowGroup>
                    <LinkTableRow
                        label="Expressions"
                        subLabel="Ported and simplified from Vengeance's FreeNitro plugin."
                        url="https://github.com/nexpid/Vengeance/tree/main/src/plugins/vengeance/freenitro"
                        icon={<TableRowAssetIcon name="ReactionIcon" />}
                    />
                    <LinkTableRow
                        label="App icons"
                        subLabel="Ported from Dziurwa's Freecons plugin for Vendetta."
                        url="https://github.com/Dziurwa14/vendetta-plugins/tree/master/plugins/Freecons"
                        icon={<TableRowAssetIcon name="logo" />}
                    />
                    <LinkTableRow
                        label="Themes"
                        subLabel="Ported from aeongdesu's ClientThemes plugin for Vendetta."
                        url="https://github.com/aeongdesu/vdplugins/tree/main/plugins/ClientThemes"
                        icon={<TableRowAssetIcon name="PaintPaletteIcon" />}
                    />
                    <LinkTableRow
                        label="Extra reference"
                        subLabel="Used Vencord's FakeNitro implementation as a reference."
                        url="https://github.com/Vendicated/Vencord/blob/main/src/plugins/fakeNitro/index.tsx"
                        icon={<TableRowAssetIcon name="PaperIcon" />}
                    />
                </TableRowGroup>
            }
            actions={<AlertActionButton text="Got it" />}
        />
    )
}

export function showSourcesAlert() {
    AlertActionCreators.openAlert(
        'palmdevs.fake-nitro.sources',
        <SourcesAlert />,
    )
}

function LinkTableRow(
    props: DiscordModules.Components.TableRowProps & {
        url: string
    },
) {
    return (
        <TableRow
            {...props}
            onPress={() => {
                Linking.openURL(props.url)
            }}
        />
    )
}
