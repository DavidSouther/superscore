//     superscore core.js 0.2.0
//     (c) 2012 David Souther
//     superscore is freely distributable under the MIT license.
//     For all details and documentation:
//     https://github.com/DavidSouther/superscore

(function(_, $){
"use strict";

// ### Underscore Utilities
_.mixin({
	// The default underscore indexOf uses a literal value; we often want to use an comparator. This function returns the index of the first element in the list that the comparator returns truthy when evaluating, or -1 if no elements match.
	indexBy: function(list, func) {
		list = list || []; func = func || function(){return false;};
		for (var i = 0, l = list.length; i < l; i++) {
			if (func(list[i])){ return i; }
		}
		return -1;
	},
	// noop
	noop: function(){}
});
}.call(this, _, jQuery));