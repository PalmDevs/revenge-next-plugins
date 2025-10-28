import { t as __export } from "./chunk-Bp6m_JJh.js";
import { n as callback_d_exports } from "./callback-DNr1bYVq.js";
import { t as error_d_exports } from "./error-DWG2BlZz.js";
import { n as promise_d_exports } from "./promise-Du5Pcai3.js";
import { l as proxy_d_exports } from "./proxy-KNbRcH7H.js";
import * as react4 from "react";
import { FC, ReactElement } from "react";

//#region lib/utils/src/object.d.ts
declare namespace object_d_exports {
  export { cloneDeep, defineLazyProperties, defineLazyProperty, isObject, mergeDeep };
}
/**
 * Simple check if to see if value is an object.
 *
 * @param val The value to check.
 */
declare function isObject(val: any): val is AnyObject;
/**
 * Clone an object deeply.
 *
 * @param source The source object to clone.
 */
declare function cloneDeep<T$1>(source: T$1, cache?: WeakMap<WeakKey, any>): T$1;
/**
 * Deep merge two objects.
 *
 * @param target The object to merge into.
 * @param source The object to merge from.
 *
 * @returns The merged target.
 */
declare function mergeDeep(target: AnyObject, source: AnyObject): AnyObject;
/**
 * Define a lazy property on an object that will be loaded when accessed.
 *
 * @param target The target object to define the property on.
 * @param property The property key to define.
 * @param loader The function that will be called to load the property value when accessed.
 * @return The target object with the lazy property defined.
 */
declare function defineLazyProperty<T$1 extends object, K$1 extends keyof T$1>(target: T$1, property: K$1, loader: () => T$1[K$1]): T$1;
/**
 * Define multiple lazy properties on an object that will be loaded when accessed.
 *
 * @param target The target object to define the properties on.
 * @param loaders An object where each key is a property name and the value is a function that returns the property value when accessed.
 * @returns The target object with the lazy properties defined.
 */
declare function defineLazyProperties<T$1 extends object>(target: T$1, loaders: Partial<Record<keyof T$1, () => T$1[keyof T$1]>>): T$1;
declare namespace tree_d_exports {
  export { FindInTreeOptions, SearchFilter, SearchTree, findInTree };
}
type SearchTree = Record<string, any>;
type SearchFilter = (tree: SearchTree) => boolean;
interface FindInTreeOptions {
  /**
   * A set of keys to search for in the tree.
   */
  walkable?: Set<string>;
  /**
   * A set of keys to ignore when searching the tree.
   */
  ignore?: Set<string>;
  /**
   * The maximum depth to search in the tree.
   *
   * @default 100
   */
  maxDepth?: number;
}
declare function findInTree<F$1 extends SearchFilter>(tree: SearchTree, filter: F$1, opts?: FindInTreeOptions): ExtractPredicate<F$1> | undefined;
declare namespace react_d_exports {
  export { findInReactFiber, useIsFirstRender, useReRender };
}
declare function useIsFirstRender(): boolean;
declare function useReRender(): react4.ActionDispatch<[]>;
declare function findInReactFiber<F$1 extends SearchFilter>(fiber: ReactElement, filter: F$1): ExtractPredicate<F$1> | undefined;
//#endregion
//#region lib/modules/src/finders/filters/constants.d.ts
declare const FilterFlag: {
  /**
   * This filter works with and without module exports.
   * Allowing for both initialized and uninitialized modules to be matched.
   */
  readonly Dynamic: 0;
  /**
   * This filter requires module exports to work.
   * Only initialized modules will be matched.
   */
  readonly RequiresExports: 1;
};
/**
 * @see {@link FilterFlag}
 */
type FilterFlag = number;
/**
 * Scopes to limit filters to certain module states.
 */
