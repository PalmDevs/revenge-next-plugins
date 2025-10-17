import { callback_d_exports } from "./callback-CpIFpq3_.js";
import { error_d_exports } from "./error-D0foBB4e.js";
import { promise_d_exports } from "./promise-DVfFbAlR.js";
import { proxy_d_exports } from "./proxy-BpNB6oQJ.js";
import * as react3 from "react";
import { FC, ReactElement } from "react";

//#region lib/utils/src/object.d.ts
declare namespace object_d_exports {
  export { defineLazyProperties, defineLazyProperty, isObject, mergeDeep };
}
/**
 * Simple check if to see if value is an object.
 *
 * @param val The value to check.
 */
declare function isObject(val: any): val is AnyObject;
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
declare function defineLazyProperty<T extends object, K extends keyof T>(target: T, property: K, loader: () => T[K]): T;
/**
 * Define multiple lazy properties on an object that will be loaded when accessed.
 *
 * @param target The target object to define the properties on.
 * @param loaders An object where each key is a property name and the value is a function that returns the property value when accessed.
 * @returns The target object with the lazy properties defined.
 */
declare function defineLazyProperties<T extends object>(target: T, loaders: Partial<Record<keyof T, () => T[keyof T]>>): T;
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
declare function findInTree<F extends SearchFilter>(tree: SearchTree, filter: F, opts?: FindInTreeOptions): ExtractPredicate<F> | undefined;
declare namespace react_d_exports {
  export { findInReactFiber, useIsFirstRender, useReRender };
}
declare function useIsFirstRender(): boolean;
declare function useReRender(): react3.ActionDispatch<[]>;
declare function findInReactFiber<F extends SearchFilter>(fiber: ReactElement, filter: F): ExtractPredicate<F> | undefined;
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
//#endregion
//#region lib/modules/src/finders/filters/utils.d.ts
type FilterResult<F> = F extends Filter<infer R, boolean> ? R : F extends FilterBase<infer R> ? R : never;
type FilterRequiresExports<F> = F extends Filter<any, infer RE> ? RE : F extends FilterBase<any, infer RE> ? RE : never;
interface FilterBase<_Result = any, RequiresExports extends boolean = boolean> {
  (...args: If<RequiresExports, [id: Metro.ModuleID, exports: Metro.ModuleExports], [id: Metro.ModuleID, exports?: never]>): boolean;
  key: string;
  flags: If<RequiresExports, (typeof FilterFlag)['RequiresExports'], FilterFlag>;
}
type Filter<Result = any, RequiresExports extends boolean = boolean> = FilterHelpers & FilterBase<Result, RequiresExports>;
interface FilterHelpers {
  /**
   * Manually the key for this filter.
   *
   * **Don't use this unless you know what you're doing.** Only API exports should be using
   *
   * @param key The key to set for this filter.
   */
  keyAs<T extends FilterBase>(this: T, key: string): T;
  /**
   * Combines this filter with another filter, returning a new filter that matches if **both** filters match.
   *
   * @param filter The filter to combine with.
   */
  and<T extends FilterBase, F extends FilterBase>(this: T, filter: F): Filter<FilterResult<T> & FilterResult<F>, LogicalAnd<FilterRequiresExports<T>, FilterRequiresExports<F>>>;
  /**
   * Combines this filter with another filter, returning a new filter that matches if **either** filter matches.
   *
   * Note that exportsless filters must come first to avoid gotchas with uninitialized modules.
   *
   * @param filter The filter to combine with.
   */
  or<T extends FilterBase, F extends FilterBase>(this: T, filter: F): Filter<FilterResult<T> | FilterResult<F>, LogicalAnd<FilterRequiresExports<T>, FilterRequiresExports<F>>>;
}
type FilterGenerator<G extends (...args: any[]) => Filter> = G & {
  keyFor(args: Parameters<G>): string;
  flagsFor(args: Parameters<G>): FilterFlag;
};
/**
 * Create a filter generator.
 *
 * @param filter The function that filters the modules.
 * @param keyFor The function that generates the key for the filter.
 * @param flagFor The function that generates the flags for the filter, or a static flag.
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
declare function createFilterGenerator<A extends any[]>(filter: (args: A, id: Metro.ModuleID, exports: Metro.ModuleExports) => boolean, keyFor: (args: A) => string, flagFor: ((args: A) => FilterFlag) | FilterFlag): FilterGenerator<(...args: A) => Filter<any, true>>;
declare function createFilterGenerator<A extends any[]>(filter: (args: A, id: Metro.ModuleID) => boolean, keyFor: (args: A) => string, flagFor: ((args: A) => FilterFlag) | FilterFlag): FilterGenerator<(...args: A) => Filter<any, false>>;
//#endregion
//#region lib/modules/src/finders/filters/composite.d.ts
type And = FilterGenerator<(<F1 extends FilterBase, F2 extends FilterBase>(f1: F1, f2: F2) => Filter<FilterResult<F1> & FilterResult<F2>, LogicalAnd<FilterRequiresExports<F1>, FilterRequiresExports<F2>>>)>;
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
declare const and: (<F1 extends FilterBase, F2 extends FilterBase>(f1: F1, f2: F2) => Filter<FilterResult<F1> & FilterResult<F2>, LogicalAnd<FilterRequiresExports<F1>, FilterRequiresExports<F2>>>) & {
  keyFor(args: [f1: FilterBase<any, boolean>, f2: FilterBase<any, boolean>]): string;
  flagsFor(args: [f1: FilterBase<any, boolean>, f2: FilterBase<any, boolean>]): FilterFlag;
} & {
  keyFor: (args: [f1: FilterBase<any, boolean>, f2: FilterBase<any, boolean>]) => string;
  flagsFor: (args: [f1: FilterBase<any, boolean>, f2: FilterBase<any, boolean>]) => FilterFlag;
};
type Or = FilterGenerator<(<F1 extends FilterBase, F2 extends FilterBase>(f1: F1, f2: F2) => Filter<FilterResult<F1> | FilterResult<F2>, LogicalAnd<FilterRequiresExports<F1>, FilterRequiresExports<F2>>>)>;
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
declare const or: (<F1 extends FilterBase, F2 extends FilterBase>(f1: F1, f2: F2) => Filter<FilterResult<F1> | FilterResult<F2>, LogicalAnd<FilterRequiresExports<F1>, FilterRequiresExports<F2>>>) & {
  keyFor(args: [f1: FilterBase<any, boolean>, f2: FilterBase<any, boolean>]): string;
  flagsFor(args: [f1: FilterBase<any, boolean>, f2: FilterBase<any, boolean>]): FilterFlag;
} & {
  keyFor: (args: [f1: FilterBase<any, boolean>, f2: FilterBase<any, boolean>]) => string;
  flagsFor: (args: [f1: FilterBase<any, boolean>, f2: FilterBase<any, boolean>]) => FilterFlag;
};
//#endregion
//#region lib/modules/src/finders/filters/dynamic.d.ts
interface ComparableDependencyMap extends Array<Metro.ModuleID | number | null | undefined | ComparableDependencyMap> {
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
type WithDependencies = FilterGenerator<(<T>(deps: ComparableDependencyMap) => Filter<T, false>)> & {
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
  export { And, ComparableDependencyMap, Filter, FilterBase, FilterFlag, FilterGenerator, FilterHelpers, FilterRequiresExports, FilterResult, Or, WithName, WithProps, WithSingleProp, WithoutProps, and, createFilterGenerator, or, withDependencies, withName, withProps, withSingleProp, withoutProps };
}
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
type WithProps = FilterGenerator<(<T extends Record<string, any> = Record<string, any>>(prop: keyof T, ...props: Array<keyof T>) => Filter<T, true>)>;
/**
 * Filter modules by their exports having none of the specified properties.
 *
 * @param prop The property to check for.
 * @param props More properties to check for (optional).
 */
