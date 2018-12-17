/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module utils/spy
 */

/** @typedef {import('./SpyInterface').Spy} Spy */

/**
 * Creates a spy function (ala Sinon.js) that can be used to inspect call to it.
 *
 * The following are the present features:
 *
 * * spy.called: property set to `true` if the function has been called at least once.
 *
 * @returns {Spy} The spy function.
 */
function spy() {
	function f() {
		const fn = /** @type Spy */ ( f );

		fn.called = true;
	}

	return /** @type Spy */ ( f );
}

export default spy;