declare const FilterScopes: {
  /**
   * Include all modules (both initialized and uninitialized, including blacklisted).
   * This overrides {@link FilterScopes.Uninitialized} and {@link FilterScopes.Initialized}.
   */
  readonly All: 1;
  /**
   * Include uninitialized modules in the search.
   */
  readonly Uninitialized: 2;
  /**
   * Include initialized modules from the search.
   */
  readonly Initialized: 4;
};
type FilterScope = (typeof FilterScopes)[keyof typeof FilterScopes];
/**
 * @see {@link FilterScopes}
 */
type FilterScopeValue = number;
interface FilterInfo {
  /**
   * The result type of the filter.
   */
  Result: any;
  /**
   * Whether the filter requires exports to work.
   */
  RequiresExports: boolean;
  /**
   * Scopes the filter matches modules in.
   */
  Scopes: FilterScope[];
}
interface DefaultFilterInfo extends FilterInfo {
  Result: any;
  RequiresExports: boolean;
  Scopes: FilterScope[];
}
//#endregion
//#region lib/modules/src/finders/filters/utils.d.ts
type FilterResult<F$1> = F$1 extends Filter<infer I> ? I['Result'] : never;
type FilterRequiresExports<F$1> = F$1 extends Filter<infer I> ? I['RequiresExports'] : never;
type FilterInfoOf<F$1> = F$1 extends Filter<infer I> ? I : FilterInfo;
interface FilterBase<Info extends FilterInfo = DefaultFilterInfo> {
  (...args: If<Info['RequiresExports'], [id: Metro.ModuleID, exports: Metro.ModuleExports], [id: Metro.ModuleID, exports?: never]>): boolean;
  key: string;
  flags: If<Info['RequiresExports'], (typeof FilterFlag)['RequiresExports'], FilterFlag>;
  scopes: FilterScopeValue;
}
type Filter<Info extends FilterInfo = DefaultFilterInfo> = FilterHelpers<Info> & FilterBase<Info>;
type MergeFilterInfo<I1 extends FilterInfo, I2 extends FilterInfo> = {
  Result: I1['Result'] & I2['Result'];
  RequiresExports: LogicalAnd<I1['RequiresExports'], I2['RequiresExports']>;
  Scopes: [...I1['Scopes'], ...I2['Scopes']];
};
type UnionFilterInfo<I1 extends FilterInfo, I2 extends FilterInfo> = {
  Result: I1['Result'] | I2['Result'];
  RequiresExports: LogicalAnd<I1['RequiresExports'], I2['RequiresExports']>;
  Scopes: [...I1['Scopes'], ...I2['Scopes']];
};
interface FilterHelpers<Info extends FilterInfo = DefaultFilterInfo> {
  /**
   * Manually the key for this filter.
   *
   * **Don't use this unless you know what you're doing.** Only API exports should be using this.
   *
   * @param key The key to set for this filter.
   */
  keyAs<T extends FilterBase<any>>(this: T, key: string): T;
  /**
   * Combines this filter with another filter, returning a new filter that matches if **both** filters match.
   *
   * @param filter The filter to combine with.
   */
  and<T extends FilterBase<any>, F extends FilterBase<any>>(this: T, filter: F): Filter<MergeFilterInfo<Info, FilterInfoOf<F>>>;
  /**
   * Combines this filter with another filter, returning a new filter that matches if **either** filter matches.
   *
   * @param filter The filter to combine with.
   */
  or<T extends Filter<Info>, F extends FilterBase<any>>(this: T, filter: F): Filter<UnionFilterInfo<Info, FilterInfoOf<F>>>;
  /**
   * Creates a new instance of this filter.
   */
  'new'(this: Filter<Info>): Filter<Info>;
  /**
   * Scopes this filter to match specific modules.
   *
   * @param scopes The scopes of modules to match.
   */
  scope<T extends Filter<Info>, const S extends FilterScope[]>(this: T, ...scopes: If<Info['RequiresExports'], [typeof FilterScopes.Initialized], S>): Filter<Info & {
    Scopes: If<Info['RequiresExports'], [typeof FilterScopes.Initialized], S>;
  }>;
}
type FilterGenerator<G extends (...args: any[]) => Filter> = G & {
  keyFor(args: Parameters<G>): string;
  flagsFor(args: Parameters<G>): FilterFlag;
  defaultScopesFor(args: Parameters<G>): FilterScopeValue;
};
/**
 * Create a filter generator.
 *
 * @param filter The function that filters the modules.
 * @param keyFor The function that generates the key for the filter.
 * @param flagFor The function that generates the flags for the filter, or a static flag.
 * @param defaultScopesFor The function that generates the default scopes for the filter, or static scopes. Defaults to {@link FilterScopes.Initialized}.
 * @returns A function that generates a filter with the specified arguments.
 *
 * @example
 * ```ts
 * const custom = createFilterGenerator<[arg1: number, arg2: string]>(
 *   ([arg1, arg2], id, exports) => {
 *     // filter logic
 *     return true
 *   },
 *   ([arg1, arg2]) => `custom(${arg1}, ${arg2})`
 * )
 * ```
 *
 * @see {@link withProps} for an example on custom-typed filters.
 */
