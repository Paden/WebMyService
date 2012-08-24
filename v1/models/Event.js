var RESTModel       =  require('../lib/RPC_Model')
,   bcrypt          =  require('bcrypt') 
,   Session         =  RESTModel.Session
,   Email           =  RESTModel.Email
,   salt            =  bcrypt.gen_salt_sync(14)
,	ObjectId        =  RESTModel.ObjectId
,	eventTypes 		=  ['Public', 'Private' ]
,	ageGroups 		=  ['All Ages', 'Over 21', '18 and Up', '13 and Up', 'Adult', 'Seniors', 'Kids', 'Teens']
,	categories 		=  ['General', 'Recreation', 'Nightlife', 'Business', 'Music', 'Community', 'Family', 'Non-Profit']
,   restModel       =  new RESTModel('Event', 
{
	 title     			: {type: String    	, required: true }
	,description		: {type: String		, required: true }
	,ageGroup       	: {type: String    	, required: false , enum: ageGroups }
	,host          		: {type: ObjectId	, required: false, default: null, ref: "User"  }
	,dateCreated		: {type: Date    	, required: false, default: (new Date()).getTime().toString()}
	,startDateTime		: {type: Date    	, required: false}
	,endDateTime		: {type: Date		, required: false }
	,category       	: {type: String    	, required: false , enum: categories }
	,eventType			: {type: String    	, required: false , enum: eventTypes }
	,peopleFollowing	: {type: [ObjectId]	, required: false, default: [] }
	,numOfKudos			: {type: Number    	, required: false}
	,numOfShares		: {type: Number    	, required: false }
	,projectHeadCount	: {type: Number    	, required: false }
	,hotCounter			: {type: Number    	, required: false }
	,imageList			: {type: [ObjectId]	, required: false, default: [] }
	,bannerImage		: {type: [ObjectId]	, required: false, default: [] }
	,partnerList		: {type: [ObjectId]	, required: false, default: [] }
	,postList			: {type: [ObjectId]	, required: false, default: [] }
});  

/******************************************************************

Register RPC-API Calls!

******************************************************************/
/*
 * method should only return all public events 
 */
restModel.register('getAllEvents', ['{}'], 'getting all public events', function(entity, Response, next)
{
	console.log('Trying to get all events...');
	
	restModel.mongooseModel.find({'eventType': 'Public'})
	.populate('host', ['firstname', 'lastname'])
	.run(function(err, events) 
	{
		console.log('Found events...');
		if(err) 
		{ 
			console.log('Found Error For getting all events: ' + err);
			Response(err); 
		}
		else if(!events)
		{
			console.log('No events found: ' + err);
			Response('No Events Found');
		}
		else
		{
			//Use User ID + Time for Session ID
			Response(null, events);
			
		}
	});
});


restModel.registerGet(restModel.defaultGet);

restModel.registerInsert(function(entity, Response)
{
	//console.log("entity" + JSON.stringify(entity));
	console.log("title: " + entity.title );
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

	
//
//EXPORTS THE USERS TO THE OOZERS!!
//
module.exports = exports =  restModel;
