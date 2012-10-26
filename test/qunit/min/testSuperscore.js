/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global _:false, JEFRi:false, isLocal:false*/

(function(){

module("Definitions");

test("Underscore utils", function(){
	ok(_.indexBy && _.noop, "Underscore has additional basics.");
	ok(_.on && _.once && _.off && _.trigger, "Underscore has additional pubsub?");
	ok(_.Deferred && _.Callbacks && _.when, "Underscore has async utils.");
	ok(_.UUID && _.UUID.v4 && _.UUID.v5, "Underscore UUID (4, 5) support.");
});

module("Core");

test("superscore.deep", function(){
	expect(5);

	var a = {a: true, m: {k: 3}};

	equal(_.deep(a, 'a'), true, "Get simple value.");
	equal(_.deep(a, 'b', 1), a, "Set simple value.");
	_.deep(a, 'b', 2, true);
	equal(_.deep(a, 'b'), 2, "Overwrote simple value.");
	equal(_.deep(a, 'm.k'), 3, "Get complex value.");
	_.deep(a, 'q.0.e', 'foo');
	ok(_.isArray(a.q), "Created array intermediary.");
});

test("superscore.extend(Object, Object)", function() {
	expect(28);

	var settings = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		optionsCopy = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		merged = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "x", xxx: "newstring" },
		deep1 = { foo: { bar: true } },
		deep1copy = { foo: { bar: true } },
		deep2 = { foo: { baz: true }, foo2: document },
		deep2copy = { foo: { baz: true }, foo2: document },
		deepmerged = { foo: { bar: true, baz: true }, foo2: document },
		arr = [1, 2, 3],
		nestedarray = { arr: arr };

	_.extend(settings, options);
	deepEqual( settings, merged, "Check if extended: settings must be extended" );
	deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	_.extend(settings, null, options);
	deepEqual( settings, merged, "Check if extended: settings must be extended" );
	deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	_.extend(true, deep1, deep2);
	deepEqual( deep1.foo, deepmerged.foo, "Check if foo: settings must be extended" );
	deepEqual( deep2.foo, deep2copy.foo, "Check if not deep2: options must not be modified" );
	equal( deep1.foo2, document, "Make sure that a deep clone was not attempted on the document" );

	ok( _.extend(true, {}, nestedarray).arr !== arr, "Deep extend of object must clone child array" );

	// #5991
	ok( _.isArray( _.extend(true, { arr: {} }, nestedarray).arr ), "Cloned array heve to be an Array" );
	ok( _.isPlainObject( _.extend(true, { arr: arr }, { arr: {} }).arr ), "Cloned object heve to be an plain object" );

	var empty = {};
	var optionsWithLength = { foo: { length: -1 } };
	_.extend(true, empty, optionsWithLength);
	deepEqual( empty.foo, optionsWithLength.foo, "The length property must copy correctly" );

	empty = {};
	var optionsWithDate = { foo: { date: new Date } };
	_.extend(true, empty, optionsWithDate);
	deepEqual( empty.foo, optionsWithDate.foo, "Dates copy correctly" );

	var myKlass = function() {};
	var customObject = new myKlass();
	var optionsWithCustomObject = { foo: { date: customObject } };
	empty = {};
	_.extend(true, empty, optionsWithCustomObject);
	ok( empty.foo && empty.foo.date === customObject, "Custom objects copy correctly (no methods)" );

	// Makes the class a little more realistic
	myKlass.prototype = { someMethod: function(){} };
	empty = {};
	_.extend(true, empty, optionsWithCustomObject);
	ok( empty.foo && empty.foo.date === customObject, "Custom objects copy correctly" );

	var ret = _.extend(true, { foo: 4 }, { foo: new Number(5) } );
	ok( ret.foo == 5, "Wrapped numbers copy correctly" );

	var nullUndef;
	nullUndef = _.extend({}, options, { xnumber2: null });
	ok( nullUndef.xnumber2 === null, "Check to make sure null values are copied");

	nullUndef = _.extend({}, options, { xnumber2: undefined });
	ok( nullUndef.xnumber2 === options.xnumber2, "Check to make sure undefined values are not copied");

	nullUndef = _.extend({}, options, { xnumber0: null });
	ok( nullUndef.xnumber0 === null, "Check to make sure null values are inserted");

	var target = {};
	var recursive = { foo:target, bar:5 };
	_.extend(true, target, recursive);
	deepEqual( target, { bar:5 }, "Check to make sure a recursive obj doesn't go never-ending loop by not copying it over" );

	var ret = _.extend(true, { foo: [] }, { foo: [0] } ); // 1907
	equal( ret.foo.length, 1, "Check to make sure a value with coersion 'false' copies over when necessary to fix #1907" );

	var ret = _.extend(true, { foo: "1,2,3" }, { foo: [1, 2, 3] } );
	ok( typeof ret.foo != "string", "Check to make sure values equal with coersion (but not actually equal) overwrite correctly" );

	var ret = _.extend(true, { foo:"bar" }, { foo:null } );
	ok( typeof ret.foo !== "undefined", "Make sure a null value doesn't crash with deep extend, for #1908" );

	var obj = { foo:null };
	_.extend(true, obj, { foo:"notnull" } );
	equal( obj.foo, "notnull", "Make sure a null value can be overwritten" );

	function func() {}
	_.extend(func, { key: "value" } );
	equal( func.key, "value", "Verify a function can be extended" );

	var defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options1 = { xnumber2: 1, xstring2: "x" },
		options1Copy = { xnumber2: 1, xstring2: "x" },
		options2 = { xstring2: "xx", xxx: "newstringx" },
		options2Copy = { xstring2: "xx", xxx: "newstringx" },
		merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

	var settings = _.extend({}, defaults, options1, options2);
	deepEqual( settings, merged2, "Check if extended: settings must be extended" );
	deepEqual( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	deepEqual( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	deepEqual( options2, options2Copy, "Check if not modified: options2 must not be modified" );
});

test("isPlainObject", function() {
	expect(15);

	stop();

	// The use case that we want to match
	ok(_.isPlainObject({}), "{}");

	// Not objects shouldn't be matched
	ok(!_.isPlainObject(""), "string");
	ok(!_.isPlainObject(0) && !_.isPlainObject(1), "number");
	ok(!_.isPlainObject(true) && !_.isPlainObject(false), "boolean");
	ok(!_.isPlainObject(null), "null");
	ok(!_.isPlainObject(undefined), "undefined");

	// Arrays shouldn't be matched
	ok(!_.isPlainObject([]), "array");

	// Instantiated objects shouldn't be matched
	ok(!_.isPlainObject(new Date), "new Date");

	var fn = function(){};

	// Functions shouldn't be matched
	ok(!_.isPlainObject(fn), "fn");

	// Again, instantiated objects shouldn't be matched
	ok(!_.isPlainObject(new fn), "new fn (no methods)");

	// Makes the function a little more realistic
	// (and harder to detect, incidentally)
	fn.prototype = {someMethod: function(){}};

	// Again, instantiated objects shouldn't be matched
	ok(!_.isPlainObject(new fn), "new fn");

	// DOM Element
	ok(!_.isPlainObject(document.createElement("div")), "DOM Element");

	// Window
	ok(!_.isPlainObject(window), "window");

	try {
		_.isPlainObject( window.location );
		ok( true, "Does not throw exceptions on host objects");
	} catch ( e ) {
		ok( false, "Does not throw exceptions on host objects -- FAIL");
	}

	try {
		var iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		window.iframeDone = function(otherObject){
			// Objects from other windows should be matched
			ok(_.isPlainObject(new otherObject), "new otherObject");
			document.body.removeChild( iframe );
			start();
		};

		var doc = iframe.contentDocument || iframe.contentWindow.document;
		doc.open();
		doc.write("<body onload='window.parent.iframeDone(Object);'>");
		doc.close();
	} catch(e) {
		document.body.removeChild( iframe );

		ok(true, "new otherObject - iframes not supported");
		start();
	}
});

test("indexBy", function(){
	expect(1);
	var list = [-1, 3, 5];
	var positive = function(n){
		return n > 0;
	};
	ok(_.indexBy(list, positive) === 1, "Indexed position in array.");
});

test("symmetricDifference", function(){
	expect(2);

	var a = [1, 2, 3];
	var b = [3, 4];
	deepEqual(_.symmetricDifference(a, b), [1, 2, 4], "2-array symmetricDifference.");
	var m = [1, 2, 3];
	var n = [2, 3, 4];
	var o = [3, 4, 5];
	deepEqual(_.symmetricDifference(m, n, o), [1, 3, 5], "3-array symmetricDifference.");
});

test("Lock", function(){
	ok(_.lock, "Lock defined.");
	a = 0;
	inc = _.lock(function(){
		a++;
		inc();
	});
	inc();
	equal(a, 1, "inc entered a single time.");
});

}());