declare function createFilterGenerator<A extends any[]>(filter: (args: A, id: Metro.ModuleID, exports: Metro.ModuleExports) => boolean, keyFor: (args: A) => string, flagFor: ((args: A) => FilterFlag) | FilterFlag, defaultScopesFor?: ((args: A) => FilterScopeValue) | FilterScopeValue): FilterGenerator<(...args: A) => Filter>;
declare function createFilterGenerator<A extends any[]>(filter: (args: A, id: Metro.ModuleID) => boolean, keyFor: (args: A) => string, flagFor: ((args: A) => FilterFlag) | FilterFlag, defaultScopesFor?: ((args: A) => FilterScopeValue) | FilterScopeValue): FilterGenerator<(...args: A) => Filter>;
//#endregion
//#region lib/modules/src/finders/filters/composite.d.ts
type And = FilterGenerator<(<F1 extends FilterBase, F2 extends FilterBase>(f1: F1, f2: F2) => Filter<MergeFilterInfo<FilterInfoOf<F1>, FilterInfoOf<F2>>>)>;
/**
 * Combines two filters into one, returning true if **every** filter matches.
 *
 * If each filter has different flags,
 *
 * @param filters The filters to combine.
 *
 * @example With filter helpers (preferred)
 * ```ts
 * const [SomeModule] = lookupModule(
 *   withProps('x', 'name')
 *     .and(withName('SomeName'))
 *     .and(withDependencies([1, 485, null, 2])),
 * )
 * ```
 *
 * @example
 * ```ts
 * const [SomeModule] = lookupModule(
 *   and(
 *     and(withProps('x', 'name'), withName('SomeName')),
 *     withDependencies([1, 485, null, 2]),
 *   ),
 * )
 * ```
 */
