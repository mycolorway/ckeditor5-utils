/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import removePrefix from '../src/removeprefix';

describe( 'removePrefix()', () => {
	it( 'removes a prefix from the beginning of string', () => {
		expect( removePrefix( 'foo:bar', 'foo:' ) ).to.be.equal( 'bar' );
	} );

	it( 'doesn\'t remove multiple occurrences of prefix', () => {
		expect( removePrefix( 'foo:foo:foo:bar', 'foo:' ) ).to.be.equal( 'foo:foo:bar' );
	} );

	it( 'doesn\'t remove prefix from the middle of a string', () => {
		expect( removePrefix( 'baz foo:bar', 'foo:' ) ).to.be.equal( 'baz foo:bar' );
	} );
} );
