import { getAssetIdByName } from '@revenge-mod/assets'
import Page from '@revenge-mod/components/Page'
import { Design } from '@revenge-mod/discord/design'
import { ScrollView } from 'react-native'
import type { PluginSettingsComponent } from '@revenge-mod/plugins/types'
import type { ComponentProps } from 'react'
import type { Settings } from '.'

const {
    Stack,
    TableRadioGroup,
    TableRadioRow,
    TableRow,
    TableRowGroup,
    TableSwitchRow,
    Text,
} = Design

type Props = ComponentProps<PluginSettingsComponent<{ storage: Settings }>>

export function SettingsComponent({ api }: Props) {
    return (
        <Page>
            <ScrollView>
                <Stack spacing={24}>
                    <Text
                        color="text-danger"
                        variant="text-md/semibold"
                        style={{ textAlign: 'center' }}
                    >
                        ❗ Changes are only applied when you start typing again.
                    </Text>
                    <HideActionButtonsSetting api={api} />
                    <ActionButtonsCollapseBehaviorSetting api={api} />
                    <SendButtonCollapseBehaviorSetting api={api} />
                </Stack>
            </ScrollView>
        </Page>
    )
}

function HideActionButtonsSetting({ api }: Props) {
    return (
        <TableRowGroup title="Hide Action Buttons">
            {(
                [
                    ['Apps & Commands', 'GameControllerIcon', 'app'],
                    ['Gift', 'ic_gift', 'gift'],
                    ['New Thread', 'ThreadPlusIcon', 'thread'],
                    ['Voice Message', 'MicrophoneIcon', 'voice'],
                ] as Array<
                    [name: string, icon: string, key: keyof Settings['hide']]
                >
            ).map(([label, icon, key]) => {
                const setting = api.storage.use(x => x.hide && key in x.hide)!

                return (
                    <TableSwitchRow
                        key={key}
                        icon={
                            <TableRow.Icon source={getAssetIdByName(icon)!} />
                        }
                        label={`Hide ${label}`}
                        value={setting.hide[key]}
                        onValueChange={(v: boolean) => {
                            api.storage.set({
                                hide: {
                                    [key]: v,
                                },
                            })
                        }}
                    />
                )
            })}
        </TableRowGroup>
    )
}

function ActionButtonsCollapseBehaviorSetting({ api }: Props) {
    const {
        collapse: { actions: setting },
    } = api.storage.use(x => x.collapse && 'actions' in x.collapse)!

    return (
        <TableRadioGroup
            title="Action Buttons Collapse Behavior"
            defaultValue={setting}
            onChange={v => {
                api.storage.set({
                    collapse: {
                        actions: v,
                    },
                })
            }}
        >
            <TableRadioRow label="Never collapse" value={false} />
            <TableRadioRow
                label="Collapse while typing"
                subLabel="Collapse action buttons when you start typing."
                value={true}
            />
        </TableRadioGroup>
    )
}

function SendButtonCollapseBehaviorSetting({ api }: Props) {
    const {
        collapse: { send: setting },
    } = api.storage.use(x => x.collapse && 'send' in x.collapse)!

    return (
        <TableRadioGroup
            title="Send Button Collapse Behavior"
            defaultValue={setting}
            onChange={v => {
                api.storage.set({
                    collapse: {
                        send: v,
                    },
                })
            }}
        >
            <TableRadioRow label="Never collapse" value={false} />
            <TableRadioRow
                label="Collapse when no content"
                subLabel="Collapse the Send button when you are not typing or attaching something."
                value={true}
            />
        </TableRadioGroup>
    )
}
