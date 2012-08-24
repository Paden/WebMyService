/*var RESTModel    =  require('../lib/RESTModel'),
	ObjectId     =  RESTModel.ObjectId;		
					
var restModel    =  new RESTModel('Comment', {
	user : {type: [Object] , required: true }
	, event : {type: [Object] , required: false}
	,activityOfLast: {type: Date , required: true }
	,dateCreated : {type: Date , required: true }
	,response_id : {type: [ObjectId], required: true }
	,creator_id : {type: [ObjectId], required: true }
	,text : {type: String , required: true }
	,currentVote : {type: Number , required: false, default: 0 }
	,downvoteNum : {type: Number , required: false, default: 0 }
	,hotCounter : {type: Number , required: false, default: 0 }
	,upvoteNum : {type: Number , required: false, default: 0 }
	,downvoteUsers : {type: [ObjectId], required: false, default: []}
	,upvoteUsers : {type: [ObjectId], required: false, default: []}
});

restModel.registerGet();
restModel.registerInsert();
restModel.registerSet();
restModel.registerDel();
	
module.exports = exports =  restModel;*/