declare const and: (<F1 extends FilterBase, F2 extends FilterBase>(f1: F1, f2: F2) => Filter<MergeFilterInfo<FilterInfoOf<F1>, FilterInfoOf<F2>>>) & {
  keyFor(args: [f1: FilterBase<DefaultFilterInfo>, f2: FilterBase<DefaultFilterInfo>]): string;
  flagsFor(args: [f1: FilterBase<DefaultFilterInfo>, f2: FilterBase<DefaultFilterInfo>]): FilterFlag;
  defaultScopesFor(args: [f1: FilterBase<DefaultFilterInfo>, f2: FilterBase<DefaultFilterInfo>]): FilterScopeValue;
} & {
  keyFor: (args: [f1: FilterBase<DefaultFilterInfo>, f2: FilterBase<DefaultFilterInfo>]) => string;
  flagsFor: (args: [f1: FilterBase<DefaultFilterInfo>, f2: FilterBase<DefaultFilterInfo>]) => FilterFlag;
  defaultScopesFor: (args: [f1: FilterBase<DefaultFilterInfo>, f2: FilterBase<DefaultFilterInfo>]) => FilterScopeValue;
};
type Or = FilterGenerator<(<F1 extends FilterBase, F2 extends FilterBase>(f1: F1, f2: F2) => Filter<UnionFilterInfo<FilterInfoOf<F1>, FilterInfoOf<F2>>>)>;
/**
 * Combines two filters into one, returning true if **some** filters match.
 *
 * @param filters The filters to combine.
 *
 * @example With filter helpers (preferred)
 * ```ts
 * const [SomeModule] = lookupModule(
 *   withProps('x', 'name')
 *     .or(withName('SomeName'))
 *     .or(withDependencies([1, 485, null, 2])),
 * )
 * ```
 *
 * @example
 * ```ts
 * const [SomeModule] = lookupModule(
 *   or(
 *     or(withProps('x', 'name'), withName('SomeName')),
 *     withDependencies([1, 485, null, 2]),
 *   ),
 * )
 * ```
 */
declare const or: (<F1 extends FilterBase, F2 extends FilterBase>(f1: F1, f2: F2) => Filter<UnionFilterInfo<FilterInfoOf<F1>, FilterInfoOf<F2>>>) & {
  keyFor(args: [f1: FilterBase<DefaultFilterInfo>, f2: FilterBase<DefaultFilterInfo>]): string;
  flagsFor(args: [f1: FilterBase<DefaultFilterInfo>, f2: FilterBase<DefaultFilterInfo>]): FilterFlag;
  defaultScopesFor(args: [f1: FilterBase<DefaultFilterInfo>, f2: FilterBase<DefaultFilterInfo>]): FilterScopeValue;
} & {
  keyFor: (args: [f1: FilterBase<DefaultFilterInfo>, f2: FilterBase<DefaultFilterInfo>]) => string;
  flagsFor: (args: [f1: FilterBase<DefaultFilterInfo>, f2: FilterBase<DefaultFilterInfo>]) => FilterFlag;
  defaultScopesFor: (args: [f1: FilterBase<DefaultFilterInfo>, f2: FilterBase<DefaultFilterInfo>]) => FilterScopeValue;
};
//#endregion
//#region lib/modules/src/finders/filters/dynamic.d.ts
interface ComparableDependencyMap extends Array<Metro.ModuleID | number | null | undefined | ComparableDependencyMap | Filter> {
  l?: boolean;
  r?: number;
}
/**
 * Filter modules by their dependency map.
 *
 * @param deps The dependency map to check for, can be a sparse array or have `null` to be any dependency ("dynamic"). **Order and size matters!**
 *
 * To do proper fingerprinting for modules:
 * @see {@link withDependencies.loose} to loosen the checks.
 * @see {@link withDependencies.relative} to compare dependencies relatively.
 *
 * @example
 * ```ts
 * const { loose, relative } = withDependencies
 *
 * // Logger's module ID is 5
 * // It has 3 dependencies [4, ?, 2]
 *
 * const [Logger] = lookupModule(withDependencies([4, null, 2]))
 * // or
 * const [Logger] = lookupModule(withDependencies([4, , 2]))
 *
 * // Relative dependencies
 * const [Logger] = lookupModule(withDependencies([relative(-1), null, 2]))
 *
 * // Nested dependencies
 * // The last dependency (module ID 2) would need to have zero dependencies:
 * const [Logger] = lookupModule(withDependencies([4, null, []]))
 *
 * // Loose dependencies
 * // Module having these dependencies: [4, ...], [4, ..., ...], [4, ..., ..., ...], etc. would match:
 * const [SomeOtherModule] = lookupModule(withDependencies(loose([4])))
 *
 * // Using filters as dependencies
 * // Match modules with specific exports in their dependencies
 * const [Module] = lookupModule(withDependencies([
 *   withProps('open'), // first dependency must have an 'open' property
 *   withName('MyComponent'), // second dependency must have name === 'MyComponent'
 *   69, // third dependency must be module ID 69
 *   null, // fourth dependency can be anything
 *   420, // fifth dependency must be module ID 420
 *   2 // sixth dependency must be module ID 2
 * ]))
 * ```
 *
 * @example With filter helpers (preferred)
 * ```ts
 * const [Logger] = lookupModule(
 *   withProps('log')
 *     .withDependencies([4, null, 2]),
 * )
 * ```
 */
