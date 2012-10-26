//     superscore core.js 0.2.5
//     (c) 2012 David Souther
//     superscore is freely distributable under the MIT license.
//     For all details and documentation:
//     https://github.com/DavidSouther/superscore

(function(underscore, $){
// Missing from Underscore.
underscore.mixin({
	// ### indexBy*(list, func)*
	// The default underscore indexOf uses a literal value; we often want to use an comparator. This function returns the index of the first element in the list that the comparator returns truthy when evaluating, or -1 if no elements match.
	indexBy: function(list, func) {
		list = list || []; func = func || function(){return false;};
		for (var i = 0, l = list.length; i < l; i++) {
			if (func(list[i])){ return i; }
		}
		return -1;
	},

	// ### noop
	noop: function(){},

	// ### symmetricDifference*(set1, set2[, ...setN])*
	// The symmetric of two sets is is the set of elements in either set, but not their intersection.
	// If two sets are equal, the symmetric difference is empty.
	symmetricDifference: function(){
		return underscore.reduce(arguments, function(first, second){
			return underscore.union(
				underscore.difference(first, second),
				underscore.difference(second, first)
			);
		});
	},

	// ### deep*(object, path[, value[, overwrite]])*
	// Follow a path deep into an object, creating intermediate objects or arrays as necessary.
	// If value is specified, sets the value of that key if unset. If overwrite is true, sets
	// even if the value is already set. Returns the root object on set, or the current value
	// on get.
	deep: function(object, path, value, overwrite){
		overwrite = overwrite || false;
		value = value || null;

		// Break the path, if it's not already an array.
		path = underscore.isString(path) ? path.split('.') : underscore.isArray(path) ? path : [];
		// Get the next step
		var part = path.shift();
		// Different behavior depending on if we're at the last step
		if(path.length) {
			// More children, so make sure there's a container at the next level
			if(!object[part]){
				object[part] = !underscore.isNaN(+path[0]) ? [] : {};
			}
			// Recurse, returning either the object or the old value
			var next = underscore.deep(object[part], path, value, overwrite);
			return value ? object : next;
		} else {
			// If no value, return the part.
			if(!value){
				return object[part];
			} else {
				object[part] = overwrite ? value : (object[part] || value);
				return object;
			}
		}
	}
});

// ## Underscore Utilities
underscore._extend = underscore.extend;
var hasOwn = Object.prototype.hasOwnProperty;

// ### Underscore's extend doesn't do deep extension. Use jQuery's (^c/^v from jQuery core).
underscore.extend = function() {
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
	if ( typeof target !== "object" && !underscore.isFunction(target) ) {
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
				if ( deep && copy && ( underscore.isPlainObject(copy) || (copyIsArray = underscore.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && underscore.isArray(src) ? src : [];

					} else {
						clone = src && underscore.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = underscore.extend( deep, clone, copy );

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
underscore.isPlainObject = function( obj ) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if ( !obj || !underscore.isObject(obj) || obj.nodeType || underscore.isWindow( obj ) ) {
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

underscore.isWindow = $ ? $.isWindow : function( obj ) {
	return obj !== null && obj === obj.window;
};

underscore.lock = function( fn ) {
	return function(){
		var ret, ex;
		if(!fn.__locked){
			fn.__locked = true;
			try {
			ret = fn.apply(this, arguments);
			} catch (e){
				ex = e;
			}
		}
		fn.__locked = false;
		if(ex){
			throw ex;
		} else {
			return ret;
		}
	};
};

}).call(this, underscore, (typeof $ !== 'undefined' && $));
