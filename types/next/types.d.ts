import { Metro } from './types-cJK__Kwg.js'
import {
	PluginApiExtensionsOptions,
	PluginManifest,
	PluginOptions,
} from './types-qGVpvpvx.js'
import { ImageProps, ScrollViewProps, TextProps, ViewProps } from 'react-native'

//#region lib/types/types.d.ts

/// REACT NATIVE COMPONENTS
declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			// TODO(PalmDevs): more intrinsic elements?
			RCTView: ViewProps
			RCTImage: ImageProps
			RCTScrollView: ScrollViewProps
			RCTText: TextProps
		}
	}
}

/// HERMES

declare global {
	function setTimeout(
		cb: (...args: unknown[]) => unknown,
		timeout?: number,
	): number
	/**
	 * Calls the garbage collector
	 */
	function gc(): void
	interface HermesInternalObject {
		getRuntimeProperties(): Record<string, string>
		// biome-ignore lint/complexity/noBannedTypes: You can pass any function here
		getFunctionLocation(fn: Function): {
			fileName: string
			lineNumber: number
			columnNumber: number
			segmentID: number
			virtualOffset: number
			isNative: boolean
		}
	}
}

/// HERMES PROMISES

declare global {
	// biome-ignore lint/correctness/noUnusedVariables: Type parameter names must match
	interface Promise<T> {
		/// PROMISE POLYFILLS FROM: https://github.com/then/promise
		/// AND: https://github.com/facebook/hermes/blob/main/lib/InternalBytecode/01-Promise.js
		_h: 0 | 1 | 2
		/**
		 * The resolved value of the promise, if it has been resolved.
		 */
		_j: any
	}
	type HermesPromiseRejectionHandler = (
		promise: Promise<any>,
		error: any,
	) => void
	interface PromiseConstructor {
		_m: HermesPromiseRejectionHandler
	}
}

/// REACT DEVTOOLS

declare global {
	var __REACT_DEVTOOLS_GLOBAL_HOOK__: unknown | undefined
	var __REACT_DEVTOOLS__:
		| {
				version: number
				exports: {
					connectToDevTools(opts: {
						host?: string
						port?: number
						websocket?: WebSocket
					}): void
				}
		  }
		| undefined
}

/// METRO

declare global {
	var __METRO_GLOBAL_PREFIX__: ''
	var __d: Metro.DefineFn
	var __r: Metro.RequireFn & {
		importDefault: Metro.ImportDefaultFn
		importAll: Metro.ImportAllFn
	}
	var __c: Metro.ClearFn
}

/// REACT NATIVE

declare global {
	var nativeModuleProxy: Record<string, unknown>
	var __turboModuleProxy: ((name: string) => unknown) | undefined
	function nativeLoggingHook(str: string, level: number): void
	function alert(message: unknown): void
	var nativePerformanceNow: typeof performance.now
	var performance: {
		now(): number
	}
}
//#endregion
//#region types/lib.d.ts
declare global {
	export function plugin<O extends PluginApiExtensionsOptions>(
		manifest: PluginManifest,
		options: PluginOptions<O>,
	): void
}
//# sourceMappingURL=types.d.ts.map
