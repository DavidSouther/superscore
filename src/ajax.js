//     superscore ajax.js 0.2.0
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