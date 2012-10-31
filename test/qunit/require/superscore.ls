/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

/*
	======== A Handy Little QUnit Reference ========
	http:#docs.jquery.com/QUnit

	Test methods:
		expect numAssertions
		stop increment
		start decrement
	Test assertions:
		ok value, [message]
		equal actual, expected, [message]
		notEqual actual, expected, [message]
		deepEqual actual, expected, [message]
		notDeepEqual actual, expected, [message]
		strictEqual actual, expected, [message]
		notStrictEqual actual, expected, [message]
		raises block, [expected], [message]
*/

console.log "Tests loaded."

asyncTest 'has request', !->
	expect 1
	require <[ ../assets/superscore.amd ]>, !(underscore)->
		ok underscore.request, 'Can request'
		start!

asyncTest 'request gets', !->
	expect 1
	require <[ ../assets/superscore.amd ]>, !(underscore)->
		underscore.request "http://localhost:8000/test/assets/data.json" .then !(d)->
			data = JSON.parse d
			equal data.foo, 'bar', 'Data gotten correctly.'
			start!

