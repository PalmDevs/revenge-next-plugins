import { getModules } from '@revenge-mod/modules/finders'
import { withProps } from '@revenge-mod/modules/finders/filters'
import { after, instead } from '@revenge-mod/patcher'
import { registerPlugin } from '@revenge-mod/plugins/_'
import { PluginFlags } from '@revenge-mod/plugins/constants'
import pluginObjectFreezeNoop from '~plugins/preinit/object-freeze-noop'
import type { PluginCleanupApi } from '@revenge-mod/plugins/types'

registerPlugin(
    {
        id: 'palmdevs.nitro-app-icons',
        name: 'Nitro App Icons',
        description: 'Use Nitro app icons without Nitro.',
        author: 'Palm, Dziurwa',
        icon: 'ClydeIcon',
        dependencies: [pluginObjectFreezeNoop],
    },
    {
        start({ cleanup }) {
            cleanup(
                // modules/app_icons/AppIconTypes.tsx
                getModules(
                    withProps<AppIconTypes>('MasterAppIconIds'),
                    AppIconTypes => {
                        const { FreemiumAppIconIds, MasterAppIconIds } =
                            AppIconTypes

                        AppIconTypes.FreemiumAppIconIds = MasterAppIconIds

                        cleanup(() => {
                            AppIconTypes.FreemiumAppIconIds = FreemiumAppIconIds
                        })
                    },
                ),
                // modules/app_icons/native/AppIconUtils.tsx
                getModules(
                    withProps<AppIconUtils>('getIcons'),
                    AppIconUtils => {
                        patchAppIconUtils(AppIconUtils, cleanup)
                    },
                ),
            )
        },
    },
    PluginFlags.Enabled,
    0,
)

interface AppIconTypes {
    FreemiumAppIconIds: Record<string, string>
    MasterAppIconIds: Record<string, string>
}

interface BasicAppIcon {
    isPremium: boolean
}

interface AppIconUtils {
    getIcons(): BasicAppIcon[]
    getOfficialAlternateIcons(): BasicAppIcon[]
    getLimitedAlternateIcons(): BasicAppIcon[]
    getIconById(id: string): BasicAppIcon
}

async function patchAppIconUtils(
    AppIconUtils: AppIconUtils,
    cleanup: PluginCleanupApi,
) {
    const setFlags = (icons: BasicAppIcon[]) => {
        for (const icon of icons) icon.isPremium = false
    }

    cleanup(
        instead(AppIconUtils, 'getIcons', icons => {
            setFlags(icons)
            return icons
        }),
        after(AppIconUtils, 'getOfficialAlternateIcons', icons => {
            setFlags(icons)
            return icons
        }),
        after(AppIconUtils, 'getLimitedAlternateIcons', icons => {
            setFlags(icons)
            return icons
        }),
        after(AppIconUtils, 'getIconById', ret => {
            ret.isPremium = false
            return ret
        }),
    )
}
