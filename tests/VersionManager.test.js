var VersionManager  =  require('../VersionManager');

function testIndexVersions(test, versionJSON)
{
	test.expect(1);
	try
	{
		verManager      =  new VersionManager(
			versionJSON
		);
		
		test.ok(true, "no error");
		test.done();
	}
    catch(e)
	{
		test.ok(false, JSON.stringify(e));
		test.done();
		
	}
}

/*
 *
 */
exports.test1_1 = function(test){
	
	testIndexVersions
	(
		test,
		[
			{
				"version" :  "v1",
				"path"    :  "/v1/",
				"initFile":  "index.js",
				"initCall":  "init", 
				"rpcCall" :  "getRPC"
			}
		]
	);
    
};

exports.test1_2 = function(test){
    testIndexVersions
	(
		test,
		[
			{
				"version" :  "v1",
				"path"    :  "/v1/",
				"initFile":  "index.js",
				"initCall":  "init", 
				"rpcCall" :  "getRPC"
			},
			{
				"version" :  "v2",
				"path"    :  "/v1/",
				"initFile":  "index.js",
				"initCall":  "init", 
				"rpcCall" :  "getRPC"
			}
		]
	);
};

exports.test1_3 = function(test){
    testIndexVersions
	(
		test,
		[
			{
				"version" :  "v1",
				"path"    :  "/v1/",
				"initFile":  "index.js",
				"rpcCall" :  "getRPC"
			}
		]
	);
};

exports.test1_4 = function(test){
    testIndexVersions
	(
		test,
		[	
		]
	);
};