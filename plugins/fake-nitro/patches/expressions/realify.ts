import type { FakeNitroPluginContext } from '../..'

export default function realifyExpressions({
    cleanup,
    unscoped: {
        modules: {
            finders: {
                getModules,
                filters: { withProps },
            },
        },
        patcher: { instead },
    },
}: FakeNitroPluginContext) {}
