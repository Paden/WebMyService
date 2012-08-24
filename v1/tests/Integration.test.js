/*
	Authors: Paden and Oscar
	Purpose: Integration tests for v1
	TODO   :  Modulate better, nodeunit is crashing request (fix?)
*/

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
		   url   : 'http://padenportillo.com:3000/v1/request.json'
	  	,  json  :  json
	}, callback);
}

//
//Test: Correct Login
//
postRequest('login', [{email: 'paden18@gmail.com', password: 'asdf'}], 1337, function(error, response, body) 
{
	assert.notEqual(body.result, undefined, 'Result should be found');
	console.log('------------------- Login Test: Passed')
});

//
//Test: Incorrect Login
//
postRequest('login', [{email: 'asdfsafdasfsdfs@gmail.com', password: 'asdf'}], 1337, function(error, response, body) 
{
	assert.notEqual(body.error, undefined, 'Should Find Error');
	console.log('------------------- Incorrect Login: Failed (good)')
});


function getRegister()
{
	return {
		 firstname : 'Paden'
		,lastname  : 'Portillo'
		,location  : 'here'
		,password  : 'asdf'
		,email     : 'test' + (Math.random()*100000) + '@gmail.com'
		,dob       : '7/14/1987'
		,type  	   : 'User'
	}
}	 

var correctRegister =  getRegister()
,   incorrectReg1   =  getRegister()
,   incorrectReg2   =  getRegister()
,   incorrectReg3   =  getRegister()

incorrectReg1.email =  'paden18@gmail.com'; //email in use
incorrectReg2.type  =  'asfd';              //not valid type
incorrectReg3.dob   =  'BadFormat';         //not a date

//
//Test: Correct Register
//
postRequest('insertUser', [correctRegister], 1337, function(error, response, body) 
{
	assert.notEqual(body.result, undefined, 'Result should be found');
	console.log('------------------- Correct Register: Passed')
});

//
//Test: Incorrect Register
//
postRequest('insertUser', [incorrectReg1], 1337, function(error, response, body) 
{
	assert.notEqual(body.error, undefined, 'Error should be found');
	console.log('------------------- Incorrect Register1: Failed (good)')
});

//
//Test: Incorrect Register
//
postRequest('insertUser', [incorrectReg2], 1337, function(error, response, body) 
{
	assert.notEqual(body.error, undefined, 'Error should be found');
	console.log('------------------- Incorrect Register2: Failed (good)')
});

//
//Test: Incorrect Register
//
postRequest('insertUser', [incorrectReg3], 1337, function(error, response, body) 
{
	assert.notEqual(body.error, undefined, 'Error should be found');
	console.log('------------------- Incorrect Register3: Failed (good)')
});