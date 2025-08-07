import * as react3 from 'react'
import { FC, ReactNode } from 'react'

//#region lib/utils/src/callback.d.ts
declare namespace callback_d_exports {
	export { asap, debounce, noop }
}
declare function debounce<F extends (...args: any[]) => any>(
	func: F,
	timeout: number,
): (...args: Parameters<F>) => Promise<unknown>
/**
 * A function that runs the callback as soon as possible.
 * @param cb The callback to run.
 */
declare const asap: (cb: (...args: any[]) => any) => void
declare const noop: () => void
declare namespace error_d_exports {
	export { getCurrentStack, getErrorStack }
}
declare function getErrorStack(e: unknown): string | undefined
declare function getCurrentStack(): string
declare namespace object_d_exports {
	export { defineLazyProperties, defineLazyProperty, isObject, mergeDeep }
}
/**
 * Simple check if to see if value is an object.
 *
 * @param val The value to check.
 */
declare function isObject(val: any): val is AnyObject
/**
 * Deep merge two objects.
 *
 * @param target The object to merge into.
 * @param source The object to merge from.
 *
 * @returns The merged target.
 */
declare function mergeDeep(target: AnyObject, source: AnyObject): AnyObject
/**
 * Define a lazy property on an object that will be loaded when accessed.
 *
 * @param target The target object to define the property on.
 * @param property The property key to define.
 * @param loader The function that will be called to load the property value when accessed.
 * @return The target object with the lazy property defined.
 */
declare function defineLazyProperty<T extends object, K extends keyof T>(
	target: T,
	property: K,
	loader: () => T[K],
): T
/**
 * Define multiple lazy properties on an object that will be loaded when accessed.
 *
 * @param target The target object to define the properties on.
 * @param loaders An object where each key is a property name and the value is a function that returns the property value when accessed.
 * @returns The target object with the lazy properties defined.
 */
declare function defineLazyProperties<T extends object>(
	target: T,
	loaders: Partial<Record<keyof T, () => T[keyof T]>>,
): T
declare namespace promise_d_exports {
	export { allSettled, sleep, sleepReject }
}
declare function allSettled(
	promises: Promise<any>[],
): Promise<PromiseSettledResult<any>[]>
declare function sleep(ms: number): Promise<void>
declare function sleepReject(ms: number, msg?: string): Promise<void>
declare namespace proxy_d_exports {
	export {
		DestructureOptions,
		DestructureResult,
		ProxifyOptions,
		destructure,
		getProxyTarget,
		isProxified,
		isProxy,
		proxify,
		unproxify,
	}
}
/**
 * This patch allows us to store instances of Proxy, so we can check whether a value is created using Proxy or not.
 * This is especially useful for blacklisting exports that cannot be patched.
 */
/**
 * Returns whether the object is a proxy.
 *
 * @param obj The object to check
 */
declare function isProxy(obj: object): boolean
/**
 * Returns whether the object is a proxified value.
 *
 * @param obj The object to check
 */
declare function isProxified(obj: object): boolean
/**
 * Returns the target of the proxy.
 *
 * @param obj The proxy
 * @returns The target of the proxy
 */
declare function getProxyTarget(obj: object): object | undefined
interface ProxifyOptions {
	/**
	 * The hint for the proxified value.
	 *
	 * @default function () {}
	 */
	hint?: object
	/**
	 * Whether the proxified value should be cached.
	 */
	cache?: boolean
	/**
	 * For methods of the proxified value, whether to bind the `this` context to the proxified value.
	 * The original reference of this method will NOT be retained. To get the original method, use `getProxyTarget` on the method.
	 *
	 * @default false
	 */
	bindMethods?: boolean
}
/**
 * Proxify a value.
 *
 * @param signal The signal to use to get the value.
 * @param options The options to use for the proxified value.
 * @returns A proxified value that will be updated when the signal is updated.
 *
 * @example Without cache
 * ```ts
 * const proxified = proxify(() => ({ value: Math.random() }), { hint: {} })
 * console.log(proxified) // { value: 0.123 }
 * console.log(proxified.value) // 0.456
 * console.log(proxified) // { value: 0.789 }
 * ```
 *
 * @example With cache
 * ```ts
 * const proxified = proxify(() => ({ value: Math.random() }), { hint: {}, cache: true })
 * console.log(proxified) // { value: 0.123 }
 * console.log(proxified.value) // 0.123
 * console.log(proxified) // { value: 0.123 }
 * ```
 */
