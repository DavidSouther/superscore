// superscore - v0.1.0 - 2012-06-03
// https://github.com/DavidSouther/superscore
// Copyright (c) 2012 David Souther; Licensed MIT

//     superscore ajax.js 0.1.0
//     (c) 2012 David Souther
//     superscore is freely distributable under the MIT license.
//     For all details and documentation:
//     https://github.com/DavidSouther/superscore

(function(_, $){
"use strict";

// #### Ajax, through jQuery if possible.
var ajax = $ ? $.ajax : function (options){
	var xhr, d = _.Deferred();
	// Nice clean way to get an xhr
	xhr = new (window.ActiveXObject || XMLHttpRequest)('Microsoft.XMLHTTP');
	xhr.open(options.type || 'GET', options.url, true);
	if ('overrideMimeType' in xhr) {
		xhr.overrideMimeType(options.dataType || 'text/plain');
	}
	xhr.onreadystatechange = function() {
		var _ref;
		if (xhr.readyState === 4) {
			if ((_ref = xhr.status) === 0 || _ref === 200) {
				d.resolve(xhr.responseText);
			} else {
				d.reject(new Error("Could not load " + options.url));
			}
			return;
		}
		d.notify(xhr);
	};

	if(options.data){
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Content-length", options.data.length);
		xhr.setRequestHeader("Connection", "close");
	}

	xhr.send(options.data || null);

	return d.promise();
};

var get = $ ? $.get : function(url, options){
	options = options || {};
	options.url = url;
	options.type = 'GET';
	options.data = null;
	return _.ajax(options);
};

var post = $ ? $.post : function(url, options){
	options = options || {};
	options.url = url;
	options.type = 'POST';
	return _.ajax(options);
};

_.mixin({
	ajax: ajax,
	get: get,
	post: post
});


}.call(this, _, jQuery || null));
//     superscore deferred.js 0.1.0
//     (c) 2012 David Souther
//     superscore is freely distributable under the MIT license.
//     For all details and documentation:
//     https://github.com/DavidSouther/superscore

