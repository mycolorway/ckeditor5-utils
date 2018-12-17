import { Priority } from './Priority';
import EventInfo from './eventinfo';

/**
 * Emitter/listener interface.
 *
 * Can be easily implemented by a class by mixing the {@link module:utils/emittermixin~EmitterMixin} mixin.
 */
export interface Emitter {
	/**
	 * Registers a callback function to be executed when an event is fired.
	 *
	 * Shorthand for {@link #listenTo `this.listenTo( this, event, callback, options )`} (it makes the emitter
	 * listen on itself).
	 *
	 * @method #on
	 * @param {String} event The name of the event.
	 * @param {Function} callback The function to be called on event.
	 * @param {Object} [options={}] Additional options.
	 * @param {Priority} [options.priority='normal'] The priority of this event callback. The higher
	 * the priority value the sooner the callback will be fired. Events having the same priority are called in the
	 * order they were added.
	 */
	on( event: string, callback: Function, options?: { priority?: Priority } ): void;

	/**
	 * Registers a callback function to be executed on the next time the event is fired only. This is similar to
	 * calling {@link #on} followed by {@link #off} in the callback.
	 *
	 * @param {String} event The name of the event.
	 * @param {Function} callback The function to be called on event.
	 * @param {Object} [options={}] Additional options.
	 * @param {Priority} [options.priority='normal'] The priority of this event callback. The higher
	 * the priority value the sooner the callback will be fired. Events having the same priority are called in the
	 * order they were added.
	 */

	/**
	 * Stops executing the callback on the given event.
	 * Shorthand for {@link #stopListening `this.stopListening( this, event, callback )`}.
	 *
	 * @param {String} event The name of the event.
	 * @param {Function} callback The function to stop being called.
	 */
	off( event: string, callback: Function ): void;

	/**
	 * Registers a callback function to be executed when an event is fired in a specific (emitter) object.
	 *
	 * Events can be grouped in namespaces using `:`.
	 * When namespaced event is fired, it additionally fires all callbacks for that namespace.
	 *
	 *		// myEmitter.on( ... ) is a shorthand for myEmitter.listenTo( myEmitter, ... ).
	 *		myEmitter.on( 'myGroup', genericCallback );
	 *		myEmitter.on( 'myGroup:myEvent', specificCallback );
	 *
	 *		// genericCallback is fired.
	 *		myEmitter.fire( 'myGroup' );
	 *		// both genericCallback and specificCallback are fired.
	 *		myEmitter.fire( 'myGroup:myEvent' );
	 *		// genericCallback is fired even though there are no callbacks for "foo".
	 *		myEmitter.fire( 'myGroup:foo' );
	 *
	 * An event callback can {@link EventInfo#stop stop the event} and
	 * set the {@link EventInfo#return return value} of the {@link #fire} method.
	 *
	 * @param {Emitter} emitter The object that fires the event.
	 * @param {String} event The name of the event.
	 * @param {Function} callback The function to be called on event.
	 * @param {Object} [options={}] Additional options.
	 * @param {Priority} [options.priority='normal'] The priority of this event callback. The higher
	 * the priority value the sooner the callback will be fired. Events having the same priority are called in the
	 * order they were added.
	 */
	listenTo( emitter: Emitter, event: string, callback: Function, options?: { priority?: Priority } ): void;

	/**
	 * Stops listening for events. It can be used at different levels:
	 *
	 * * To stop listening to a specific callback.
	 * * To stop listening to a specific event.
	 * * To stop listening to all events fired by a specific object.
	 * * To stop listening to all events fired by all objects.
	 *
	 * @param {Emitter} [emitter] The object to stop listening to. If omitted, stops it for all objects.
	 * @param {String} [event] (Requires the `emitter`) The name of the event to stop listening to. If omitted, stops it
	 * for all events from `emitter`.
	 * @param {Function} [callback] (Requires the `event`) The function to be removed from the call list for the given
	 * `event`.
	 */
	stopListening( emitter: Emitter, event?: string, callback?: Function ): void;

	/**
	 * Fires an event, executing all callbacks registered for it.
	 *
	 * The first parameter passed to callbacks is an {@link EventInfo} object,
	 * followed by the optional `args` provided in the `fire()` method call.
	 *
	 * @param {String|EventInfo} eventOrInfo The name of the event or `EventInfo` object if event is delegated.
	 * @param {...*} [args] Additional arguments to be passed to the callbacks.
	 * @returns {*} By default the method returns `undefined`. However, the return value can be changed by listeners
	 * through modification of the {@link EventInfo#return `evt.return`}'s property (the event info
	 * is the first param of every callback).
	 */
	fire( eventInfo: string | EventInfo, ...args: any[] ): any;

	/**
	 * Delegates selected events to another {@link module:utils/emittermixin~Emitter}. For instance:
	 *
	 *		emitterA.delegate( 'eventX' ).to( emitterB );
	 *		emitterA.delegate( 'eventX', 'eventY' ).to( emitterC );
	 *
	 * then `eventX` is delegated (fired by) `emitterB` and `emitterC` along with `data`:
	 *
	 *		emitterA.fire( 'eventX', data );
	 *
	 * and `eventY` is delegated (fired by) `emitterC` along with `data`:
	 *
	 *		emitterA.fire( 'eventY', data );
	 *
	 * @param {...String} events Event names that will be delegated to another emitter.
	 * @returns {EmitterMixinDelegateChain}
	 */
	delegate( ...events: string[] ): any

	/**
	 * Stops delegating events. It can be used at different levels:
	 *
	 * * To stop delegating all events.
	 * * To stop delegating a specific event to all emitters.
	 * * To stop delegating a specific event to a specific emitter.
	 *
	 * @param {String} [event] The name of the event to stop delegating. If omitted, stops it all delegations.
	 * @param {Emitter} [emitter] (requires `event`) The object to stop delegating a particular event to.
	 * If omitted, stops delegation of `event` to all emitters.
	 */
	stopDelegating( event?: string, emitter?: Emitter ): void;
}

/**
 * The return value of {@link ~Emitter#delegate}.
 */
export interface EmitterMixinDelegateChain {
	/**
	 * Selects destination for {@link ~Emitter#delegate} events.
	 *
	 * @method #to
	 * @param {Emitter} emitter An `EmitterMixin` instance which is the destination for delegated events.
	 * @param {String|Function} [nameOrFunction] A custom event name or function which converts the original name string.
	 */
	to( emitter: Emitter, nameOrFunction?: string | Function );
}