declare function proxify<T>(signal: () => T, options?: ProxifyOptions): T
/**
 * Get the value of a proxified value at the current moment.
 * Returns the same value if not a proxified value.
 *
 * @see {@link proxify} for more documentation.
 *
 * @param proxified The proxified value.
 * @returns The unproxified value, or the value if it's not a proxified value.
 *
 * @example Without cache
 * ```ts
 * const proxified = proxify(() => ({ value: Math.random() }), { hint: {} })
 * const x = unproxify(proxified)
 * console.log(x) // { value: 0.123 }
 * console.log(x.value) // 0.123
 * console.log(proxified) // { value: 0.456 }
 * ```
 *
 * @example With cache
 * ```ts
 * const proxified = proxify(() => ({ value: Math.random() }), { hint: {}, cache: true })
 * const x = unproxify(proxified)
 * console.log(x) // { value: 0.123 }
 * console.log(x.value) // 0.123
 * console.log(proxified) // { value: 0.123 }
 * ```
 */
declare function unproxify<T extends object>(proxified: T): T
type DestructureOptions<T extends object> = { [K in keyof T]?: ProxifyOptions }
type DestructureResult<T extends object, O extends DestructureOptions<T>> = {
	[K in keyof T]: O[K] extends ProxifyOptions ? T[K] : never
}
/**
 * Destructure a proxified value.
 *
 * @param proxified The proxified value.
 * @param options The options to use for the destructured value.
 *
 * @see {@link proxify} for more documentation.
 *
 * @throws {TypeError} If the value is not a proxifiable value (primitives).
 *
 * @example
 * ```ts
 * // cache is not turned on, so each access will call the signal again
 * const { x, y } = destructure(
 *   proxify(() => ({ x: Math.random(), y: [Math.random()], z: null })),
 *   { hint: {} }
 * )
 *
 * // Non-nullish primitives are not proxifiable
 * x // TypeError: Cannot destructure and proxify a primitive (reading 'x')
 *
 * y // [0.123]
 * y // [0.456]
 *
 * z // TypeError: Cannot destructure and proxify null (reading 'z')
 * ```
 */
declare function destructure<
	T extends object,
	const O extends DestructureOptions<T>,
>(proxified: T, options?: O): DestructureResult<T, O>
declare namespace tree_d_exports {
	export { FindInTreeOptions, SearchFilter, SearchTree, findInTree }
}
type SearchTree = Record<string, any>
type SearchFilter = (tree: SearchTree) => boolean
interface FindInTreeOptions {
	/**
	 * A set of keys to search for in the tree.
	 */
	walkable?: Set<string>
	/**
	 * A set of keys to ignore when searching the tree.
	 */
	ignore?: Set<string>
	/**
	 * The maximum depth to search in the tree.
	 *
	 * @default 100
	 */
	maxDepth?: number
}
declare function findInTree<F extends SearchFilter>(
	tree: SearchTree,
	filter: F,
	opts?: FindInTreeOptions,
): ExtractPredicate<F> | undefined
declare namespace react_d_exports {
	export { findInReactFiber, useIsFirstRender, useReRender }
}
declare function useIsFirstRender(): boolean
declare function useReRender(): react3.ActionDispatch<[]>
declare function findInReactFiber<F extends SearchFilter>(
	fiber: Extract<ReactNode, object>,
	filter: F,
): ExtractPredicate<F> | undefined
declare namespace filters_d_exports {
	export {
		ByName,
		ByProps,
		BySingleProp,
		ComparableDependencyMap,
		Every,
		Filter,
		FilterGenerator,
		FilterResult,
		IsFilterWithExports,
		ModuleStateAware,
		PreferExports,
		Some,
		WithoutProps,
		byDependencies,
		byName,
		byProps,
		bySingleProp,
		createFilterGenerator,
		every,
		moduleStateAware,
		preferExports,
		some,
		withoutProps,
	}
}
type FilterResult<F> = F extends Filter<infer R, boolean> ? R : never
type IsFilterWithExports<F> = F extends Filter<any, infer WE> ? WE : never
interface Filter<_Inferable = any, WithExports extends boolean = boolean> {
	(
		...args: If<
			WithExports,
			[id: Metro.ModuleID, exports: Metro.ModuleExports],
			[id: Metro.ModuleID, exports?: never]
		>
	): boolean
	key: string
}
interface FilterGenerator<G extends (...args: any[]) => Filter> extends G {
	keyFor: (args: Parameters<G>) => string
}
/**
 * Create a filter generator.
 *
 * @param filter The function that filters the modules.
 * @param keyFor The function that generates the key for the filter.
 * @returns A function that generates a filter with the specified arguments.
 *
 * @example
 * ```ts
 * const custom = createFilterGenerator<[arg1: number, arg2: string]>(
 *   ([arg1, arg2], id, exports) => {
 *     // filter logic
 *     return true
 *   },
 *   ([arg1, arg2]) => `revenge.custom(${arg1}, ${arg2})`
 * )
 * ```
 *
 * @see {@link byProps} for an example on custom-typed filters.
 */
