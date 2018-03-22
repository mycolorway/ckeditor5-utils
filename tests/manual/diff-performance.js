/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global performance, console, document, setTimeout */

import diff from '../../src/diff';
import diffToChanges from '../../src/difftochanges';

const text1 = document.querySelector( '#text1' ).innerHTML;
const text2 = document.querySelector( '#text2' ).innerHTML;
const text1Length = text1.length;
const text2Length = text2.length;

// Postpone execution so the test page will render before running testing script.
setTimeout( () => {
	const testResults = {};
	for ( const length of [ 1, 0.75, 0.5, 0.25, 0.18, 0.1, 0.05 ] ) {
		const text1Test = text1.substring( 0, Math.round( text1Length * length ) );
		const text1TestLength = text1Test.length;

		testResults[ text1TestLength ] = {
			'delete': {},
			'insert': {},
			'replace': {}
		};

		console.group( `Text length: ${ text1TestLength }` );

		let title, newText, newLength;

		for ( const textLength of [ 0.9, 0.5, 0.1, 0.01 ] ) {
			// DELETE
			// Simulate deleting text - delete 10%, 50%, 90%, 99% of the initial text.
			testResults[ text1TestLength ].delete[ textLength ] = {};

			newLength = ~~( text1TestLength * textLength );

			// Deleting at end.
			title = `Delete end: ${ ( 1 - textLength ) * 100 }%`;
			newText = text1Test.substring( 0, newLength );
			testResults[ text1TestLength ].delete[ textLength ].end = testDiff( title, text1Test, newText );

			// Deleting in the middle.
			title = `Delete middle: ${ ( 1 - textLength ) * 100 }%`;
			newText = text1Test.substring( 0, ~~( newLength / 2 ) ) + text1Test.substring( text1TestLength - ~~( newLength / 2 ) );
			testResults[ text1TestLength ].delete[ textLength ].middle = testDiff( title, text1Test, newText );

			// INSERT
			// Simulate inserting text of various lengths.
			testResults[ text1TestLength ].insert[ textLength ] = {};

			newLength = ~~( text2Length * textLength );

			// Inserting at end.
			title = `Insert end: ${ ( 1 - textLength ) * 100 }%`;
			newText = text1Test + text2.substring( 0, newLength );
			testResults[ text1TestLength ].insert[ textLength ].end = testDiff( title, text1Test, newText );

			// Inserting in the middle.
			title = `Insert middle: ${ ( 1 - textLength ) * 100 }%`;
			newText = text1Test.substring( 0, ~~( text1TestLength / 2 ) ) + text2.substring( 0, newLength ) +
				text1Test.substring( ~~( text1TestLength / 2 ) );
			testResults[ text1TestLength ].insert[ textLength ].middle = testDiff( title, text1Test, newText );

			// REPLACE
			// Simulate replacing parts of text with various lengths strings.
			testResults[ text1TestLength ].replace[ textLength ] = {};

			newLength = ~~( text2Length * textLength );

			if ( newLength < text1TestLength ) {
				// Replacing at end.
				title = `Replace end: ${ ( 1 - textLength ) * 100 }%`;
				newText = text1Test.substring( 0, text1TestLength - newLength ) + text2.substring( 0, newLength );
				testResults[ text1TestLength ].replace[ textLength ].end = testDiff( title, text1Test, newText, newLength );

				// Replacing in the middle.
				title = `Replace middle: ${ ( 1 - textLength ) * 100 }%`;
				newText = text1Test.substring( 0, ~~( text1TestLength / 2 - newLength / 2 ) ) + text2.substring( 0, newLength ) +
					text1Test.substring( ~~( text1TestLength / 2 + newLength / 2 ) );
				testResults[ text1TestLength ].replace[ textLength ].middle = testDiff( title, text1Test, newText, newLength );
			} else {
				testResults[ text1TestLength ].replace[ textLength ].end = false;
				testResults[ text1TestLength ].replace[ textLength ].middle = false;
			}
		}

		console.groupEnd( `Text length: ${ text1TestLength }` );
	}
	presentResults( testResults );
}, 1000 );

