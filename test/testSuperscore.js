/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global jQuery:false, JEFRi:false, isLocal:false*/

(function($){

test("Unit Testing Environment", function () {
	expect(1);
	ok( !isLocal, "Unit tests shouldn't be run from file://, especially in Chrome. If you must test from file:// with Chrome, run it with the --allow-file-access-from-files flag!" );
});

test("Underscore utils", function(){
	ok(_.indexBy && _.noop, "Underscore has additional basics.");
	ok(_.on && _.once && _.off && _.trigger, "Underscore has additional pubsub?");
	ok(_.ajax && _.get && _.post, "Does Underscore have additional ajax?");
	ok(_.Deferred && _.Callbacks && _.when, "Underscore has async utils.");
	ok(_.UUID && _.UUID.v4 && _.UUID.v5, "Underscore UUID (4, 5) support.");
});

}(jQuery));