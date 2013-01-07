beforeEach !->
	@addMatchers do
		toBeFunction: -> Object::toString.call @actual is '[object Function]'

describe "Events", !(a)->
	_ = require "../../../../lib/superscore"
	it "Has events", !->
		expect _.Event .toBeDefined!

	it "Can observe", !->
		source = {}
		pass = false
		_.Event.observe source, !(e) -> pass := e
		_.Event.trigger source, true
		expect pass .toBe true