declare const withoutProps: WithoutProps;
type WithoutProps = FilterGenerator<(<T extends Record<string, any>>(prop: string, ...props: string[]) => Filter<T, true>)>;
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
type WithSingleProp = FilterGenerator<(<T extends Record<string, any>>(prop: keyof T) => Filter<T, true>)>;
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
type WithName = FilterGenerator<(<T extends object = object>(name: string) => Filter<T, true>)>;
declare namespace discord_d_exports {
  export { WithGeneratedIconComponent, lookupGeneratedIconComponent, withGeneratedIconComponent };
}
type WithGeneratedIconComponent = FilterGenerator<(<N extends string>(name: N, ...assets: string[]) => Filter<{ [K in N]: FC<any> }>)>;
/**
 * Filter by icon component name and asset names.
 *
 * **Make sure to set `uninitialized: true` when using this filter in `lookupModule`!**
 *
 * @param names The component name, then the asset names if the component has multiple assets. *
 * @example
 * ```ts
 * const [CopyIconModule] = lookupModule(
 *   withGeneratedIconComponent('CopyIcon'),
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
 *   withGeneratedIconComponent(
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
declare const withGeneratedIconComponent: WithGeneratedIconComponent;
/**
 * Looks up a generated icon component by its name and asset names.
 *
 * @param names The component name, then the asset names if the component has multiple assets.
 * @returns The icon component, or `undefined` if it could not be found.
 */
declare function lookupGeneratedIconComponent<N extends string>(...names: [N, ...string[]]): FC<any> | undefined;
//#endregion
//#region lib/utils/src/types.d.ts
type Nullish = null | undefined;
type If<T, Then, Else> = T extends true ? Then : Else;
type AnyObject = Record<any, any>;
type LogicalOr<T1, T2> = T1 extends true ? true : T2 extends true ? true : false;
type LogicalAnd<T1, T2> = T1 extends true ? T2 extends true ? true : false : false;
type DeepPartial<T> = { [K in keyof T]?: T[K] extends AnyObject ? DeepPartial<T[K]> : T[K] };
type ExtractPredicate<T> = T extends ((arg: any) => arg is infer R) ? R : never;
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
type MaybeDefaultExportMatched<T> = T | {
  default: T;
};
//#endregion
export { And, AnyObject, ComparableDependencyMap, DeepPartial, ExtractPredicate, Filter, FilterBase, FilterFlag, FilterGenerator, FilterHelpers, FilterRequiresExports, FilterResult, FindInTreeOptions, If, LogicalAnd, LogicalOr, MaybeDefaultExportMatched, Metro, Nullish, Or, PluginApiUtils, PreInitPluginApiUtils, RevengeMetro, SearchFilter, SearchTree, WithGeneratedIconComponent, WithName, WithProps, WithSingleProp, WithoutProps, and, createFilterGenerator, defineLazyProperties, defineLazyProperty, findInReactFiber, findInTree, index_d_exports, isObject, lookupGeneratedIconComponent, mergeDeep, or, useIsFirstRender, useReRender, withDependencies, withGeneratedIconComponent, withName, withProps, withSingleProp, withoutProps };