declare function createFilterGenerator<A extends any[]>(
	filter: (
		args: A,
		id: Metro.ModuleID,
		exports: Metro.ModuleExports,
	) => boolean,
	keyFor: (args: A) => string,
): FilterGenerator<(...args: A) => Filter<any, true>>
declare function createFilterGenerator<A extends any[]>(
	filter: (args: A, id: Metro.ModuleID) => boolean,
	keyFor: (args: A) => string,
): FilterGenerator<(...args: A) => Filter<any, false>>
type ByProps = FilterGenerator<
	<T extends Record<string, any> = Record<string, any>>(
		prop: keyof T,
		...props: Array<keyof T>
	) => Filter<T, true>
>
/**
 * Filter modules by their exports having all of the specified properties.
 *
 * @param prop The property to check for.
 * @param props More properties to check for (optional).
 *
 * @example
 * ```ts
 * const [React] = lookupModule(byProps<typeof import('react')>('createElement'))
 * // const React: typeof import('react')
 * ```
 */
declare const byProps: ByProps
type WithoutProps = FilterGenerator<
	<T extends Record<string, any>>(
		prop: string,
		...props: string[]
	) => Filter<T, true>
>
/**
 * Filter modules by their exports having none of the specified properties.
 *
 * @param prop The property to check for.
 * @param props More properties to check for (optional).
 */
declare const withoutProps: WithoutProps
type BySingleProp = FilterGenerator<
	<T extends Record<string, any>>(prop: keyof T) => Filter<T, true>
>
/**
 * Filter modules by their exports having only the specified property.
 *
 * @param prop The property to check for.
 *
 * @example
 * ```ts
 * const [FormSwitchModule] = lookupModule(bySingleProp('FormSwitch'))
 * // const FormSwitchModule: { FormSwitch: any }
 * ```
 */
declare const bySingleProp: BySingleProp
type ByName = FilterGenerator<
	<T extends object = object>(name: string) => Filter<T, true>
>
/**
 * Filter modules by their exports having the specified name.
 *
 * Usually used for function components or classes.
 *
 * @param name The name to check for.
 *
 * @example Auto-typing as object
 * ```ts
 * const [SomeComponent] = lookupModule(byName('SomeComponent'))
 * // const SomeComponent: { name: 'SomeComponent' }
 * ```
 *
 * @example Typing as function component
 * ```ts
 * type MyComponent = React.FC<{ foo: string }>
 *
 * const [MyComponent] = lookupModule(byName<MyComponent>('MyComponent'))
 * // const MyComponent: MyComponent & { name: 'MyComponent' }
 * ```
 *
 * @example Typing as class
 * ```
 * interface SomeClass {
 *    someMethod(): void
 * }
 *
 * const [SomeClass] = lookupModule(byName<{ new(param: string): SomeClass }>('SomeClass'))
 * // const SomeClass: { new(): SomeClass, name: 'SomeClass' }
 */
declare const byName: ByName
interface ComparableDependencyMap
	extends Array<Metro.ModuleID | number | undefined | ComparableDependencyMap> {
	l?: boolean
	r?: number
}
type ByDependencies = FilterGenerator<
	<T>(deps: ComparableDependencyMap) => Filter<T, false>
