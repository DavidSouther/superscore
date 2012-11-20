beforeEach !->
	@addMatchers do
		toBeFunction: -> Object::toString.call @actual is '[object Function]'

describe "Request", !(a)->
	_ = require "../../../../lib/superscore"
	it "has request", !->
		expect(_.request).toBeFunction!

	it "promises", !->
		req = _.request "foo.json"
		expect(req.then).toBeFunction!

	it "gets", !->
		data = null
		runs !->
			_.request "http://localhost:8000/test/assets/data.json" .then !(d)->
				data := JSON.parse d

		waitsFor do
			-> data isnt null
			"data to get returned"
			1000

		runs !->
			expect(data.foo).toMatch /bar/

	it "returns an empty success on empty request", !->
		done = false
		runs !->
			_.request "" .then !(d)->
				expect d .toMatch /^$/
				done := true

		waitsFor -> done 

	it "exposes get and post directly", !->
		expect _.request.get .toBeFunction!
		expect _.request.post .toBeFunction!