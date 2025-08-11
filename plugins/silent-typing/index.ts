import { onFluxEventDispatched } from '@revenge-mod/discord/flux'
import { registerPlugin } from '@revenge-mod/plugins/_'
import { PluginFlags } from '@revenge-mod/plugins/constants'
import { noop } from '@revenge-mod/utils/callback'

registerPlugin(
    {
        id: 'palmdevs.silent-typing',
        name: 'Silent Typing',
        description: 'Disables the typing indicator when you type.',
        author: 'Palm',
        icon: 'KeyboardIcon',
    },
    {
        start({ cleanup }) {
            cleanup(onFluxEventDispatched('TYPING_START', noop))
        },
    },
    PluginFlags.Enabled,
    0,
)
