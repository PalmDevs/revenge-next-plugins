import { getModules } from '@revenge-mod/modules/finders'
import { withProps } from '@revenge-mod/modules/finders/filters'
import { instead } from '@revenge-mod/patcher'
import { registerPlugin } from '@revenge-mod/plugins/_'
import { PluginFlags } from '@revenge-mod/plugins/constants'
import { getErrorStack } from '@revenge-mod/utils/error'
import fakeifyExpressions from './patches/expressions/fakeify'
import realifyExpressions from './patches/expressions/realify'
import appIcons from './patches/icons'
import themes from './patches/themes'
import { SettingsComponent } from './settings'
import type {
    PluginApi,
    PluginSettingsComponent,
} from '@revenge-mod/plugins/types'
import type { ComponentProps } from 'react'

interface ApiOptions {
    storage: {
        expressions: {
            emojis: {
                transform: boolean
                size: number
            }
            stickers: {
                transform: boolean
                size: number
            }
            checkPermission: boolean
            hyperlink: 'invisible' | 'name' | false
        }
        themes: {
            preset: number | false
        }
    }
}

export type FakeNitroSettingsComponentProps = ComponentProps<
    PluginSettingsComponent<ApiOptions>
>

export type FakeNitroPluginContext = PluginApi<ApiOptions>

export let ProductCatalog: ProductCatalog
export let canActuallyUse: OmitThisParameter<ProductCatalog['canUserUse']>

registerPlugin<ApiOptions>(
    {
        id: 'palmdevs.fake-nitro',
        name: 'Fake Nitro',
        description: 'Use Nitro features without Nitro.',
        author: 'Palm, nexpid, aeongdesu, Dziurwa',
        icon: 'NitroWheelIcon',
    },
    {
        start(api) {
            const { cleanup } = api

            cleanup(
                // modules/premium/ProductCatalog.tsx
                getModules(withProps<ProductCatalog>('canUserUse'), Catalog => {
                    ProductCatalog = Catalog
                    canActuallyUse = Catalog.canUserUse.bind(Catalog)

                    cleanup(
                        instead(Catalog, 'canUserUse', function (args, orig) {
                            switch (args[0]) {
                                case this.CLIENT_THEMES:
                                case this.STICKERS_EVERYWHERE:
                                case this.APP_ICONS:
                                // case this.EMOJIS_EVERYWHERE:
                                case this.ANIMATED_EMOJIS:
                                    return true
                            }

                            return Reflect.apply(orig, this, args)
                        }),
                    )
                }),
            )

            for (const patches of [
                appIcons,
                themes,
                fakeifyExpressions,
                realifyExpressions,
            ])
                try {
                    patches(api)
                } catch (e) {
                    api.logger.error(
                        `Failed to apply patches for ${patches.name}: ${getErrorStack(e)}`,
                    )
                }
        },
        storage: {
            load: true,
            default: {
                expressions: {
                    emojis: {
                        transform: true,
                        size: 48,
                    },
                    stickers: {
                        transform: true,
                        size: 160,
                    },
                    checkPermission: true,
                    hyperlink: false,
                },
                themes: {
                    preset: false,
                },
            },
        },
        SettingsComponent,
    },
    PluginFlags.Enabled,
    0,
)

interface ProductCatalog {
    canUserUse(this: ProductCatalog, product: any): boolean
    CLIENT_THEMES: any
    APP_ICONS: any
    ANIMATED_EMOJIS: any
    EMOJIS_EVERYWHERE: any
    STICKERS_EVERYWHERE: any
}
