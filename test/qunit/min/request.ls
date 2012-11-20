module "Request"

asyncTest "empty request", !->
	_.request "" .then !(d)->
		equal d, '', "empty return"
		start!

test "get and post expost", !->
	ok _.request.get, "_.request.get is available"
	ok _.request.post, "_.request.post is available"