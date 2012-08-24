/*
 Author: Paden & Oscar
 Purpose: Used to start the web service and all of it's versions 
*/

//---------------------------------------------------------------------//
//----------------------//         Main        //----------------------//
//---------------------------------------------------------------------//
var   express               =  require('express')  //ExpressJS for routing
    , mongoose              =  require('mongoose') //Database Module
	, fs                    =  require('fs')       //File Service
    , port                  =  3001               //listening port
    , app                   =  express.createServer()
	, databaseName          =  'wurdeSandbox'
	, loggerFormat          =  '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms'
	, allowCrossDomain      =  function(req, res, next) 
	{
		//Middleware: Allows cross-domain requests (CORS)
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');
		next();
	}

//
//Configure Application
//
app.configure(function() 
{
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.favicon());
	app.use(express.logger({ format: loggerFormat }))
	app.use(express.cookieParser());
	app.use(allowCrossDomain);
});

//Initialize Database
mongoose.connect('mongodb://localhost/' + databaseName);

//Initialize Listening of Web Service
app.listen(port);


//---------------------------------------------------------------------//
//----------------------//Initialize All Versions Here//---------------//
//---------------------------------------------------------------------//

function VersionManager(versionJSON)
{
	var  versions      =  versionJSON
	this.rpc           =  {versions: []}

	for(var i = 0; i < versions.length; i++)
	{
		var   version  =  versions[i].version
		    , path     =  versions[i].path
			, initFile =  versions[i].initFile
			, initCall =  versions[i].initCall
		    , rpcCall  =  versions[i].rpcCall
			, module   =  require('.' + path + initFile)
			, rpc      =  module[rpcCall](); 
		
		module[initCall](app);
		this.rpc.versions.push(rpc);
	}
}
VersionManager.prototype.getRPCList =  function()
{
	return this.rpc;
};
VersionManager.prototype.startRPC   =  function(location)
{
	//Start RPC Service
	var rpcList  =  this.getRPCList()
	location     =  location || '/index.json'

	app.get(location, function(req, res)
	{
		res.json(rpcList);
	});

	console.log('Registered Route: ' + location);
}

//
//Initialize!! If versions is typed in command line
//Example: node index.js ver=versions.js
//^^Grab the versions.js
//
var versionsFile   =  process.argv[2] || ''
,   verIndex       =  versionsFile.indexOf('ver=')

if(verIndex >= 0)
{
	var verFile    =  versionsFile.substring(verIndex + 4)
	,   versions   =  fs.readFileSync(verFile, 'utf8')
    ,   versions   =  JSON.parse(versions)
	,   verManager =  new VersionManager(versions)

	verManager.startRPC();
}


//---------------------------------------------------------------------//
//-------------//Exports Version Manager for testing  //---------------//
//---------------------------------------------------------------------//

module.exports = exports = VersionManager;