> & {
	loose: typeof loose
	relative: typeof relative
}
/**
 * Filter modules by their dependency map.
 *
 * @param deps The dependency map to check for, can be a sparse array or have `undefined` to be any dependency ("dynamic"). **Order and size matters!**
 *
 * To do proper fingerprinting for modules:
 * @see {@link byDependencies.loose} to loosen the checks.
 * @see {@link byDependencies.relative} to compare dependencies relatively.
 *
 * @example
 * ```ts
 * const { loose, relative } = byDependencies
 *
 * // Logger's module ID is 5
 * // It has 3 dependencies [4, ?, 2]
 *
 * const [Logger] = lookupModule(byDependencies([4, undefined, 2]))
 * // or
 * const [Logger] = lookupModule(byDependencies([4, , 2]))
 *
 * // Relative dependencies
 * const [Logger] = lookupModule(byDependencies([relative(-1), undefined, 2]))
 *
 * // Nested dependencies
 * // The last dependency (module ID 2) would need to have zero dependencies:
 * const [Logger] = lookupModule(byDependencies([4, undefined, []]))
 *
 * // Loose dependencies
 * // Module having these dependencies: [4, ...], [4, ..., ...], [4, ..., ..., ...], etc. would match:
 * const [SomeOtherModule] = lookupModule(byDependencies(loose([4])))
 * ```
 */
declare const byDependencies: ByDependencies
/**
 * Make this set of comparable dependencies as loose.
 *
 * Making a dependency loose skips the exact length check, but the order of the set dependencies still matters.
 * If you mark an index as dynamic, the same index must also be present in the other map during comparison to pass.
 *
 * @param deps The dependency map to make loose. This permanently modifies the array.
 * @returns The modified dependency map.
 */
declare function loose(deps: ComparableDependencyMap): ComparableDependencyMap
/**
 * Marks this dependency to compare relatively to the module ID being compared.
 *
 * @param id The dependency ID to mark as relative.
 * @param root Marks this dependency to compare relatively to the root (returning) module ID being compared. Useful for nested comparisons where you want to compare by the root module ID instead of the parent's module ID of the nested dependency.
 */
declare function relative(id: Metro.ModuleID, root?: boolean): number
declare namespace relative {
	var withDependencies: (
		deps: ComparableDependencyMap,
		id: Metro.ModuleID,
		root?: boolean,
	) => ComparableDependencyMap
}
type Every = FilterGenerator<{
	<F1 extends Filter, F2 extends Filter>(
		f1: F1,
		f2: F2,
	): Filter<
		FilterResult<F1> & FilterResult<F2>,
		LogicalOr<IsFilterWithExports<F1>, IsFilterWithExports<F2>>
	>
	<F1 extends Filter, F2 extends Filter, F3 extends Filter>(
		f1: F1,
		f2: F2,
		f3: F3,
	): Filter<
		FilterResult<F1> & FilterResult<F2> & FilterResult<F3>,
		LogicalOr<
			LogicalOr<IsFilterWithExports<F1>, IsFilterWithExports<F2>>,
			IsFilterWithExports<F3>
		>
	>
	(...filters: Filter[]): Filter
}>
/**
 * Combines multiple filters into one, returning true if **every** filter matches.
 *
 * @param filters The filters to combine.
 *
 * @example
 * ```ts
 * const [SomeModule] = lookupModule(every(
 *    byProps('x', 'name'),
 *    byName('SomeName'),
 *    byDependencies([1, 485, undefined, 2]),
 * ))
 * ```
 */
declare const every: Every
type Some = FilterGenerator<{
	<F1 extends Filter, F2 extends Filter>(
		f1: F1,
		f2: F2,
	): Filter<
		FilterResult<F1> | FilterResult<F2>,
		IsFilterWithExports<F1> | IsFilterWithExports<F2>
	>
	<F1 extends Filter, F2 extends Filter, F3 extends Filter>(
		f1: F1,
		f2: F2,
		f3: F3,
	): Filter<
		FilterResult<F1> | FilterResult<F2> | FilterResult<F3>,
		IsFilterWithExports<F1> | IsFilterWithExports<F2> | IsFilterWithExports<F3>
	>
	(...filters: Filter[]): Filter
}>
/**
 * Combines multiple filters into one, returning true if **some** filters match.
 *
 * @param filters The filters to combine.
 *
 * @example
 * ```ts
 * const [SomeModule] = lookupModule(some(
 *   byProps('x', 'name'),
 *   byName('SomeName'),
 *   byDependencies([1, 485, undefined, 2]),
 * ))
 * ```
 */
