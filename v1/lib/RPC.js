/*
	Authors: Paden and Oscar
	Purpose: Create a JSON-RPC 2.0 Interface between
	         the web service and clients who use it.
*/

var RPC                 =  (function RPC()
{
	var exposedRequests =  []
	,   exposedRPCs     =  []
	,   requestURI      =  'request.json'
	
	function execRPC_Method(reqParams, postResponse)
	{
		var method        =  reqParams.method
		,   params        =  reqParams.params || [{}]
		,   id            =  reqParams.id
		,   callbacks     =  exposedRequests[method]
		,   response      =  Response(postResponse, id)
		,   reqNotDefined =  typeof callbacks === "undefined";

		console.log('Request: ' + method);

		if(reqNotDefined) { response('No Method Found', null); }
		else              { Next(callbacks, response, params); }
	}
	function showRPC_API(reqParams, postResponse)
	{
		postResponse(exposedRPCs);
	}

	return {
		init            :  function(WebService)
		{	
			WebService.post(requestURI, execRPC_Method);
			WebService.get(requestURI, showRPC_API);
		},
		expose :  function(method, callbacks, rpc)
		{
			exposedRequests[method]  =  callbacks;
			exposedRPCs.push(rpc);

			console.log('Registered RPC-Method: ' + method);
		}
	};
	
})(); //Singleton

/***********************************************

Next:
	Purpose: Given an array of callbacks, call
	them one by one. Each callback is given all
	the parameters in the rpc and has the ability
	to response using the Response object.

***********************************************/
function Next(callbacks, response, params)
{
	var callbacks     =  callbacks.slice()//copy
	,   next          =  function()
	{	
		//splice first element (cut out!)
		var callback  =  callbacks.splice(0, 1)[0]
		,   isDefined =  typeof callback !== "undefined"

		if(isDefined) 
		{ 
			try
			{
				callback.apply(this, params); 
			}
			catch(e)
			{
				delete next; //Protection
				console.log('Caught Error in Next: ' + e);
			}
		}
	};
	
	params.push(response, next);

	next(); //start the array of callbacks
}

/***********************************************

Request:
	Purpose: Interface with RPC in order to register
	an RPC-call. Used mainly for RPC formatting. In the
	future there may be more functionalities, so it's
	been separated from RPC

***********************************************/
function Request(method, params, id, callbacks)
{	
	RPC.expose(method, toArray(callbacks), {    
		  'jsonrpc': '2.0'
	    , 'method' :  method
		, 'params' :  params
		, 'id'     :  id
	});
}

/***********************************************

Response:
	When an RPC's callbacks are being called using
	the "Next" object, it is given a response object
	to write a json object to the invoker

***********************************************/
function Response(postResponse, id)
{	
	var response   =  function(error, result, pid)
	{
		return postResponse({	   
			   'jsonrpc': '2.0'
			,  'result' :  result
			,  'error'  :  errorToString(error)
			,  'id'     :  pid || id
		 });
	};
	
	//Tack on a function to that function
	//make it easy to see the id of a Response
	response.getId =  function() { return id; }
	
	return response;
}

/***********************************************

Util Functions

***********************************************/
function errorToString(err)
{
	if(err && err.toString)
	{
		err =  err.toString();
	}
	return err;
}
function toArray(obj)
{
	if(!Array.isArray(obj))
	{
		obj  =  [obj];
	}

	return obj;
}

//
//EXPORT ALL THE THINGS!
//
RPC.Request     =  Request; 
RPC.Response    =  Response;
RPC.Next        =  Next;  
module.exports  =  exports   = RPC;