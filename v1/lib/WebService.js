/*
	Authors: Paden and Oscar
	Purpose: Start a Web service given and Express app,
	the version number of the web service and models path.

	WebService.js will initialize the RPC given the express
	app and version (to create a namespace for RPC calls)
	and will give the RPC.js itself for use of POST-ing
	and GET-ing

	Webservice.js will also find all the modules in a given
	folder that will extend RESTModel.js given it's location
*/

var RPC  =  require('./RPC');

function WebService(expressApp, version)
{	
	this.version       =  version;
	this.path          =  '/' + version + '/';
	this.expressApp    =  expressApp;

	RPC.init(this);
}
WebService.prototype.post  =  function(method, callback)
{
	var route          =  this.path + method; 
	this.expressApp.post(route, function(req, res)
	{
		callback(req.body, function(json_res)
		{
			return res.json(json_res);
		});
	});
	console.log('Registerd POST@' + route);
}
WebService.prototype.get   =  function(method, callback)
{
	var route          =  this.path + method; 
	this.expressApp.get(route, function(req, res)
	{
		callback(req.body, function(json_res)
		{
			return res.json(json_res);
		});
	});
	console.log('Registerd GET@'  + route);
}
//
//Start and return all RESTModels given in the modelPath
//
WebService.prototype.startRESTModels =  function(modelPath)
{
	var   fs           =  require('fs')
	    , files        =  fs.readdirSync(modelPath)
		, models       =  [];
	
	for(var i = 0; i < files.length; i++)
	{
		var  file      =  files[i]
		   , name      =  file.replace('.js', '');
		
		try
		{
			var path   =  modelPath + '/' + name
			model      =  require(path);
			model.name =  name;
			models.push(model);
		}
		catch(e) { console.log('Error in ' + name + ' :' + e); }
	}
	
	return models;
};

//
//EXPORT ALL THE THINGS!
//
module.exports = exports =  WebService;