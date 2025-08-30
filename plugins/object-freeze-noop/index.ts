import { registerPlugin } from '@revenge-mod/plugins/_'
import { PluginFlags } from '@revenge-mod/plugins/constants'

const pluginObjectFreezeNoop = registerPlugin(
    {
        id: 'palmdevs.object-freeze-noop',
        name: 'Object.freeze() No Operation',
        description: 'Replaces Object.freeze() with a no-op.',
        author: 'Palm',
        icon: 'PaperIcon',
    },
    {
        preInit({ cleanup, unscoped }) {
            const objectFreeze = Object.freeze
            unscoped.objectFreeze = objectFreeze

            Object.freeze = (obj: object) => obj

            cleanup(() => {
                Object.freeze = objectFreeze
            })
        },
    },
    PluginFlags.Enabled,
    0,
)

export default pluginObjectFreezeNoop

declare module '@revenge-mod/plugins/types' {
    export interface UnscopedPreInitPluginApi {
        objectFreeze: (typeof Object)['freeze']
    }
}