declare const some: Some
type ModuleStateAware = FilterGenerator<
	<IF extends Filter>(
		initializedFilter: IF,
		uninitializedFilter: Filter<any, false>,
		strict?: boolean,
	) => Filter<FilterResult<IF>, false>
>
/**
 * Filter modules depending on their initialized state. **Initialized modules with bad exports are skipped.**
 *
 * @param initializedFilter The filter to use for initialized modules.
 * @param uninitializedFilter The filter to use for uninitialized modules.
 * @param strict Whether to also filter with `uninitializedFilter` after `initializedFilter` passes, confirming the module is definitely the correct module. Defaults to `false`.
 *
 * @example
 * ```ts
 * // will filter byProps('x') for initialized modules
 * // and byDependencies([1, 485, undefined, 2]) for uninitialized modules
 * const [SomeModule] = lookupModule(moduleStateAware(
 *   byProps('x'),
 *   byDependencies([1, 485, undefined, 2]),
 * ))
 * ```
 */
declare const moduleStateAware: ModuleStateAware
type PreferExports = FilterGenerator<
	<WEF extends Filter>(
		withExportsFilter: WEF,
		exportslessFilter: Filter<any, false>,
		strict?: boolean,
	) => Filter<FilterResult<WEF>, false>
>
/**
 * Filter modules depending on if their exports are available and filterable.
 *
 * @see {@link isModuleExportsBad} for more information on what is considered bad module exports.
 *
 * @see {@link moduleStateAware} for an alternative that filters based on the module's initialized state.
 *
 * @param withExportsFilter The filter to use for modules with proper exports.
 * @param exportslessFilter The filter to use for modules without proper exports (uninitialized or bad).
 * @param strict Whether to also filter with `exportslessFilter` after `withExportsFilter` passes, confirming the module is definitely the correct module. Defaults to `false`.
 *
 * @example
 * ```ts
 * // will filter byProps('x') for modules with proper exports
 * // and byDependencies([1, 485, undefined, 2]) for without proper exports (uninitialized or bad)
 * const [SomeModule] = lookupModule(preferExports(
 *   byProps('x'),
 *   byDependencies([1, 485, undefined, 2]),
 * ))
 * ```
 */
declare const preferExports: PreferExports
declare namespace discord_d_exports {
	export {
		ByGeneratedIconComponent,
		byGeneratedIconComponent,
		lookupGeneratedIconComponent,
	}
}
type ByGeneratedIconComponent = FilterGenerator<
	<N extends string>(
		name: N,
		...assets: string[]
	) => Filter<{ [K in N]: FC<any> }>
>
/**
 * Filter by icon component name and asset names.
 *
 * **Make sure to set `uninitialized: true` when using this filter in `lookupModule`!**
 *
 * @param names The component name, then the asset names if the component has multiple assets. *
 * @example
 * ```ts
 * const [CopyIconModule] = lookupModule(
 *   byGeneratedIconComponent('CopyIcon'),
 *   {
 *     uninitialized: true,
 *   }
 * )
 * if (CopyIconModule) {
 *   const { CopyIcon } = CopyIconModule
 *   // Use CopyIcon as a React component
 * }
 * ```
 * @example
 * ```ts
 * const [CircleXIconModule] = lookupModule(
 *   byGeneratedIconComponent(
 *     'CircleXIcon',
 *     'CircleXIcon-secondary',
 *     'CircleXIcon-primary',
 *   ),
 *   {
 *    uninitialized: true,
 *   }
 * )
 * ```
 */
declare const byGeneratedIconComponent: ByGeneratedIconComponent
/**
 * Looks up a generated icon component by its name and asset names.
 *
 * @param names The component name, then the asset names if the component has multiple assets.
 * @returns The icon component, or `undefined` if it could not be found.
 */
