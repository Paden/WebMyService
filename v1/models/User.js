var RESTModel       =  require('../lib/RPC_Model')
,   bcrypt          =  require('bcrypt') 
,   Session         =  RESTModel.Session
,   Email           =  RESTModel.Email
,   salt            =  bcrypt.gen_salt_sync(14)
,	ObjectId        =  RESTModel.ObjectId
,   userTypes       =  ['User', 'Vendor']
,   restModel       =  new RESTModel('User', 
{
	 firstname      : {type: String    , required: true }
	,lastname       : {type: String    , required: true }
	,location       : {type: String    , required: true }
	,password       : {type: String    , required: true , min: 6, set: hashPassword }
	,email          : {type: String    , required: true , unique: true, validate: [validateEmail, 'Email Not in proper form']}
	,dob            : {type: Date      , required: true , validate: [atLeastAge13, 'User is not old enough. Must be at least 13.']}
	,type           : {type: String    , required: true , enum: userTypes }
	,confirmation   : {type: String    , required: false, default: createConfirmationCode}
	,confirmedEmail : {type: Boolean   , required: false, default: false}
	,username       : {type: String    , required: false, min: 4}
	,numOfFollowers : {type: Number    , required: false, default: 0 }
	,numOfFollowing : {type: Number    , required: false, default: 0 }
	,sharedEvents   : {type: [ObjectId], required: false, default: [] }
	,blacklist      : {type: [ObjectId], required: false, default: [] }
	,invites        : {type: [ObjectId], required: false, default: [] }
	,leads          : {type: [ObjectId], required: false, default: [] }
	,events         : {type: [ObjectId], required: false, default: [] }
	,profileImage   : {type: ObjectId  , required: false}
});  

/******************************************************************

Register RPC-API Calls!

******************************************************************/
restModel.register('login', ['{email, password}'], 'id to be used for further quieres (user mapping)', function(entity, Response, next)
{
	console.log('Trying to login...');
	
	restModel.mongooseModel.findOne({'email':entity.email}, function(err, user) 
	{
		console.log('Found User for login...');
		if(err) 
		{ 
			console.log('Found Error For Login: ' + err);
			Response(err); 
		}
		else if(!user)
		{
			console.log('No user found: ' + err);
			Response('No User Found');
		}
		else
		{
			var validate =  validatePassword(entity.password, user.password)
			
			if(!validate)
			{
				Response('Incorrect Password');
			}
			else if(!user.confirmedEmail)
			{
				Response('You must confirm your email before logging in');
			}
			else
			{
				//Use User ID + Time for Session ID
				var time =  (new Date()).getTime().toString()
				,   uid  =  user._id.toString() + time
				
				Session.create(uid, function(err, success)
				{
					if(err)
					{
						Response('Error in Creating Session: ' + err); 
					}
					else
					{
						//Set id and email to user's session
						Session.set(uid, {id: user._id, email: user.email});
						Response(null, 'Logged in', uid);
					}
				});
			}
		}
	});
});

restModel.register('logout', ['{}'], 'id will be nulled', function(params, Response, next)
{
	console.log('Trying to logout...');
	
	Session.destroy(Response.getId(), Response);
});

restModel.register('sendEmailConfirmation', ['{}'], 'id will be returned as requested', function(params, Response, next)
{
	restModel.mongooseModel.findById(Response.getId(), function(err, user)
	{
		if(err) { Response(err) }
		else
		{
			var email =  new Email()

			email.emailConfirmation(user.email, user.confirmation, function(err, message)
			{
				if(err) { Response(err) }
				else    { Response(null, 'Email sent!')}
			});
			
		}
	});
});

restModel.register('confirmEmail', ['{code}'], 'id will be returned as requested', function(params, Response, next)
{
	restModel.mongooseModel.findOne({confirmation:params.code}, function(err, user)
	{
		if(err)        { Response(err) }
		else if(!user) { Response('Incorrect Code') }
		else
		{
			user.confirmedEmail = true;
			user.save(function(err)
			{
				if(err) { Response(err) }
				else
				{
					var email =  new Email()
					email.emailValidated(user.email, function(err, message)
					{
						if(err) { Response(err) }
						else    { Response(null, 'Email Confirmed!'); }
					})
				}
			});
		}
	});
});

restModel.registerGet(restModel.defaultGet);

restModel.registerInsert(function(entity, Response)
{
	var instance =  new restModel.mongooseModel(entity);
				
	instance.save(function(err)
	{
		if(err) { Response(err) }
		else    { Response(null, instance, instance._id); }
	});
});
/******************************************************************

UTIL FUNCTIONS

******************************************************************/
function createConfirmationCode()
{
	var randLetters  =  'theWurdeisAwesomeAndCool'
	,   letterLength =  randLetters.length
	,   randLength   =  6
	,   code         =  ''

	for(var i = 0; i < randLength; i++)
	{
		var rand     =  Math.floor(Math.random() * letterLength)
		code         +=  randLetters[rand]
	}

	return code;
}

function validateEmail(email) 
{ 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function atLeastAge13(userDate)
{
	var atLeast   =  13
	,   curDate   =  new Date()
	,   difYear   =  curDate.getFullYear() - userDate.getFullYear()
	,   difMonth  =  curDate.getMonth()    - userDate.getMonth()
	,   difDate   =  curDate.getDate()     - userDate.getDate()
	,   valid     =  difYear > atLeast
	,   valid     =  valid || difYear == atLeast
	,   valid     =  valid || difMonth > 0
	,   valid     =  valid || difMonth == 0 && difDate > 0
	
	return valid;
}

function hashPassword(pass)
{
	return bcrypt.encrypt_sync(pass, salt);
}
function validatePassword(pass, hash)
{
	return bcrypt.compare_sync(pass, hash);
}
	
//
//EXPORTS THE USERS TO THE OOZERS!!
//
module.exports = exports =  restModel;