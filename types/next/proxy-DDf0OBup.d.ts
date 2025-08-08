declare namespace proxy_d_exports {
  export { DestructureOptions, DestructureResult, ProxifyOptions, destructure, getProxyTarget, isProxified, isProxy, proxify, unproxify };
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
declare function isProxy(obj: object): boolean;
/**
 * Returns whether the object is a proxified value.
 *
 * @param obj The object to check
 */
declare function isProxified(obj: object): boolean;
/**
 * Returns the target of the proxy.
 *
 * @param obj The proxy
 * @returns The target of the proxy
 */
declare function getProxyTarget(obj: object): object | undefined;
interface ProxifyOptions {
  /**
   * The hint for the proxified value.
   *
   * @default function () {}
   */
  hint?: object;
  /**
   * Whether the proxified value should be cached.
   */
  cache?: boolean;
  /**
   * For methods of the proxified value, whether to bind the `this` context to the proxified value.
   * The original reference of this method will NOT be retained. To get the original method, use `getProxyTarget` on the method.
   *
   * @default false
   */
  bindMethods?: boolean;
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
declare function proxify<T>(signal: () => T, options?: ProxifyOptions): T;
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
declare function unproxify<T extends object>(proxified: T): T;
type DestructureOptions<T extends object> = { [K in keyof T]?: ProxifyOptions };
type DestructureResult<T extends object, O extends DestructureOptions<T>> = { [K in keyof T]: O[K] extends ProxifyOptions ? T[K] : never };
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
declare function destructure<T extends object, const O extends DestructureOptions<T>>(proxified: T, options?: O): DestructureResult<T, O>;
//#endregion
export { DestructureOptions, DestructureResult, ProxifyOptions, destructure, getProxyTarget, isProxified, isProxy, proxify, proxy_d_exports, unproxify };