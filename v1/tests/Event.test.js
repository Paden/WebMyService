var request        =  require('request')
,   assert         =  require('assert')
,   VersionManager =  require('../../VersionManager') 
,   verManager     =  new VersionManager([
		{
			"version" :  "v1",
			"path"    :  "/v1/",
			"initFile":  "index.js",
			"initCall":  "init", 
			"rpcCall" :  "getRPC"
		}
	])

function postRequest(method, params, id, callback)
{
	var json  =  {    
		  'jsonrpc': '2.0'
	    , 'method' :  method
		, 'params' :  params
		, 'id'     :  id
	}	

	request.post({
		   url   : 'http://padenportillo.com:3001/v1/request.json'
	  	,  json  :  json
	}, callback);
}


	
	
	
	
	
/*
postRequest('insertEvent', [{	 title : "event1"
								,description : "desc1"
								,ageGroup : "All Ages"								
								,host :  "4f946f10e128dbb35c000001"
								,startDateTime : (new Date()).getTime().toString()
								,endDateTime : (new Date()).getTime().toString()
								,category : "General"
								,eventType : "Public"
								,projectedHeadCount : 100
							}], 1337, function(error, response, body) 
{
	console.log(body);
	//assert.notEqual(body.result, undefined, 'Result should be found');
	console.log('--- Login Test: Passed')
});

*/

postRequest('getAllEvents', [{}], 1337, function(error, response, body) 
{
	console.log(JSON.stringify(body))
	//assert.notEqual(body.result, undefined, 'Result should be found');
	console.log('--- Login Test: Passed')
});