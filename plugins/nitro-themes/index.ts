import { getModules } from '@revenge-mod/modules/finders'
import { withProps } from '@revenge-mod/modules/finders/filters'
import { before, instead } from '@revenge-mod/patcher'
import { registerPlugin } from '@revenge-mod/plugins/_'
import { PluginFlags } from '@revenge-mod/plugins/constants'
import pluginObjectFreezeNoop from '~plugins/preinit/object-freeze-noop'

registerPlugin<{
    storage: {
        theme: number | false
    }
}>(
    {
        id: 'palmdevs.nitro-themes',
        name: 'Nitro Themes',
        description: 'Use Nitro themes without Nitro.',
        author: 'Palm, aeongdesu',
        icon: 'PaintPaletteIcon',
        dependencies: [pluginObjectFreezeNoop],
    },
    {
        start({ cleanup, storage }) {
            cleanup(
                // utils/PremiumUtils.tsx
                getModules(withProps('canUseClientThemes'), PremiumUtils => {
                    cleanup(
                        instead(PremiumUtils, 'canUseClientThemes', () => true),
                    )
                }),
                // actions/UserSettingsActionCreators.tsx
                getModules(
                    withProps('setShouldSyncAppearanceSettings'),
                    UserSettingsActionCreators => {
                        cleanup(
                            instead(
                                UserSettingsActionCreators,
                                'setShouldSyncAppearanceSettings',
                                function (args, orig) {
                                    if (storage.cache!.theme) args[0] = false
                                    return Reflect.apply(orig, this, args)
                                },
                            ),
                        )
                        // modules/client_themes/ClientThemesBackgroundActionCreators.tsx
                        const unsub = getModules(
                            withProps<{
                                updateMobilePendingThemeIndex(
                                    index: number,
                                ): void
                                updateBackgroundGradientPreset(
                                    preset: number,
                                ): void
                            }>('updateBackgroundGradientPreset'),
                            ClientThemesBackgroundActionCreators => {
                                cleanup(
                                    before(
                                        ClientThemesBackgroundActionCreators,
                                        'updateMobilePendingThemeIndex',
                                        args => {
                                            if (
                                                isNonGradientThemeIndex(args[0])
                                            )
                                                storage.set({ theme: false })
                                            return args
                                        },
                                    ),
                                    before(
                                        ClientThemesBackgroundActionCreators,
                                        'updateBackgroundGradientPreset',
                                        args => {
                                            UserSettingsActionCreators.setShouldSyncAppearanceSettings(
                                                false,
                                            )

                                            storage.set({ theme: args[0] })
                                            return args
                                        },
                                    ),
                                )
                            },
                        )

                        cleanup(unsub)
                    },
                ),
            )
        },
        storage: {
            load: true,
            default: {
                theme: false,
            },
        },
    },
    PluginFlags.Enabled,
    0,
)

function isNonGradientThemeIndex(index: number) {
    // [Light, Dark, Midnight, Auto, (...custom themes)]
    return index < 4
}
