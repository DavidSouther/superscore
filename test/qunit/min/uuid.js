/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global _:false, JEFRi:false, isLocal:false*/

(function(){

module("");

module("UUID");

test("UUIDv4", function(){
	var v4 = /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g;
	expect(1);
	ok(_.UUID.v4().match(v4), "V4 UUID.");
});

test("Sha1", function(){
	expect(3);

	var qbf = "The quick brown fox jumps over the lazy dog";
	var qbc = "The quick brown fox jumps over the lazy cog";
	var nul = "";

	equal(_.Sha1(qbf), "2fd4e1c67a2d28fced849ee1bb76e7391b93eb12", qbf);
	equal(_.Sha1(qbc), "de9f2c7fd25e1b3afad3e85a0bd17d9b100db4b3", qbc);
	equal(_.Sha1(nul), "da39a3ee5e6b4b0d3255bfef95601890afd80709", "Zero-length string.");
});

test("UUIDv5", function(){
	expect(2);
	equal(_.UUID.v5("southerd@gmail.com"), "7dc681e5-b527-523c-8ce8-79fef5c8989c", "southerd@gmail.com");
	equal(_.UUID.v5("southerd@gmail.com", "davidsouther.com"), "7477fb98-3481-52c0-bae6-5e9e993ecce7", "southerd@gmail.com NS: davidsouther.com");
});

}());
