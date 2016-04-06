/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

import utils from './utils.js';

/**
 * The event object passed to event callbacks. It is used to provide information about the event as well as a tool to
 * manipulate it.
 *
 * @memberOf utils
 */
export default class EventInfo {
	constructor( source, name, priority ) {
		/**
		 * The object that fired the event.
		 *
		 * @member {Object} utils.EventInfo#source
		 */
		this.source = source;

		/**
		 * The event name.
		 *
		 * @member {String} utils.EventInfo#name
		 */
		this.name = name;

		/**
		 * The event priority.
		 *
		 * @member {Number} utils.EventInfo#priority
		 */
		this.priority = priority;

		// The following methods are defined in the constructor because they must be re-created per instance.

		/**
		 * Stops the event emitter to call further callbacks for this event interaction.
		 *
		 * @method utils.EventInfo#stop
		 */
		this.stop = utils.spy();

		/**
		 * Removes the current callback from future interactions of this event.
		 *
		 * @method utils.EventInfo#off
		 */
		this.off = utils.spy();
	}
}