declare function lookupGeneratedIconComponent<N extends string>(
	...names: [N, ...string[]]
): FC<any> | undefined
//#endregion
//#region lib/utils/src/types.d.ts
type Nullish = null | undefined
type If<T, Then, Else> = T extends true ? Then : Else
type AnyObject = Record<any, any>
type LogicalOr<T1, T2> = T1 extends true ? true : T2 extends true ? true : false
type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends AnyObject ? DeepPartial<T[K]> : T[K]
}
type ExtractPredicate<T> = T extends (arg: any) => arg is infer R ? R : never
interface PreInitPluginApiUtils {
	callback: typeof callback_d_exports
	error: typeof error_d_exports
	object: typeof object_d_exports
	promise: typeof promise_d_exports
	proxy: typeof proxy_d_exports
	tree: typeof tree_d_exports
}
interface PluginApiUtils extends PreInitPluginApiUtils {
	react: typeof react_d_exports
	discord: typeof discord_d_exports
}
declare module '@revenge-mod/plugins/types' {
	interface UnscopedPreInitPluginApi {
		utils: PreInitPluginApiUtils
	}
	interface UnscopedInitPluginApi {
		utils: PluginApiUtils
	}
}
//#endregion
//#region lib/modules/src/types.d.ts
/**
 * Metro is a bundler for React Native.
 *
 * @see {@link https://github.com/facebook/metro/blob/main/packages/metro-runtime/src/polyfills/require.js}
 */
declare namespace Metro {
	type DependencyMap = Array<ModuleID>
	type FactoryFn = (
		global: object,
		require: RequireFn,
		metroImportDefault: RequireFn,
		metroImportAll: RequireFn,
		moduleObject: Module,
		exports: ModuleExports,
		dependencyMap: DependencyMap,
	) => void
	type ModuleID = number
	interface ModuleDefinition<Initialized = boolean> {
		/**
		 * Dependencies of this module (set to `undefined` once the module is initialized)
		 */
		dependencyMap: If<Initialized, undefined, DependencyMap>
		/**
		 * Error that occurred during initialization
		 */
		error?: any
		/**
		 * Factory function that initializes the module
		 */
		factory: If<Initialized, undefined, FactoryFn>
		/**
		 * Whether an error occurred during initialization
		 */
		hasError: boolean
		importedAll: ModuleExports
		importedDefault: ModuleExports
		/**
		 * Whether factory has been successfully called
		 * */
		isInitialized: boolean
		publicModule: ModuleExports
	}
	type Module = {
		id?: ModuleID
		exports: ModuleExports
	}
	type ModuleList = Map<ModuleID, ModuleDefinition>
	type RequireFn = (id: ModuleID) => ModuleExports
	type DefineFn = (
		factory: FactoryFn,
		moduleId: ModuleID,
		dependencyMap: DependencyMap,
	) => void
	type ClearFn = () => ModuleList
	interface Require extends RequireFn {
		importDefault: RequireFn
		importAll: RequireFn
	}
	type ModuleExports = any
}
declare namespace RevengeMetro {
	type ModuleDefinition<Initialized = boolean> = {
		flags: number
		module: Metro.Module
		factory: If<Initialized, undefined, () => void>
		importedDefault?: Metro.ModuleExports
		importedAll?: Metro.ModuleExports
		error?: If<Initialized, undefined, any>
	}
	type ModuleList = Map<Metro.ModuleID, ModuleDefinition>
}
/**
 * Maybe the default export matched instead of the namespace, because you're using `options.returnNamespace`.
 */
type MaybeDefaultExportMatched<T> =
	| T
	| {
			default: T
	  }
//#endregion
export {
	AnyObject,
	ByName,
	ByProps,
	BySingleProp,
	ComparableDependencyMap,
	DeepPartial,
	Every,
	ExtractPredicate,
	Filter,
	FilterGenerator,
	FilterResult,
	If,
	IsFilterWithExports,
	LogicalOr,
	MaybeDefaultExportMatched,
	Metro,
	ModuleStateAware,
	Nullish,
	PluginApiUtils,
	PreInitPluginApiUtils,
	PreferExports,
	RevengeMetro,
	Some,
	WithoutProps,
	byDependencies,
	byName,
	byProps,
	bySingleProp,
	createFilterGenerator,
	every,
	filters_d_exports,
	moduleStateAware,
	preferExports,
	some,
	withoutProps,
}
//# sourceMappingURL=types-B_j3D-kJ.d.ts.map
