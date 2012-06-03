//     superscore pubsub.js 0.2.0
//     (c) 2012 David Souther
//     superscore is freely distributable under the MIT license.
//     For all details and documentation:
//     https://github.com/DavidSouther/superscore

(function(_, $){
"use strict";

// #### Pubsub with jQuery-backed eventing.
_.mixin({
	// #### PubSub
	// Register a function to get called when a certain event is published.
	on: function(obj, event, callback) {
		// Use jQuery to handle DOM events.
		if(_.isElement(obj) && $){return $(obj).on(event, callback); }

		// Use internal handler for pubsub
		if(this.isString(obj)) {callback = event; event = obj; obj = this; }

		if(this.isUndefined(obj.__event_handlers)){ obj.__event_handlers = {}; }
		if (!(event in obj.__event_handlers)){ obj.__event_handlers[event] = []; }
		obj.__event_handlers[event].push(callback);
		return this;
	},
	// Register a function that will be called a single time when the event is published.
	once: function(obj, event, callback) {
		// Use jQuery to handle DOM events.
		if(_.isElement(obj) && $){return $(obj).one(event, callback); }

		var removeEvent = function() { _.removeEvent(obj, event); };
		callback = _.compose(removeEvent, callback);

		// Register normally
		this.on(obj, event, callback);
	},
	// Publish an event, passing args to each function registered.
	trigger: function(obj, event, args) {
		// Use jQuery to handle DOM events.
		if(_.isElement(obj) && $){return $(obj).trigger(event, args); }

		// Use internal handler for pubsub
		if(this.isString(obj)) {args = event; event = obj; obj = this; }

		if(this.isUndefined(obj._events)){ return; }
		if (event in obj.__event_handlers) {
			var events = obj.__event_handlers[event].concat();
			for (var i = 0, ii = events.length; i < ii; i++) {
				events[i].apply(obj, args === undefined ? [] : args);
			}
		}
		return this;
	},
	// Remove a certain callback from an event chain.
	off: function(obj, event, callback) {
		// Use jQuery to handle DOM events.
		if(_.isElement(obj) && $){ return $(obj).off(event, callback); }

		// Use internal handler for pubsub
		if(this.isString(obj)) { event = obj; obj = this; }

		if(this.isUndefined(obj.__event_handlers)){ return; }
		obj.__event_handlers = _.filter(obj.__event_handlers, function(cb){
			return (cb.toString() === callback.toString());// TODO Make this smarter
		});
		return this;
	}
});

}.call(this, _, jQuery || null));