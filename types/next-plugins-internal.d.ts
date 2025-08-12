import type {
    PluginApiExtensionsOptions,
    PluginDependency,
    PluginManifest,
    PluginOptions,
} from './next/lib/plugins/types'

// Internal import
export function registerPlugin<O extends PluginApiExtensionsOptions>(
    manifest: PluginManifest,
    options: PluginOptions<O>,
    flags: number,
    iflags: number,
): PluginDependency