(function(_, $){

	// // Let's borrow a couple of things from Underscore that we'll need

	// // _.each
	// var breaker = {},
	// 		AP = Array.prototype,
	// 		OP = Object.prototype,

	// 		hasOwn = OP.hasOwnProperty,
	// 		toString = OP.toString,
	// 		forEach = AP.forEach,
	// 		slice = AP.slice;

	// var _each = function( obj, iterator, context ) {
	// 	var key, i, l;

	// 	if ( !obj ) {
	// 		return;
	// 	}
	// 	if ( forEach && obj.forEach === forEach ) {
	// 		obj.forEach( iterator, context );
	// 	} else if ( obj.length === +obj.length ) {
	// 		for ( i = 0, l = obj.length; i < l; i++ ) {
	// 			if ( i in obj && iterator.call( context, obj[i], i, obj ) === breaker ) {
	// 				return;
	// 			}
	// 		}
	// 	} else {
	// 		for ( key in obj ) {
	// 			if ( hasOwn.call( obj, key ) ) {
	// 				if ( iterator.call( context, obj[key], key, obj) === breaker ) {
	// 					return;
	// 				}
	// 			}
	// 		}
	// 	}
	// };

	// // _.isFunction
	// var _isFunction = function( obj ) {
	// 	return !!(obj && obj.constructor && obj.call && obj.apply);
	// };

	// // _.extend
	// var _extend = function( obj ) {

	// 	_each( slice.call( arguments, 1), function( source ) {
	// 		var prop;

	// 		for ( prop in source ) {
	// 			if ( source[prop] !== void 0 ) {
	// 				obj[ prop ] = source[ prop ];
	// 			}
	// 		}
	// 	});
	// 	return obj;
	// };

	// // And some jQuery specific helpers

	// var class2type = { "[object Array]": "array", "[object Function]": "function" };

	// var _type = function( obj ) {
	// 	return !obj ?
	// 		String( obj ) :
	// 		class2type[ toString.call(obj) ] || "object";
	// };

	// Now start the jQuery-cum-Underscore implementation. Some very
	// minor changes to the jQuery source to get this working.

	// Internal Deferred namespace
	var _d = {};

	var flagsCache = {};
	// Convert String-formatted flags into Object-formatted ones and store in cache
	function createFlags( flags ) {
			var object = flagsCache[ flags ] = {},
					i, length;
			flags = flags.split( /\s+/ );
			for ( i = 0, length = flags.length; i < length; i++ ) {
					object[ flags[i] ] = true;
			}
			return object;
	}

	_d.Callbacks = $ ? $.Callbacks : function( flags ) {

		// Convert flags from String-formatted to Object-formatted
		// (we check in cache first)
		flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

		var // Actual callback list
			list = [],
			// Stack of fire calls for repeatable lists
			stack = [],
			// Last fire value (for non-forgettable lists)
			memory,
			// Flag to know if list was already fired
			fired,
			// Flag to know if list is currently firing
			firing,
			// First callback to fire (used internally by add and fireWith)
			firingStart,
			// End of the loop when firing
			firingLength,
			// Index of currently firing callback (modified by remove if needed)
			firingIndex,
			// Add one or several callbacks to the list
			add = function( args ) {
				var i,
					length,
					elem,
					type,
					actual;
				for ( i = 0, length = args.length; i < length; i++ ) {
					elem = args[ i ];
					type = _type( elem );
					if ( type === "array" ) {
						// Inspect recursively
						add( elem );
					} else if ( type === "function" ) {
						// Add if not in unique mode and callback is not in
						if ( !flags.unique || !self.has( elem ) ) {
							list.push( elem );
						}
					}
				}
			},
			// Fire callbacks
			fire = function( context, args ) {
				args = args || [];
				memory = !flags.memory || [ context, args ];
				fired = true;
				firing = true;
				firingIndex = firingStart || 0;
				firingStart = 0;
				firingLength = list.length;
				for ( ; list && firingIndex < firingLength; firingIndex++ ) {
					if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
						memory = true; // Mark as halted
						break;
					}
				}
				firing = false;
				if ( list ) {
					if ( !flags.once ) {
						if ( stack && stack.length ) {
							memory = stack.shift();
							self.fireWith( memory[ 0 ], memory[ 1 ] );
						}
					} else if ( memory === true ) {
						self.disable();
					} else {
						list = [];
					}
				}
			},
			// Actual Callbacks object
			self = {
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
						var length = list.length;
						add( arguments );
						// Do we need to add the callbacks to the
						// current firing batch?
						if ( firing ) {
							firingLength = list.length;
						// With memory, if we're not firing then
						// we should call right away, unless previous
						// firing was halted (stopOnFalse)
						} else if ( memory && memory !== true ) {
							firingStart = length;
							fire( memory[ 0 ], memory[ 1 ] );
						}
					}
					return this;
				},
				// Remove a callback from the list
				remove: function() {
					if ( list ) {
						var args = arguments,
							argIndex = 0,
							argLength = args.length;
						for ( ; argIndex < argLength ; argIndex++ ) {
							for ( var i = 0; i < list.length; i++ ) {
								if ( args[ argIndex ] === list[ i ] ) {
									// Handle firingIndex and firingLength
									if ( firing ) {
										if ( i <= firingLength ) {
											firingLength--;
											if ( i <= firingIndex ) {
												firingIndex--;
											}
										}
									}
									// Remove the element
									list.splice( i--, 1 );
									// If we have some unicity property then
									// we only need to do this once
									if ( flags.unique ) {
										break;
									}
								}
							}
						}
					}
					return this;
				},
				// Control if a given callback is in the list
				has: function( fn ) {
					if ( list ) {
						var i = 0,
							length = list.length;
						for ( ; i < length; i++ ) {
							if ( fn === list[ i ] ) {
								return true;
							}
						}
					}
					return false;
				},
				// Remove all callbacks from the list
				empty: function() {
					list = [];
					return this;
				},
				// Have the list do nothing anymore
				disable: function() {
					list = stack = memory = undefined;
					return this;
				},
				// Is it disabled?
				disabled: function() {
					return !list;
				},
				// Lock the list in its current state
				lock: function() {
					stack = undefined;
					if ( !memory || memory === true ) {
						self.disable();
					}
					return this;
				},
				// Is it locked?
				locked: function() {
					return !stack;
				},
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( stack ) {
						if ( firing ) {
							if ( !flags.once ) {
								stack.push( [ context, args ] );
							}
						} else if ( !( flags.once && memory ) ) {
							fire( context, args );
						}
					}
					return this;
				},
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};

	_d.Deferred = $ ? $.Deferred : function( func ) {
			var doneList = _d.Callbacks( "once memory" ),
				failList = _d.Callbacks( "once memory" ),
				progressList = _d.Callbacks( "memory" ),
				state = "pending",
				lists = {
						resolve: doneList,
						reject: failList,
						notify: progressList
				},
				promise = {
						done: doneList.add,
						fail: failList.add,
						progress: progressList.add,

						state: function() {
								return state;
						},

						// Deprecated
						isResolved: doneList.fired,
						isRejected: failList.fired,

						then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
								deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
								return this;
						},
						always: function() {
								deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
								return this;
						},
						pipe: function( fnDone, fnFail, fnProgress ) {
								return _d.Deferred(function( newDefer ) {
										_each( {
												done: [ fnDone, "resolve" ],
												fail: [ fnFail, "reject" ],
												progress: [ fnProgress, "notify" ]
										}, function( data, handler ) {
												var fn = data[ 0 ],
														action = data[ 1 ],
														returned;
												if ( _isFunction( fn ) ) {
														deferred[ handler ](function() {
																returned = fn.apply( this, arguments );
																if ( returned && _isFunction( returned.promise ) ) {
																		returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
																} else {
																		newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
																}
														});
												} else {
														deferred[ handler ]( newDefer[ action ] );
												}
										});
								}).promise();
						},
						// Get a promise for this deferred
						// If obj is provided, the promise aspect is added to the object
						promise: function( obj ) {
								if ( !obj ) {
										obj = promise;
								} else {
										for ( var key in promise ) {
												obj[ key ] = promise[ key ];
										}
								}
								return obj;
						}
				},
				deferred = promise.promise({}),
				key;

				for ( key in lists ) {
						deferred[ key ] = lists[ key ].fire;
						deferred[ key + "With" ] = lists[ key ].fireWith;
				}

				// Handle state
				deferred.done( function() {
					state = "resolved";
				}, failList.disable, progressList.lock ).fail( function() {
					state = "rejected";
				}, doneList.disable, progressList.lock );

				// Call given func if any
				if ( func ) {
					func.call( deferred, deferred );
				}

				// All done!
				return deferred;
		};

		// Deferred helper
		_d.when = $ ? $.when : function( firstParam ) {
			var args = slice.call( arguments, 0 ),
				i = 0,
				length = args.length,
				pValues = new Array( length ),
				count = length,
				pCount = length,
				deferred = length <= 1 && firstParam && _isFunction( firstParam.promise ) ?
						firstParam :
						_d.Deferred(),
				promise = deferred.promise();
			function resolveFunc( i ) {
				return function( value ) {
					args[ i ] = arguments.length > 1 ? slice.call( arguments, 0 ) : value;
					if ( !( --count ) ) {
						deferred.resolveWith( deferred, args );
					}
				};
			}
			function progressFunc( i ) {
				return function( value ) {
					pValues[ i ] = arguments.length > 1 ? slice.call( arguments, 0 ) : value;
					deferred.notifyWith( promise, pValues );
				};
			}
			if ( length > 1 ) {
				for ( ; i < length; i++ ) {
					if ( args[ i ] && args[ i ].promise && _isFunction( args[ i ].promise ) ) {
						args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
					} else {
						--count;
					}
				}
				if ( !count ) {
					deferred.resolveWith( deferred, args );
				}
			} else if ( deferred !== firstParam ) {
				deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
			}
			return promise;
		};

	// // Try exporting as a Common.js Module
	// if ( typeof module !== "undefined" && module.exports ) {
	// 	module.exports = _d;

	// // Or mixin to Underscore.js
	// } else if ( typeof root._ !== "undefined" ) {
		// root._.mixin(_d);
		_.mixin(_d);
	// // Or assign it to window._
	// } else {
	// 	root._ = _d;
	// }

}.call(this, _, $));
//     superscore extend.js 0.1.0
//     (c) 2012 David Souther
//     superscore is freely distributable under the MIT license.
//     For all details and documentation:
//     https://github.com/DavidSouther/superscore

(function(_, $){
"use strict";

// ### Underscore Utilities
var old_extend = _.extend,
	hasOwn = Object.prototype.hasOwnProperty;

// #### Underscore's extend doesn't do deep extension. Use jQuery's (c/v)
var extend = $ ? $.extend : function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !_.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) !== null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( _.isPlainObject(copy) || (copyIsArray = _.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && _.isArray(src) ? src : [];

					} else {
						clone = src && _.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = _.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}
	// Return the modified object
	return target;
};
var isPlainObject = $ ? $.isPlainObject : function( obj ) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if ( !obj || _.type(obj) !== "object" || obj.nodeType || _.isWindow( obj ) ) {
		return false;
	}

	try {
		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
	} catch ( e ) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.

	var key;
	for ( key in obj ) {}

	return key === undefined || hasOwn.call( obj, key );
};
var isWindow = $ ? $.isWindow : function( obj ) {
	return obj !== null && obj == obj.window;
};

_.mixin({
	_extend: old_extend,
	extend: extend,
	isPlainObject: isPlainObject,
	isWindow: isWindow
});

}.call(this, _, jQuery || null));
//     superscore pubsub.js 0.1.0
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