//     superscore ajax.js 0.2.0
//     (c) 2012 David Souther
//     superscore is freely distributable under the MIT license.
//     For all details and documentation:
//     https://github.com/DavidSouther/superscore

(function(_, $){
"use strict";

// ## Ajax, through jQuery if possible.
var ajax = $ ? $.ajax : function (options){
	var xhr, XHR, d = _.Deferred();

	// Nice clean way to get an xhr
	XHR = window.ActiveXObject || XMLHttpRequest;
	xhr = new XHR('Microsoft.XMLHTTP');

	// Probably a GET requst, unless there is data or something else is specified.
	xhr.open(options.type || (options.data ? 'POST' : 'GET'), options.url, true);

	// Most likely sending text/plain
	if ('overrideMimeType' in xhr) {
		xhr.overrideMimeType(options.dataType || 'text/plain');
	}

	// Handle state changes.
	xhr.onreadystatechange = function() {
		var _ref;
		if (xhr.readyState === 4) {
			if ((_ref = xhr.status) === 0 || _ref === 200) {
				// Resolve on success.
				d.resolve(xhr.responseText);
			} else {
				// Reject on failure.
				d.reject(new Error("Could not load " + options.url));
			}
			return;
		}
		// Notify for any other events.
		d.notify(xhr);
	};

	// We'll need to set headers to send the data.
	if(options.data){
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Content-length", options.data.length);
		xhr.setRequestHeader("Connection", "close");
	}

	// Execute the request.
	xhr.send(options.data || null);

	// No need to return the entire XHR request.
	return d.promise();
};

// ### get*(url[, options])*
// Shorthand for a GET request.
var get = $ ? $.get : function(url, options){
	options = options || {};
	options.url = url;
	options.type = 'GET';
	options.data = null;
	return _.ajax(options);
};

// ### post*(url[, options])*
// Shorthand for a POST request.
var post = $ ? $.post : function(url, options){
	options = options || {};
	options.url = url;
	options.type = 'POST';
	return _.ajax(options);
};

// Add these to underscore.
_.mixin({
	ajax: ajax,
	get: get,
	post: post
});


}.call(this, _, jQuery || null));

/*global window:false, XMLHttpRequest:false*/
