/*
	Authors: Paden and Oscar
	Purpose: Extend a Mongoose Model to use the a RPC-Request object to
	         create an API/Web Service for a database Schema
	Last Updated: 4/21/2012

*/

var mongoose             =  require('mongoose')      //Database
  , Request              =  require('./RPC').Request //RPC-Response
  , Email                =  require('./Email')       //Email Module
  , Session              =  require('./XS-Session')  //Email Module
  , Schema               =  mongoose.Schema          //DB-Schema
  , ObjectId             =  Schema.ObjectId          //DB-uniqueID

//
//CONSTRUCTOR
//Inputs: Name of database document and it's respective schema
//Notes: Possible schemas can be found here:
//http://mongoosejs.com/docs/model-definition.html
//
function RESTModel(schemaName, schemaJSON)
{
	this.schema          =  schemaJSON;
	this.mongooseModel   =  mongoose.model(schemaName, new Schema(this.schema));
	this.schemaName      =  schemaName;
}

/******************************************************************

Default Insert/Get/Set/Del for RestModels (optional use)

******************************************************************/
RESTModel.prototype.defaultInsert  =  function(entity, Response)
{
	var instance     =  new this.mongooseModel(entity);
	instance.save(defaultResponseReturn(Response, instance));
};

RESTModel.prototype.defaultGet     =  function(entity, Response)
{
	this.mongooseModel.find(entity, defaultResponseReturn(Response));
};

RESTModel.prototype.defaultSet     =  function(id, entity, Response)
{
	this.mongooseModel.update({_id: id}, entity, defaultResponseReturn(Response, entity));
};

RESTModel.prototype.defaultDel       = function(id, Response)
{
	this.mongooseModel.findById(id, function(err, instance) 
	{
		if(instance) 
		{
			instance.remove(function(err)
			{
				var wasDeleted =  err? false : true;
				Response(err, {deleted: wasDeleted});
			});
		}
		else { Response("That ObjectId does not exist"); }
	});
};

/******************************************************************

Register Functions used to create RPC-Request functionality
An RPC-Request functionality will register the method with
the RPC-listener and call the callback function when called on.

******************************************************************/

//
//All register functions are shortcuts to this "register" function
//Parameters:
	//method: Method name
	//params: desired params for input into callback
	//id: description of how id will be returned
	//callbacks: an array, or single callback, of what to call once the
	//           method is invoked by the web service
//

RESTModel.prototype.register       =  function(method, params, id, callbacks)
{	
	new Request(method, params, id, callbacks);
};

RESTModel.prototype.registerInsert =  function(callbacks)
{
	var method           =  'insert' + this.schemaName
	,   params           =  [JSON.stringify(this.schema)]
	,   id               =  'id will be returned as requested'
	
	this.register(method, params, id, callbacks);
};

RESTModel.prototype.registerGet    =  function(callbacks)
{
	var method          =  'get' + this.schemaName
	,   params          =  ['json containing get']
	,   id              =  'id will be returned as requested'

	this.register(method, params, id, callbacks);
};

RESTModel.prototype.registerSet    =  function(callbacks)
{
	var method          =  'set' + this.schemaName
	,   params          =  ['id to set', 'json with updates']
	,   id              =  'id will be returned as requested'

	this.register(method, params, id, callbacks);
};

RESTModel.prototype.registerDel    =  function(callbacks)
{
	var method          =  'del' + this.schemaName
	,   params          =  ['id to delete']
	,   id              =  'id will be returned as requested'

	this.register(method, params, id, callbacks);
};

//
//Simple Response return for most Mongoose callback functions
//
function defaultResponseReturn(Response, instance)
{
	return function(err, instances)
	{
		var result       =  instances || instance;

		if(err) { Response(err);          }
		else    { Response(null, result); }
	}
}

//
//Exports RESTModel and Object ID for instances
//
RESTModel.ObjectId                 =  ObjectId;
RESTModel.Email                    =  Email;
RESTModel.Session                  =  Session;
module.exports =  exports          =  RESTModel;