import {
	onSettingsModulesLoaded,
	refreshSettings,
} from '@revenge-mod/discord/modules/settings'
import * as dt from './devtools'
import * as rdt from './react-devtools'
import type { PluginApi } from '@revenge-mod/plugins/types'

interface Storage {
	devTools: DevToolsSettings & { alias?: string }
	reactDevTools: DevToolsSettings
}

interface DevToolsSettings {
	address: string
	autoConnect: boolean
}

const defaultStorage: Storage = {
	devTools: {
		address: 'localhost:7864',
		autoConnect: false,
	},
	reactDevTools: {
		address: 'localhost:8097',
		autoConnect: false,
	},
}

// Expose to EvalJSSetting
export let api: PluginApi<{ jsonStorage: Storage }>

export default plugin<{ jsonStorage: Storage }>({
	jsonStorage: {
		load: true,
		default: defaultStorage,
	},
	async init(api_: PluginApi<{ jsonStorage: Storage }>) {
		api = api_

		const settings = await api.jsonStorage.get()

		dt.DTContext.addr = settings.devTools.address
		dt.DTContext.alias = settings.devTools.alias ?? ''
		rdt.RDTContext.addr = settings.reactDevTools.address

		if (settings.devTools.autoConnect) dt.connect()
		if (settings.reactDevTools.autoConnect) rdt.connect()
	},
	start() {
		const settings = require('./settings')
		onSettingsModulesLoaded(settings.register)

		if (api.plugin.startedLate) {
			refreshSettings()
		}
	},
	stop({ cleanup }: PluginApi<{ jsonStorage: Storage }>) {
		cleanup(refreshSettings)
	},
})