declare const withDependencies: WithDependencies;
type WithDependencies = FilterGenerator<(<T>(deps: ComparableDependencyMap) => Filter<{
  Result: T;
  RequiresExports: false;
  Scopes: [typeof FilterScopes.Uninitialized, typeof FilterScopes.Initialized];
}>)> & {
  loose: typeof loose;
  relative: typeof relative;
};
/**
 * Make this set of comparable dependencies as loose.
 *
 * Making a dependency loose skips the exact length check, but the order of the set dependencies still matters.
 * If you mark an index as dynamic, the same index must also be present in the other map during comparison to pass.
 *
 * @param deps The dependency map to make loose. This permanently modifies the array.
 * @returns The modified dependency map.
 */
declare function loose(deps: ComparableDependencyMap): ComparableDependencyMap;
/**
 * Marks this dependency to compare relatively to the module ID being compared.
 *
 * @param id The dependency ID to mark as relative.
 * @param root Marks this dependency to compare relatively to the root (returning) module ID being compared. Useful for nested comparisons where you want to compare by the root module ID instead of the parent's module ID of the nested dependency.
 */
declare function relative(id: Metro.ModuleID, root?: boolean): number;
declare namespace relative {
  var withDependencies: (deps: ComparableDependencyMap, id: Metro.ModuleID, root?: boolean) => ComparableDependencyMap;
}
declare namespace index_d_exports {
  export { And, ComparableDependencyMap, DefaultFilterInfo, Filter, FilterBase, FilterFlag, FilterGenerator, FilterHelpers, FilterInfo, FilterInfoOf, FilterRequiresExports, FilterResult, FilterScope, FilterScopeValue, FilterScopes, MergeFilterInfo, Or, UnionFilterInfo, WithName, WithProps, WithSingleProp, WithoutProps, and, createFilterGenerator, or, withDependencies, withName, withProps, withSingleProp, withoutProps };
}
type FilterRequiringExports<T$1> = Filter<{
  Result: T$1;
  RequiresExports: true;
  Scopes: [typeof FilterScopes.Initialized];
}>;
/**
 * Filter modules by their exports having all of the specified properties.
 *
 * @param prop The property to check for.
 * @param props More properties to check for (optional).
 *
 * @example
 * ```ts
 * const [React] = lookupModule(withProps<typeof import('react')>('createElement'))
 * // const React: typeof import('react')
 * ```
 */
declare const withProps: WithProps;
type WithProps = FilterGenerator<(<T extends Record<string, any> = Record<string, any>>(prop: keyof T, ...props: Array<keyof T>) => FilterRequiringExports<T>)>;
/**
 * Filter modules by their exports having none of the specified properties.
 *
 * @param prop The property to check for.
 * @param props More properties to check for (optional).
 */
declare const withoutProps: WithoutProps;
type WithoutProps = FilterGenerator<(<T extends Record<string, any>>(prop: string, ...props: string[]) => FilterRequiringExports<T>)>;
/**
 * Filter modules by their exports having only the specified property.
 *
 * @param prop The property to check for.
 *
 * @example
 * ```ts
 * const [FormSwitchModule] = lookupModule(withSingleProp('FormSwitch'))
 * // const FormSwitchModule: { FormSwitch: any }
 * ```
 */
