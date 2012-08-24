/*
	Authors: Paden and Oscar
	Purpose: Provide a fast, non-domain specific session.
	Using Redis.io (a fast, reliable DB) to store session-specific
	keu/value pairs.
	Last Updated: 4/21/2012

*/
var redis  =  require("redis")
,   client =  redis.createClient(null, null, {detect_buffers: true});

//
//Redis Error Handeling
//
client.on('error', function (err) 
{
    console.log('Session Error: ' + err);
});

var Session    =  (function() //Singleton
{
	return {
		get    : function(uid, callback)
		{
			client.hgetall(uid, callback);
		},
		create :  function(uid, callback)
		{	
			client.hgetall(uid, function(err, obj)
			{
				if(err)
				{
					console.log('Error in creating Session for unique id "' + uid + '" :' + err);
					callback(err);
				}
				else if(!isEmptyObj(obj))
				{
					callback('Unique id aleady in use');
				}
				else { callback(null, true); }
			});
		},
		set    :  function(uid, obj)
		{
			client.hmset(uid, obj);
		},
		destroy:  function(uid, callback)
		{	
			client.hgetall(uid, function(err, obj)
			{
				if(err)
				{
					console.log('Error in deleting Session for id "' + uid + '" :' + err);
					callback(err);
				}
				else
				{
					client.del(uid);
					callback(null, true);
				}
			});
		}
	}
})(); //Singleton

/***********************************************

Util Functions

***********************************************/
function isEmptyObj(obj)
{
	for ( var name in obj ) { return false; }
	return true;
}

//
//EXPORTS AND THEN PORTS! YEA! LIKE A SAILOR!!
//
module.exports = exports = Session;