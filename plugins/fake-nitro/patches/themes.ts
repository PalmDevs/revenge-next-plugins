import { canActuallyUse, ProductCatalog } from '..'
import type { FakeNitroPluginContext } from '..'

export default function themes({
    cleanup,
    storage,
    unscoped: {
        discord: {
            common: {
                flux: { Dispatcher },
            },
            flux: { onFluxEventDispatched },
        },
        modules: {
            finders: {
                getModules,
                filters: { withProps },
            },
        },
        patcher: { before },
    },
}: FakeNitroPluginContext) {
    cleanup(
        // modules/client_themes/ClientThemesBackgroundActionCreators.tsx
        getModules(
            withProps<{
                updateMobilePendingThemeIndex(index: number): void
                updateBackgroundGradientPreset(preset: number): void
            }>('updateBackgroundGradientPreset'),
            ClientThemesBackgroundActionCreators => {
                cleanup(
                    before(
                        ClientThemesBackgroundActionCreators,
                        'updateMobilePendingThemeIndex',
                        args => {
                            if (isNonGradientThemeIndex(args[0]))
                                storage.set({ themes: { preset: false } })

                            return args
                        },
                    ),
                    before(
                        ClientThemesBackgroundActionCreators,
                        'updateBackgroundGradientPreset',
                        args => {
                            storage.set({ themes: { preset: args[0] } })
                            return args
                        },
                    ),
                )
            },
        ),
        onFluxEventDispatched<{
            bypass?: true
            changes: {
                appearance?: {
                    shouldSync?: boolean
                    settings: {
                        theme?: string
                        clientThemeSettings?: {
                            backgroundGradientPresetId?: number
                        }
                    }
                }
            }
        }>('SELECTIVELY_SYNCED_USER_SETTINGS_UPDATE', e => {
            const {
                changes: { appearance },
            } = e

            if (
                // If we are *maybe* trying to sync a Nitro theme, and we don't have Nitro,
                // attempt to turn sync off and set the theme
                !canActuallyUse(ProductCatalog.CLIENT_THEMES) &&
                appearance?.shouldSync !== false &&
                appearance?.settings.clientThemeSettings
                    ?.backgroundGradientPresetId !== undefined
            ) {
                // Fixes some weird race condition where a theme sync happens
                // when shouldSync is turned off after dispatching
                const originalPresetId =
                    appearance.settings.clientThemeSettings
                        .backgroundGradientPresetId

                setTimeout(() => {
                    Dispatcher.dispatch({
                        type: 'UPDATE_BACKGROUND_GRADIENT_PRESET',
                        presetId: originalPresetId,
                    })
                })

                appearance.shouldSync = false
                appearance.settings.clientThemeSettings.backgroundGradientPresetId =
                    undefined
            }

            return e
        }),
    )
}

function isNonGradientThemeIndex(index: number) {
    // [Light, Dark, Midnight, Auto, (...custom themes)]
    return index < 4
}
