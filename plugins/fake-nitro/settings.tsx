import { TableRowAssetIcon } from '@revenge-mod/components'
import Page from '@revenge-mod/components/Page'
import { Design } from '@revenge-mod/discord/design'
import { ScrollView } from 'react-native'
import { showSourcesAlert } from './components/SourcesAlert'
import type { FakeNitroSettingsComponentProps } from '.'

const {
    Slider,
    Stack,
    TableRadioGroup,
    TableRadioRow,
    TableRow,
    TableRowGroup,
    TableSwitchRow,
} = Design

const emojiSizeLadder = [32, 48, 64, 128, 160, 256, 512] as const
const stickerSizeLadder = [32, 64, 128, 160, 256, 512] as const

export function SettingsComponent({ api }: FakeNitroSettingsComponentProps) {
    return (
        <Page>
            <ScrollView>
                <Stack spacing={24}>
                    <EmojisSettings api={api} />
                    <StickersSettings api={api} />
                    <ExpressionsSettings api={api} />
                    <TableRowGroup>
                        <TableRow
                            label="Sources"
                            subLabel="Fake Nitro was made with help from several other projects."
                            onPress={showSourcesAlert}
                            arrow
                        />
                    </TableRowGroup>
                </Stack>
            </ScrollView>
        </Page>
    )
}

function EmojisSettings({ api }: FakeNitroSettingsComponentProps) {
    const settings = api.storage.use(x => x.expressions)!.expressions

    return (
        <TableRowGroup title="Emojis" hasIcons>
            <TableSwitchRow
                icon={<TableRowAssetIcon name="LinkIcon" />}
                label="Send custom emojis"
                subLabel="Transform unavailable emojis into links when sending messages."
                value={settings.emojis.size > 0}
                onValueChange={enabled =>
                    api.storage.set({
                        expressions: {
                            emojis: { size: enabled ? 48 : 0 },
                        },
                    })
                }
            />
            <TableSwitchRow
                icon={<TableRowAssetIcon name="ReactionIcon" />}
                label="Transform emoji links"
                subLabel="Display emoji links as actual emojis in chat."
                value={settings.emojis.transform}
                onValueChange={transform =>
                    api.storage.set({
                        expressions: {
                            emojis: { transform },
                        },
                    })
                }
            />
            {settings.emojis.size > 0 && (
                <TableRow
                    label="Emoji size"
                    trailing={
                        <TableRow.TrailingText
                            text={`${settings.emojis.size}px`}
                        />
                    }
                    subLabel={
                        <Slider
                            maximumValue={emojiSizeLadder.length - 1}
                            minimumValue={0}
                            onValueChange={index => {
                                const size = emojiSizeLadder[Math.round(index)]
                                if (size !== undefined) {
                                    api.storage.set({
                                        expressions: {
                                            emojis: { size },
                                        },
                                    })
                                }
                            }}
                            startIcon={
                                <TableRow.TrailingText
                                    text={emojiSizeLadder[0].toString()}
                                />
                            }
                            endIcon={
                                <TableRow.TrailingText
                                    text={emojiSizeLadder.at(-1)!.toString()}
                                />
                            }
                            step={1}
                            value={
                                emojiSizeLadder.indexOf(
                                    settings.emojis
                                        .size as (typeof emojiSizeLadder)[number],
                                ) ?? 1
                            }
                        />
                    }
                />
            )}
        </TableRowGroup>
    )
}

function StickersSettings({ api }: FakeNitroSettingsComponentProps) {
    const settings = api.storage.use(x => x.expressions)!.expressions

    return (
        <TableRowGroup title="Stickers" hasIcons>
            <TableSwitchRow
                icon={<TableRowAssetIcon name="LinkIcon" />}
                label="Send custom stickers"
                subLabel="Transform unavailable stickers into links when sending messages."
                value={settings.stickers.size > 0}
                onValueChange={enabled =>
                    api.storage.set({
                        expressions: {
                            stickers: { size: enabled ? 160 : 0 },
                        },
                    })
                }
            />
            <TableSwitchRow
                icon={<TableRowAssetIcon name="StickerIcon" />}
                label="Transform sticker links"
                subLabel="Display sticker links as actual stickers in chat."
                value={settings.stickers.transform}
                onValueChange={transform =>
                    api.storage.set({
                        expressions: {
                            stickers: { transform },
                        },
                    })
                }
            />
            {settings.stickers.size > 0 && (
                <TableRow
                    label="Sticker size"
                    trailing={
                        <TableRow.TrailingText
                            text={`${settings.stickers.size}px`}
                        />
                    }
                    subLabel={
                        <Slider
                            maximumValue={stickerSizeLadder.length - 1}
                            minimumValue={0}
                            onValueChange={index => {
                                const size =
                                    stickerSizeLadder[Math.round(index)]
                                if (size !== undefined) {
                                    api.storage.set({
                                        expressions: {
                                            stickers: { size },
                                        },
                                    })
                                }
                            }}
                            startIcon={
                                <TableRow.TrailingText
                                    text={stickerSizeLadder[0].toString()}
                                />
                            }
                            endIcon={
                                <TableRow.TrailingText
                                    text={stickerSizeLadder.at(-1)!.toString()}
                                />
                            }
                            step={1}
                            value={
                                stickerSizeLadder.indexOf(
                                    settings.stickers
                                        .size as (typeof stickerSizeLadder)[number],
                                ) ?? 3
                            }
                        />
                    }
                />
            )}
        </TableRowGroup>
    )
}

function ExpressionsSettings({ api }: FakeNitroSettingsComponentProps) {
    const settings = api.storage.use(x => x.expressions)!.expressions

    return (
        <Stack spacing={8}>
            <TableRowGroup title="Expressions">
                <TableSwitchRow
                    icon={<TableRowAssetIcon name="ForumWarningIcon" />}
                    label="Check embed permissions"
                    subLabel="Check if you have permission to send embeds before transforming expressions."
                    value={settings.checkPermission}
                    onValueChange={checkPermission =>
                        api.storage.set({
                            expressions: { checkPermission },
                        })
                    }
                />
            </TableRowGroup>
            <TableRadioGroup
                defaultValue={settings.hyperlink}
                onChange={v => {
                    api.storage.set({
                        expressions: { hyperlink: v },
                    })
                }}
            >
                <TableRadioRow
                    label="No hyperlink"
                    subLabel="Use normal URLs."
                    value={false}
                />
                <TableRadioRow
                    label="Hyperlink with name"
                    subLabel="Hyperlink expressions with their names."
                    value="name"
                />
                <TableRadioRow
                    label="Invisible hyperlink"
                    subLabel="Hyperlink expressions with invisible characters."
                    value="invisible"
                />
            </TableRadioGroup>
        </Stack>
    )
}
