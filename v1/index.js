/*
	Authors: Paden and Oscar
	Purpose: Initialize v1/ of the web service	
*/

var   WebService       =  require('./lib/WebService')
    , version          =  'v1'
    , modelPath        =  __dirname + '/models'


exports.init           =  function(expressApp)
{
  	var webservice     =  new WebService(expressApp, version);
  	webservice.startRESTModels(modelPath);
}

exports.getRPC         =  function()
{
	return {
		  'version' : version
		, 'path'    : '/' + version + '/request.json'
	};
}