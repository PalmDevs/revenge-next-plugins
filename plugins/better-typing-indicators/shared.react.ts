import { cloneElement, isValidElement } from 'react'
import type { FC, ReactElement, ReactNode } from 'react'

const NotFound = Symbol()

/**
 * Replaces the first element in a tree matching `predicate`, without mutating the original tree.
 * The path to the replaced element is cloned, so trees cached by React Compiler stay intact.
 *
 * @returns The new tree, or the original tree if nothing matched.
 */
export function replaceElement(
	tree: ReactNode,
	predicate: (element: ReactElement<any>) => boolean,
	replacer: (element: ReactElement<any>) => ReactNode,
): ReactNode {
	const result = replace(tree, predicate, replacer)
	return result === NotFound ? tree : result
}

function replace(
	node: ReactNode,
	predicate: (element: ReactElement<any>) => boolean,
	replacer: (element: ReactElement<any>) => ReactNode,
): ReactNode | typeof NotFound {
	if (Array.isArray(node)) {
		for (let i = 0; i < node.length; i++) {
			const result = replace(node[i], predicate, replacer)
			if (result === NotFound) continue

			const copy = node.slice()
			copy[i] = result
			return copy
		}

		return NotFound
	}

	if (!isValidElement<{ children?: ReactNode }>(node)) return NotFound
	if (predicate(node)) return replacer(node)

	const children = node.props.children
	if (children == null) return NotFound

	const result = replace(children, predicate, replacer)
	if (result === NotFound) return NotFound

	return withChildren(node, result)
}

/**
 * Inserts `element` as a sibling right before the first element in a tree matching `predicate`,
 * without mutating the original tree. The matched element itself is kept as is.
 *
 * @returns The new tree, or the original tree if nothing matched.
 */
export function insertElementBefore(
	tree: ReactNode,
	predicate: (element: ReactElement<any>) => boolean,
	element: ReactElement,
): ReactNode {
	const result = insert(tree, predicate, element)
	return result === NotFound ? tree : result
}

function insert(
	node: ReactNode,
	predicate: (element: ReactElement<any>) => boolean,
	element: ReactElement,
): ReactNode | typeof NotFound {
	if (Array.isArray(node)) {
		for (let i = 0; i < node.length; i++) {
			const child = node[i]

			if (isValidElement(child) && predicate(child)) {
				const copy = node.slice()
				copy.splice(i, 0, element)
				return copy
			}

			const result = insert(child, predicate, element)
			if (result === NotFound) continue

			const copy = node.slice()
			copy[i] = result
			return copy
		}

		return NotFound
	}

	if (!isValidElement<{ children?: ReactNode }>(node)) return NotFound

	const children = node.props.children
	if (children == null) return NotFound

	// Single child, so there is no array to insert into yet
	if (isValidElement(children) && predicate(children))
		return withChildren(node, [element, children])

	const result = insert(children, predicate, element)
	if (result === NotFound) return NotFound

	return withChildren(node, result)
}

/**
 * Finds the first element in a tree matching `predicate`.
 */
export function findElement<P>(
	tree: ReactNode,
	predicate: (element: ReactElement<any>) => boolean,
): ReactElement<P> | undefined {
	if (Array.isArray(tree)) {
		for (const child of tree) {
			const result = findElement<P>(child, predicate)
			if (result) return result
		}

		return
	}

	if (!isValidElement<{ children?: ReactNode }>(tree)) return
	if (predicate(tree)) return tree as ReactElement<P>

	return findElement<P>(tree.props.children, predicate)
}

function withChildren(element: ReactElement, children: ReactNode) {
	// Passed as separate arguments, so React treats them as static children, like the original JSX did
	return Array.isArray(children)
		? cloneElement(element, undefined, ...children)
		: cloneElement(element, undefined, children)
}

const wrappedComponents = new WeakMap<FC<any>, FC<any>>()

/**
 * Wraps a plain function component to transform its output.
 * The wrapper is cached, so the same component type is returned every time and React never remounts it.
 */
export function wrapComponent<P extends object>(
	Component: FC<P>,
	transform: (tree: ReactNode, props: P) => ReactNode,
): FC<P> {
	let Wrapped = wrappedComponents.get(Component) as FC<P> | undefined

	if (!Wrapped) {
		Wrapped = props => transform(Component(props) as ReactNode, props)
		wrappedComponents.set(Component, Wrapped)
	}

	return Wrapped
}
