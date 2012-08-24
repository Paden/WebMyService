var WebService     =  require('../lib/WebService')
,   req            =  {body: {'a': 1, 'b': 2}}
,   res            =  {json: function(json){return json}}
,   fakeExpress    =  (function()
{
	var POSTRoutes =  []
	,   GETRoutes  =  []

	return {
		post: function(route, callback)
		{
			POSTRoutes[route] =  callback;
		},
		get: function(route, callback)
		{
			GETRoutes[route]  =  callback;
		},
		firePOST: function(route, req, res)
		{
			var callback      =  POSTRoutes[route] 
			callback(req, res);
		}
		,fireGET: function(route, req, res)
		{
			var callback      =  POSTRoutes[route] 
			callback(req, res);
		}
	}
})();


exports.testWebService  =  {

	HasCorrectPath  :  function(test)
	{
		test.expect(1);

		var webby  =  new WebService(fakeExpress, 'v1');

		test.equal('/v1/', webby.path, 'Should Match');
		test.done();
	},
	NullPath        :  function(test)
	{
		test.expect(1);

		test.throws(function()
		{
			var webby  =  new WebService(fakeExpress, null);

		}, 'Should Throw with null version', 'Null version, no bueno');

		test.done();
	},
	NullExpress   :  function(test)
	{
		test.expect(1);

		test.throws(function()
		{
			var webby  =  new WebService(null, 'v1');

		}, 'Should Throw with null express', 'Null express, no bueno');

		test.done();
	},
	CorrectModelPath : function(test)
	{
		test.expect(1);

		test.doesNotThrow(function()
		{
			var webby  =  new WebService(fakeExpress, 'v1');
			webby.startRESTModels('../models/');

		}, 'Did not load models', 'Loading RPC_Models');

		test.done();
	},
	IncorrectModelPath : function(test)
	{
		test.expect(1);

		test.doesNotThrow(function()
		{
			var webby  =  new WebService(fakeExpress, 'v1');
			webby.startRESTModels(__dirname + '../models/');

		}, 'Should throw because bad path', 'Should not Loading RPC_Models');

		test.done();
	},
	HTTP_POST_Test :  function(test)
	{
		test.expect(1);

		var webby  =  new WebService(fakeExpress, 'v1');
		webby.post('test', function(body, response)
		{
			test.ok(true, 'POSTed Response');
		})

		fakeExpress.firePOST('/v1/test', req, res);

		test.done();
	},
	HTTP_POST_TestBadRoute :  function(test)
	{
		test.expect(1);

		var webby  =  new WebService(fakeExpress, 'v1');

		test.throws(function()
		{
			webby.post('test', function(body, response)
			{
				1+1;
			});
		});
		

		fakeExpress.firePOST('/v1/testasdf', req, res);

		test.done();
	},
	HTTP_GET_Test :  function(test)
	{
		test.expect(1);

		var webby  =  new WebService(fakeExpress, 'v1');
		webby.get('test', function(body, response)
		{
			test.ok(true, 'POSTed Response');
		})

		fakeExpress.fireGET('/v1/test', req, res);

		test.done();
	},
	HTTP_GET_TestBadRoute :  function(test)
	{
		test.expect(1);

		var webby  =  new WebService(fakeExpress, 'v1');

		test.throws(function()
		{
			webby.get('test', function(body, response)
			{
				1+1;
			});
		});
		

		fakeExpress.fireGET('/v1/testasdf', req, res);

		test.done();
	}
}