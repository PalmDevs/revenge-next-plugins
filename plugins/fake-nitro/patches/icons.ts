import type { FakeNitroPluginContext } from '..'

export default function appIcons(api: FakeNitroPluginContext) {
    const {
        cleanup,
        unscoped: {
            modules: {
                finders: {
                    getModules,
                    filters: { withProps },
                },
            },
        },
    } = api

    cleanup(
        // modules/app_icons/AppIconTypes.tsx
        getModules(
            withProps<AppIconTypes>('MasterAppIconIds'),
            AppIconTypes => {
                const { FreemiumAppIconIds, MasterAppIconIds } = AppIconTypes

                AppIconTypes.FreemiumAppIconIds = MasterAppIconIds

                cleanup(() => {
                    AppIconTypes.FreemiumAppIconIds = FreemiumAppIconIds
                })
            },
        ),
        // modules/app_icons/native/AppIconUtils.tsx
        getModules(withProps<AppIconUtils>('getIcons'), AppIconUtils => {
            patchAppIconUtils(AppIconUtils, api)
        }),
    )
}

async function patchAppIconUtils(
    AppIconUtils: AppIconUtils,
    {
        cleanup,
        unscoped: {
            patcher: { after, instead },
        },
    }: FakeNitroPluginContext,
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
