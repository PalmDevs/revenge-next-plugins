import Page from '@revenge-mod/components/Page'
import TableRowAssetIcon from '@revenge-mod/components/TableRowAssetIcon'
import { Design } from '@revenge-mod/discord/design'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ChannelListAppearance, DataSource } from './shared'
import type { PluginSettingsComponent } from '@revenge-mod/plugins/types'
import type { ComponentProps } from 'react'
import type { Settings } from './shared'

const {
	Slider,
	Stack,
	TableRadioGroup,
	TableRadioRow,
	TableRow,
	TableRowGroup,
	TableSwitchRow,
	Text,
} = Design

type Props = ComponentProps<PluginSettingsComponent<{ jsonStorage: Settings }>>
type Storage = Props['api']['jsonStorage']

const MAX_AVATARS = 10

const styles = StyleSheet.create({
	slider: {
		paddingBlockEnd: 24,
	},
})

export default function SettingsComponent({
	api: { jsonStorage: storage },
}: Props) {
	return (
		<Page>
			<ScrollView>
				<Stack spacing={24}>
					<AvatarSourceSetting storage={storage} />
					<NameSourceSetting storage={storage} />
					<ChannelListAppearanceSettings storage={storage} />
				</Stack>
			</ScrollView>
		</Page>
	)
}

function AvatarSourceSetting({ storage }: { storage: Storage }) {
	const { avatar } = storage.use(x => 'avatar' in x)!

	return (
		<TableRadioGroup<DataSource | false>
			title="Avatars"
			defaultValue={avatar}
			onChange={avatar => storage.set({ avatar })}
		>
			<TableRadioRow label="Don't show avatars" value={false} />
			<TableRadioRow label="Show avatars" value={DataSource.Global} />
			<TableRadioRow label="Prefer server avatars" value={DataSource.Guild} />
		</TableRadioGroup>
	)
}

function NameSourceSetting({ storage }: { storage: Storage }) {
	const { name } = storage.use(x => 'name' in x)!

	return (
		<TableRadioGroup<DataSource | false>
			title="Names"
			defaultValue={name}
			onChange={name => storage.set({ name })}
		>
			<TableRadioRow label="Don't show names" value={false} />
			<TableRadioRow label="Prefer usernames" value={DataSource.Username} />
			<TableRadioRow label="Prefer display names" value={DataSource.Global} />
			<TableRadioRow label="Prefer nicknames" value={DataSource.Guild} />
		</TableRadioGroup>
	)
}

function ChannelListAppearanceSettings({ storage }: { storage: Storage }) {
	const { appearance, maxAvatars } = storage.use(x => 'channel' in x)!.channel

	const has = (flag: number) => (appearance & flag) !== 0
	const toggle = (flag: number, enabled: boolean) =>
		storage.set({
			channel: {
				appearance: enabled ? appearance | flag : appearance & ~flag,
			},
		})

	return (
		<TableRowGroup
			title="Channel List"
			description="Show typing indicators in the channel list."
			hasIcons
		>
			<TableSwitchRow
				icon={<TableRowAssetIcon name="MoreHorizontalIcon" />}
				label="Show ellipsis"
				subLabel="Display the three dots typing indicator."
				value={has(ChannelListAppearance.Ellipsis)}
				onValueChange={enabled =>
					toggle(ChannelListAppearance.Ellipsis, enabled)
				}
			/>
			<TableSwitchRow
				icon={<TableRowAssetIcon name="UserCircleIcon" />}
				label="Show avatars"
				subLabel="Display the avatars of the users typing."
				value={has(ChannelListAppearance.Avatars)}
				onValueChange={enabled =>
					toggle(ChannelListAppearance.Avatars, enabled)
				}
			/>
			{has(ChannelListAppearance.Avatars) && (
				<TableRow
					icon={<TableRowAssetIcon name="GroupIcon" />}
					label="Maximum avatars"
					trailing={
						<Text variant="text-sm/medium" color="text-muted">
							{maxAvatars}
						</Text>
					}
					subLabel={
						<View style={styles.slider}>
							<Slider
								step={1}
								minimumValue={1}
								maximumValue={MAX_AVATARS}
								value={maxAvatars}
								onValueChange={maxAvatars =>
									storage.set({ channel: { maxAvatars } })
								}
							/>
						</View>
					}
				/>
			)}
			<TableSwitchRow
				icon={<TableRowAssetIcon name="BellSlashIcon" />}
				label="Include muted channels"
				subLabel="Show typing indicators for muted channels."
				value={has(ChannelListAppearance.IncludeMuted)}
				onValueChange={enabled =>
					toggle(ChannelListAppearance.IncludeMuted, enabled)
				}
			/>
		</TableRowGroup>
	)
}
