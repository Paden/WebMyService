var RPC      =  require('../lib/RPC')
,   Request  =  RPC.Request
,   Response =  RPC.Response
,	Next = RPC.Next

function returnFunc(val)
{
	return val;
}

exports.testResponse  =  {

	ResponseEquality: function(test)
	{
		test.expect(1);

		var postResponse =  returnFunc
		,   id           =  1337
		,   error        =  null
		,   result       =  'test'
		,   response1    =  new Response(postResponse, id)
		,   response2    =  new Response(postResponse, id)
		,   response1    =  response1(error, result, id)
		,   response2    =  response2(error, result, id)

		test.deepEqual(response1, response2, 'Test Response Equality')
		test.done();
	},
	ResponseInequality: function(test)
	{
		test.expect(1);

		var postResponse =  returnFunc
		,   id           =  1337
		,   error        =  null
		,   result       =  'test'
		,   result2      =  'test2'
		,   response1    =  new Response(postResponse, id)
		,   response2    =  new Response(postResponse, id)
		,   response1    =  response1(error, result, id)
		,   response2    =  response2(error, result2, id)

		test.notDeepEqual(response1, response2, 'Test Response Equality')
		test.done();
	},
	ResponseNullId: function(test)
	{
		test.expect(1);

		var postResponse =  returnFunc
		,   id           =  null
		,   error        =  null
		,   result       =  'test'
		,   response    =  new Response(postResponse, id)
		,   response1    =  response(error, result, id);
		
		test.equal(null, response.getId(), 'Should be null')

		test.done();
	},
	ResponseNegativeId: function(test)
	{
		test.expect(1);

		var postResponse =  returnFunc
		,   id           =  -1
		,   error        =  null
		,   result       =  'test'
		,   response1    =  new Response(postResponse, id)
		,   response1    =  response1(error, result, id);
		
		test.equal(-1, response1.id, 'Should be negative');

		test.done();
	},
	ResponseNewIdSet: function(test)
	{
		test.expect(1);

		var postResponse =  returnFunc
		,   id1          =  1
		,	id2			 = 	2
		,   error        =  null
		,   result       =  'test'
		,   response     =  new Response(postResponse, id1)
		,   response1    =  response(error, result, id2);
		
		test.equal(2, response1.id, 'Should be 2')

		test.done();
	},
	ResponsePostResponseNull: function(test)
	{
		test.expect(1);

		var postResponse =  null
		,   id          =  1
		,   error        =  null
		,   result       =  'test'
		,   response     =  new Response(postResponse, id)
		
		
		try{
			var  response1    =  response(error, result, id);
			test.ok(true, "no error");
			test.done();
		}
		catch(e)
		{
			test.ok(false, JSON.stringify(e));
			test.done();
		}
	}
	
	
}


function nextCallBack1()
{
	return true;
}

function nextCallBack2()
{
	return true;
}

exports.testNext  =  {

	NextNullCallbacks: function(test)
	{
		test.expect(1);
		var response	=  Response(function(json_res){console.log(json_res)}, 1);
		var params 		= 	[{
								"method"	: "noName",
								"params"	: null,
								"id"		: 1
							}];

		
		try{
			var next = new Next(null, response, params);
			test.ok(true, "No Error");
			test.done();
		}
		catch(e)
		{
			test.ok(false, JSON.stringify(e));
			test.done();
		}
		
	},
	NextEmptyCallbacks: function(test)
	{
		test.expect(1);
		var response	=  Response(function(json_res){console.log(json_res)}, 1);
		var params 		= 	[{
								"method"	: "noName",
								"params"	: null,
								"id"		: 1
							}];
		
		try{
			var next = new Next([], response, params);
			test.ok(true, "No Error");
			test.done();
		}
		catch(e)
		{
			test.ok(false, JSON.stringify(e));
			test.done();
		}
		
	},
	NextCallbacksInvalidDataType: function(test)
	{
		test.expect(1);
		var response	=  Response(function(json_res){console.log(json_res)}, 1);
		var params 		= 	[{
								"method"	: "noName",
								"params"	: null,
								"id"		: 1
							}];
		
		try{
			var next = new Next(nextCallBack1(params, Response, next), response, params);
			test.ok(true, "No Error");
			test.done();
		}
		catch(e)
		{
			test.ok(false, JSON.stringify(e));
			test.done();
		}
		
	},
	NextMultipleCallbacks: function(test)
	{
		test.expect(1);
		var response	=  Response(function(json_res){console.log(json_res)}, 1);
		var params 		= 	[{
								"method"	: "noName",
								"params"	: null,
								"id"		: 1
							}];
		
		try{
			var next = new Next([nextCallBack1(params, Response, next),nextCallBack2(params, Response, next)], response, params);
			test.ok(true, "No Error");
			test.done();
		}
		catch(e)
		{
			test.ok(false, JSON.stringify(e));
			test.done();
		}
		
	},
	NextInvalidParams: function(test)
	{
		test.expect(1);
		var response	=  Response(function(json_res){console.log(json_res)}, 1);
		//not in array form!!
		var params 		= 	{
								"method"	: "noName",
								"params"	: null,
								"id"		: 1
							};
		
		try{
			var next = new Next([nextCallBack1(params, Response, next)], response, params);
			test.ok(true, "No Error");
			test.done();
		}
		catch(e)
		{
			test.ok(false, JSON.stringify(e));
			test.done();
		}
		
	},
	NextNullParams: function(test)
	{
		test.expect(1);
		var response	=  Response(function(json_res){console.log(json_res)}, 1);
		//params are null
		var params 		= 	null;
		
		try{
			var next = new Next([nextCallBack1(params, Response, next)], response, params);
			test.ok(true, "No Error");
			test.done();
		}
		catch(e)
		{
			test.ok(false, JSON.stringify(e));
			test.done();
		}
		
	},
	NextMultipleParams: function(test)
	{
		test.expect(1);
		var response	=  Response(function(json_res){console.log(json_res)}, 1);
		//params are null
		var params 		= 	[
								  {
									"method"	: "noName",
									"params"	: null,
									"id"		: 1
								  }
								, {
									"method"	: "noName2",
									"params"	: "some Params",
									"id"		: 2
								}
							];
		
		try{
			var next = new Next([nextCallBack1(params, Response, next)], response, params);
			test.ok(true, "No Error");
			test.done();
		}
		catch(e)
		{
			test.ok(false, JSON.stringify(e));
			test.done();
		}
		
	},
	NextNullResponse: function(test)
	{
		test.expect(1);
		var response	=  null;
		var params 		= 	[{
								"method"	: "noName",
								"params"	: null,
								"id"		: 1
							}];
		
		try{
			var next = new Next([nextCallBack1(params, Response, next)], response, params);
			test.ok(true, "No Error");
			test.done();
		}
		catch(e)
		{
			test.ok(false, JSON.stringify(e));
			test.done();
		}
		
	},
	NextInvalidResponseDataType: function(test)
	{
		test.expect(1);
		var response	=  1;
		var params 		= 	[{
								"method"	: "noName",
								"params"	: null,
								"id"		: 1
							}];
		
		try{
			var next = new Next([nextCallBack1(params, Response, next)], response, params);
			test.ok(true, "No Error");
			test.done();
		}
		catch(e)
		{
			test.ok(false, JSON.stringify(e));
			test.done();
		}
		
	}
}

