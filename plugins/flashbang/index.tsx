import { ToastActionCreators } from '@revenge-mod/discord/actions'
import { Constants, ConstantsModuleId } from '@revenge-mod/discord/common'
import { lookupModule } from '@revenge-mod/modules/finders'
import {
	byDependencies,
	byProps,
	preferExports,
} from '@revenge-mod/modules/finders/filters'
import { registerPlugin } from '@revenge-mod/plugins/_'
import { PluginFlags } from '@revenge-mod/plugins/constants'
import { onRunApplicationFinished } from '@revenge-mod/react/native'
import { unproxify } from '@revenge-mod/utils/proxy'
import { useRef } from 'react'
import { Animated, Easing, useWindowDimensions, View } from 'react-native'
import FlashbangImage from './flashbang.webp'
import type { StyleProp, ViewStyle } from 'react-native'

const SoundManager = nativeModuleProxy.DCDSoundManager as {
	prepare(
		fileNameOrUrl: string,
		usage: 'media' | 'voice' | 'ring_tone' | 'notification',
		key: number,
		callback: (
			_: null,
			data: { duration: number; numberOfChannels: -1 },
		) => void,
	): void
	release(key: number): void
	setCurrentTime(key: number, time: number): void
	setNumberOfLoops(key: number, numberOfLoops: number): void
	setPan(key: number, pan: number): void
	setVolume(key: number, volume: number): void
	stop(key: number): void
	play(key: number): void
	pause(key: number): void
}

const SOUND_URL =
	'https://cdn.discordapp.com/soundboard-sounds/1399068062023684127'
let SOUND = 0
let BANGING = false

registerPlugin(
	{
		id: 'palmdevs.flashbang',
		name: 'Flashbang',
		description: '🪃💥⬜',
		author: 'Palm',
		icon: 'EyeSlashIcon',
	},
	{
		start({ plugin }) {
			const runPlugin = () => {
				setTimeout(
					flashbang.bind(undefined, plugin.disable),
					Math.random() * 5000 + 500,
				)
			}

			if (plugin.flags & PluginFlags.EnabledLate) runPlugin()
			else onRunApplicationFinished(runPlugin)
		},
	},
	0,
	0,
)

function flashbang(onFlashed: () => void) {
	const KEY = SOUND++
	SoundManager.prepare(SOUND_URL, 'media', KEY, (_, data) => {
		SoundManager.play(KEY)
		if (!BANGING) flash()

		setTimeout(() => {
			bang()
			const id = setInterval(bang, 1)

			setTimeout(() => {
				if (!BANGING) ToastActionCreators.close()
				SoundManager.release(KEY)
			}, data.duration * 0.83)

			setTimeout(() => {
				BANGING = false
				clearInterval(id)
				forceLightTheme()
				onFlashed()
			}, data.duration * 0.35)
		}, data.duration * 0.17)
	})
}

function forceLightTheme() {
	unproxify(Constants)
	
	// actions/UserSettingsActionCreators.tsx
	const [UserSettingsActionCreators] = lookupModule(
		preferExports(
			byProps('updateTheme'),
			byDependencies([
				undefined,
				undefined,
				undefined,
				ConstantsModuleId,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				2,
			]),
			true,
		),
		{ uninitialized: true },
	)

	const [ThemeActionCreators] = lookupModule(
		byProps<{
			setUseSystemTheme(v: boolean): void
			setThemeOverride(v: unknown): void
		}>('setThemeOverride'),
	)

	ThemeActionCreators!.setUseSystemTheme(false)
	UserSettingsActionCreators!.updateTheme('light')
}

function Bang() {
	return (
		<View
			style={{
				width: 10000,
				height: 10000,
				backgroundColor: 'white',
				transformOrigin: 'center',
				zIndex: 1000,
				transform: [
					{
						translateX: -5000,
					},
					{
						translateY: -1000,
					},
				],
			}}
		/>
	)
}

function Flash() {
	const { width, height } = useWindowDimensions()

	const transformFactor = Math.random()
	const transformXFactor = Math.random()
	const clampedTransformFactor = Math.min(Math.max(transformFactor, 0.3), 0.6)
	const sign = transformFactor <= 0.5 ? -1 : 1
	const signX = transformXFactor <= 0.5 ? -1 : 1
	const pan = useRef(
		new Animated.ValueXY({
			x: -96 * transformFactor * sign + transformXFactor * signX * width * 0.75,
			y: -96,
		}),
	).current
	const spin = useRef(new Animated.Value(0)).current

	const spinAnimationFactor = Math.random()

	Animated.timing(spin, {
		duration: 1000,
		easing:
			spinAnimationFactor <= 0.25
				? Easing.ease
				: spinAnimationFactor <= 0.5
					? Easing.bezier(0.8, 0, 0.4, 1)
					: spinAnimationFactor <= 0.75
						? Easing.bezier(0.4, 0, 0.2, 1)
						: Easing.linear,
		toValue: 1,
		useNativeDriver: true,
		delay: 150,
	}).start()

	Animated.timing(pan, {
		duration: 800,
		easing: Easing.bezier(0.8, 0, 0.4, 1),
		toValue: {
			x:
				Math.abs(
					width * clampedTransformFactor * -sign +
						transformXFactor * -signX * width * 0.75,
				) % width,
			y: height * clampedTransformFactor,
		},
		useNativeDriver: true,
		delay: 200,
	}).start()

	return (
		<Animated.Image
			style={{
				width: 24,
				height: 60,
				transform: [
					...pan.getTranslateTransform(),
					{
						scale: spin.interpolate({
							inputRange: [0, 1],
							outputRange: [0.75, 1],
						}),
					},
					{
						rotateZ: spin.interpolate({
							inputRange: [0, 1],
							outputRange: [-8, 8 * spinAnimationFactor],
						}),
					},
				],
			}}
			source={{ uri: FlashbangImage }}
		/>
	)
}

function flash() {
	ToastActionCreators.open({
		key: `flash-${SOUND}`,
		containerStyle: ContainerInvisible,
		IconComponent: Flash,
	})
}

function bang() {
	BANGING = true
	ToastActionCreators.open({
		key: 'bang',
		containerStyle: ContainerInvisible,
		IconComponent: Bang,
	})
}

const ContainerInvisible = {
	width: 0,
	height: 0,
	padding: 0,
	borderWidth: 0,
	outlineWidth: 0,
	overflow: 'visible',
	opacity: 1,
	shadowOpacity: 0,
} satisfies StyleProp<ViewStyle>