// HELPERS
function testDiff( title, actualText, expectedText, replaceLength ) {
	console.group( title );

	const result = measureExecTime( actualText, expectedText );

	console.log( `new length ${ expectedText.length }` );
	console.log( `diff ${ result.diff.avg }ms` );
	console.log( `diffToChanges ${ result.diffToChanges.avg }ms` );

	console.groupEnd( title );

	result.actualText = actualText;
	result.expectedText = expectedText;

	if ( replaceLength ) {
		result.replaceLength = replaceLength;
	}

	return result;
}

function measureExecTime( actualText, expectedText ) {
	const diffR = getResultAggregator();
	const diff2R = getResultAggregator();

	let start, result;
	for ( let i = 0; i < 10; i++ ) {
		start = performance.now();
		result = diff( actualText, expectedText );
		diffR.add( performance.now() - start );

		start = performance.now();
		diffToChanges( result, expectedText );
		diff2R.add( performance.now() - start );
	}

	return {
		'diff': diffR,
		'diffToChanges': diff2R
	};
}

function getResultAggregator() {
	const aggregator = {
		min: null,
		max: null,
		avg: null,
		add: result => {
			if ( aggregator.min === null ) {
				aggregator.min = result;
			}
			if ( aggregator.max === null ) {
				aggregator.max = result;
			}
			if ( aggregator.avg === null ) {
				aggregator.avg = result;
			}

			if ( result < aggregator.min ) {
				aggregator.min = result;
			} else if ( result > aggregator.max ) {
				aggregator.max = result;
			}

			aggregator.avg = ( aggregator.avg + result ) / 2;
		}
	};
	return aggregator;
}

function presentResults( results ) {
	console.log( 'Results:', results );

	let html = '';
	let operationHtml, resultHtml, result;

	for ( const textLength in results ) {
		html += `<h2>Initial text length: ${ textLength }</h2>`;
		operationHtml = '';

		for ( const operation in results[ textLength ] ) {
			const data = results[ textLength ][ operation ];

			if ( operation === 'delete' ) {
				resultHtml = '';

				for ( const operationLength in data ) {
					result = data[ operationLength ];

					resultHtml += `<li>${ result.end.actualText.length - result.end.expectedText.length } characters at ` +
						`the end ${ printTime( result.end.diff, 'diff' ) }</li>`;
					resultHtml += `<li>${ result.middle.actualText.length - result.middle.expectedText.length } characters ` +
						`in the middle ${ printTime( result.middle.diff, 'diff' ) }</li>`;
				}
				operationHtml += `<li>Deleted: <ul>${ resultHtml }</ul></li>`;
			} else if ( operation === 'insert' ) {
				resultHtml = '';

				for ( const operationLength in data ) {
					result = data[ operationLength ];

					resultHtml += `<li>${ result.end.expectedText.length - result.end.actualText.length } characters at ` +
						`the end ${ printTime( result.end.diff, 'diff' ) }</li>`;
					resultHtml += `<li>${ result.middle.expectedText.length - result.middle.actualText.length } characters ` +
						`in the middle ${ printTime( result.middle.diff, 'diff' ) }</li>`;
				}
				operationHtml += `<li>Inserted: <ul>${ resultHtml }</ul></li>`;
			} else if ( operation === 'replace' ) {
				resultHtml = '';

				for ( const operationLength in data ) {
					result = data[ operationLength ];

					if ( result.end !== false && result.middle !== false ) {
						resultHtml += `<li>${ result.end.replaceLength } characters at the end ` +
							`${ printTime( result.end.diff, 'diff' ) }</li>`;
						resultHtml += `<li>${ result.middle.replaceLength } characters in the middle ` +
							`${ printTime( result.middle.diff, 'diff' ) }</li>`;
					}
				}
				operationHtml += `<li>Replaced: <ul>${ resultHtml }</ul></li>`;
			}
		}

		html += `<ul>${ operationHtml }</ul>`;
	}

	document.querySelector( '#results' ).innerHTML = html;
}

function printTime( result, label ) {
	let color = 'transparent';
	if ( result.avg > 100 ) {
		color = '#ff0000';
	} else if ( result.avg > 50 ) {
		color = '#ff4b4b';
	} else if ( result.avg > 20 ) {
		color = '#fe8282';
	} else if ( result.avg > 10 ) {
		color = '#febebe';
	}
	return `<p style="background-color:${ color };">${ label } - AVG: ${ result.avg.toFixed( 2 ) }ms, ` +
		`MIN: ${ result.min.toFixed( 2 ) }ms, MAX: ${ result.max.toFixed( 2 ) }ms</p>`;
}
