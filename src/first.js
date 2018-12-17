/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module utils/first
 */

/**
 * Returns first item of the given `iterator`.
 *
 * @template T
 * @param {Iterator.<T>} iterator
 * @returns {T}
 */
export default function first( iterator ) {
	const iteratorItem = iterator.next();

	if ( iteratorItem.done ) {
		return null;
	}

	return iteratorItem.value;
}