declare const withSingleProp: WithSingleProp;
type WithSingleProp = FilterGenerator<(<T extends Record<string, any>>(prop: keyof T) => FilterRequiringExports<T>)>;
/**
 * Filter modules by their exports having the specified name.
 *
 * Usually used for function components or classes.
 *
 * @param name The name to check for.
 *
 * @example Auto-typing as object
 * ```ts
 * const [SomeComponent] = lookupModule(withName('SomeComponent'))
 * // const SomeComponent: { name: 'SomeComponent' }
 * ```
 *
 * @example Typing as function component
 * ```ts
 * type MyComponent = React.FC<{ foo: string }>
 *
 * const [MyComponent] = lookupModule(withName<MyComponent>('MyComponent'))
 * // const MyComponent: MyComponent & { name: 'MyComponent' }
 * ```
 *
 * @example Typing as class
 * ```
 * interface SomeClass {
 *    someMethod(): void
 * }
 *
 * const [SomeClass] = lookupModule(withName<{ new(param: string): SomeClass }>('SomeClass'))
 * // const SomeClass: { new(): SomeClass, name: 'SomeClass' }
 */
declare const withName: WithName;
type WithName = FilterGenerator<(<T extends object = object>(name: string) => FilterRequiringExports<T>)>;
declare namespace discord_d_exports {
  export { WithGeneratedIconComponent, lookupGeneratedIconComponent, withGeneratedIconComponent };
}
type WithGeneratedIconComponent = FilterGenerator<(<N extends string>(name: N, ...assets: string[]) => Filter<{
  Result: { [K in N]: FC<any> };
  RequiresExports: boolean;
  Scopes: [typeof FilterScopes.Uninitialized, typeof FilterScopes.Initialized];
}>)>;
/**
 * Filter by icon component name and asset names.
 *
 * @param names The component name, then the asset names if the component has multiple assets. *
 * @example
 * ```ts
 * const [CopyIconModule] = lookupModule(
 *   withGeneratedIconComponent('CopyIcon'),
 * )
 * if (CopyIconModule) {
 *   const { CopyIcon } = CopyIconModule
 *   // Use CopyIcon as a React component
 * }
 * ```
 * @example
 * ```ts
 * const [CircleXIconModule] = lookupModule(
 *   withGeneratedIconComponent(
 *     'CircleXIcon',
 *     'CircleXIcon-secondary',
 *     'CircleXIcon-primary',
 *   ),
 * )
 * ```
 */
declare const withGeneratedIconComponent: WithGeneratedIconComponent;
/**
 * Looks up a generated icon component by its name and asset names.
 *
 * @param names The component name, then the asset names if the component has multiple assets.
 * @returns The icon component, or `undefined` if it could not be found.
 */
