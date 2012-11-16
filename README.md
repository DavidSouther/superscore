Superscore provides a variety of extensions to [Underscore](http://underscorejs.org). Underscore's fantastic support for collection and data structure handling in Javascript is the best of any library today, bar none. These functions in Superscore aim to provide further snippets of commonly used functionality, including callback chains, eventing, and other small but often-needed tools.

## Extensions ##

### [Core](https://github.com/DavidSouther/superscore/blob/master/src/core.js) ###
Minor missing extensions. [Annotated Source](http://davidsouther.github.com/superscore/docs/core.html)
* Object property paths
* Deep extends
* Index By
* Function locking (no reentry)
* and more

### [Deferred](https://github.com/DavidSouther/superscore/blob/master/src/deferred.js) ###
The Callbacks and Deferred library from jQuery. Callbacks chains provide an easy way to register multiple functions where traditionally a single callback would be provided. Deferreds provide a semantic extension on callbacks representing the completion of asynchronous events. Together, they can increase functionality of nearly any library with almost no additions to their API. [Annotated Source](http://davidsouther.github.com/superscore/docs/deferred.html)

### [PubSub](https://github.com/DavidSouther/superscore/blob/master/src/pubsub.js) ###
A full pubsub library for general messaging. Provides both raw messaging channels, as well as attaching event delegates to any arbitrary object. When jQuery is present, full browser event functionality is included. [Annotated Source](http://davidsouther.github.com/superscore/docs/pubsub.html)

### [Request](https://github.com/DavidSouther/superscore/blob/master/src/request.ls) ###
Http Request library that works on both Node and in the browser. Requires deferreds. [Annotated Source](http://davidsouther.github.com/superscore/docs/ajax.html)

### [UUID](https://github.com/DavidSouther/superscore/blob/master/src/uuid.js) ###
UUID v4 & v5, as well as Sha1 and Utf8 tools. [Annotated Source](http://davidsouther.github.com/superscore/docs/uuid.html)

## Usage ##
In the browser, include the compiled sources using github as a CDN after Underscore itself. For jQuery functionality, include jQuery core before superscore as well.

On the server, `npm install superscore` or include superscore in `package.json`'s `dependencies`.

### Debug ###
https://raw.github.com/DavidSouther/superscore/master/lib/superscore.js

### Production ###
https://raw.github.com/DavidSouther/superscore/master/lib/superscore.min.js
