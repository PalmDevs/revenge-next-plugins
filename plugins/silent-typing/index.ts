import { onFluxEventDispatched } from '@revenge-mod/discord/flux'
import { noop } from '@revenge-mod/utils/callback'

export default plugin({
	start({ cleanup }) {
		cleanup(onFluxEventDispatched('TYPING_START_LOCAL', noop))
	},
})