declare function lookupGeneratedIconComponent<N$1 extends string>(...names: [N$1, ...string[]]): FC<any> | undefined;
//#endregion
//#region lib/utils/src/types.d.ts
type Nullish = null | undefined;
type If<T$1, Then, Else> = T$1 extends true ? Then : Else;
type Not<T$1 extends boolean> = T$1 extends true ? false : true;
type AnyObject = Record<any, any>;
type LogicalOr<T1, T2> = T1 extends true ? true : T2 extends true ? true : false;
type LogicalAnd<T1, T2> = T1 extends true ? T2 extends true ? true : false : false;
type DeepPartial<T$1> = { [K in keyof T$1]?: T$1[K] extends AnyObject ? DeepPartial<T$1[K]> : T$1[K] };
type ExtractPredicate<T$1> = T$1 extends ((arg: any) => arg is infer R) ? R : never;
interface PreInitPluginApiUtils {
  callback: typeof callback_d_exports;
  error: typeof error_d_exports;
  object: typeof object_d_exports;
  promise: typeof promise_d_exports;
  proxy: typeof proxy_d_exports;
  tree: typeof tree_d_exports;
}
interface PluginApiUtils extends PreInitPluginApiUtils {
  react: typeof react_d_exports;
  discord: typeof discord_d_exports;
}
declare module '@revenge-mod/plugins/types' {
  interface UnscopedPreInitPluginApi {
    utils: PreInitPluginApiUtils;
  }
  interface UnscopedInitPluginApi {
    utils: PluginApiUtils;
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
  type DependencyMap = Array<ModuleID>;
  type FactoryFn = (global: object, require: RequireFn, metroImportDefault: RequireFn, metroImportAll: RequireFn, moduleObject: Module, exports: ModuleExports, dependencyMap: DependencyMap) => void;
  type ModuleID = number;
  interface ModuleDefinition<Initialized = boolean> {
    /**
     * Dependencies of this module (set to `undefined` once the module is initialized)
     */
    dependencyMap: If<Initialized, undefined, DependencyMap>;
    /**
     * Error that occurred during initialization
     */
    error?: any;
    /**
     * Factory function that initializes the module
     */
    factory: If<Initialized, undefined, FactoryFn>;
    /**
     * Whether an error occurred during initialization
     */
    hasError: boolean;
    importedAll: ModuleExports;
    importedDefault: ModuleExports;
    /**
     * Whether factory has been successfully called
     * */
    isInitialized: boolean;
    publicModule: Module;
  }
  type Module = {
    id?: ModuleID;
    exports: ModuleExports;
  };
  type ModuleList = Map<ModuleID, ModuleDefinition>;
  type RequireFn = (id: ModuleID) => ModuleExports;
  type DefineFn = (factory: FactoryFn, moduleId: ModuleID, dependencyMap: DependencyMap) => void;
  type ClearFn = () => ModuleList;
  interface Require extends RequireFn {
    importDefault: RequireFn;
    importAll: RequireFn;
  }
  type ModuleExports = any;
}
declare namespace RevengeMetro {
  type Module = {
    id: Metro.ModuleID;
    exports: Metro.ModuleExports;
  };
  type ModuleDefinition<Initialized = boolean> = {
    flags: number;
    module?: Module;
    factory: If<Initialized, undefined, () => void>;
    importedDefault?: Metro.ModuleExports;
    importedAll?: Metro.ModuleExports;
    error?: If<Initialized, undefined, any>;
  };
  type ModuleList = Map<Metro.ModuleID, ModuleDefinition>;
}
/**
 * Maybe the default export matched instead of the namespace, because you're using `options.returnNamespace`.
 */
type MaybeDefaultExportMatched<T$1> = T$1 | {
  default: T$1;
};
//#endregion
export { SearchTree as $, and as A, UnionFilterInfo as B, withProps as C, withDependencies as D, ComparableDependencyMap as E, FilterHelpers as F, FilterScope as G, DefaultFilterInfo as H, FilterInfoOf as I, findInReactFiber as J, FilterScopeValue as K, FilterRequiresExports as L, Filter as M, FilterBase as N, And as O, FilterGenerator as P, SearchFilter as Q, FilterResult as R, withName as S, withoutProps as T, FilterFlag as U, createFilterGenerator as V, FilterInfo as W, useReRender as X, useIsFirstRender as Y, FindInTreeOptions as Z, WithName as _, DeepPartial as a, mergeDeep as at, WithoutProps as b, LogicalAnd as c, Nullish as d, findInTree as et, PluginApiUtils as f, withGeneratedIconComponent as g, lookupGeneratedIconComponent as h, AnyObject as i, isObject as it, or as j, Or as k, LogicalOr as l, WithGeneratedIconComponent as m, Metro as n, defineLazyProperties as nt, ExtractPredicate as o, PreInitPluginApiUtils as p, FilterScopes as q, RevengeMetro as r, defineLazyProperty as rt, If as s, MaybeDefaultExportMatched as t, cloneDeep as tt, Not as u, WithProps as v, withSingleProp as w, index_d_exports as x, WithSingleProp as y, MergeFilterInfo as z };