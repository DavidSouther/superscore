//     superscore pubsub.js 0.2.3
//     (c) 2012 David Souther
//     superscore is freely distributable under the MIT license.
//     For all details and documentation:
//     https://github.com/DavidSouther/superscore

(function(underscore, $){
// ## Pubsub with jQuery-backed eventing
// This eventing library uses pubsub channels attached to specific object instances.
// If a channel is used with an object, it becomes associated implicitly with that object.
// If a channel is used without an object, it is in the global pubsub scope.
underscore.mixin({
	// ### on*([object, ]event, callback)*
	// Register a function to get called when a certain event is published.
	// Any event handlers attached after an event has been triggered at least once will
	// immediately be called with the most recently triggered value.
	on: function(obj, event, callback) {
		// Use jQuery to handle DOM events.
		if(underscore.isElement(obj) && $){return $(obj).on(event, callback); }

		// Use internal handler for pubsub
		if(this.isString(obj)) {callback = event; event = obj; obj = this; }

		// Ensure a container is available for all events.
		if(!this.isObject(obj.__event_handlers)){ obj.__event_handlers = {}; }
		// Ensure a handler is available for this particular event.
		if (!(event in obj.__event_handlers)) {
			// Using a memory callback
			obj.__event_handlers[event] = underscore.Callbacks("memory");
		}
		obj.__event_handlers[event].add(callback);
		return this;
	},
	// ### once*([object, ]event, callback)*
	// Register a function that will be called a single time when the event is published.
	once: function(obj, event, callback) {
		// Use jQuery to handle DOM events.
		if(underscore.isElement(obj) && $){return $(obj).one(event, callback); }

		// Turn the callback into a callback that will remove itself after getting execute.
		var removeEvent = function() { underscore.off(obj, event, callback); };
		callback = underscore.compose(removeEvent, callback);

		// Register the self-removing callback normally.
		this.on(obj, event, callback);
	},
	// ### trigger*([object, ]event, args)*
	// Publish an event, passing args to each function registered. Each callback will
	// be executed with `obj` as their `this` context.
	trigger: function(obj, event, args) {
		// Use jQuery to handle DOM events.
		if(underscore.isElement(obj) && $){return $(obj).trigger(event, args); }

		// Use internal handler for pubsub
		if(this.isString(obj)) {args = event; event = obj; obj = this; }

		// If there aren't any handlers for this event, don't do anything.
		if(this.isObject(obj.__event_handlers) && event in obj.__event_handlers) {
			obj.__event_handlers[event].fireWith(obj, args);
		}
		return this;
	},
	// ### off*([object, ]event, callback)*
	// Remove a certain callback from an event chain.
	off: function(obj, event, callback) {
		// Use jQuery to handle DOM events.
		if(underscore.isElement(obj) && $){ return $(obj).off(event, callback); }

		// Use internal handler for pubsub
		if(this.isString(obj)) { event = obj; obj = this; }

		// If there aren't any handlers for this event, don't do anything.
		if(this.isObject(obj.__event_handlers) && event in obj.__event_handlers) {
			obj.__event_handlers[event].remove(callback);
		}
		return this;
	}
});

}).call(this, underscore, typeof $ !== 'undefined' && $);
