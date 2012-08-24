var RESTModel    =  require('../lib/RESTModel');			
					
var restModel    =  new RESTModel('test', {
	 name        : {type: String, required: true , min: 4}
	,description : {type: String, required: false, default: ''}
});

restModel.registerGet();
restModel.registerInsert();
restModel.registerSet();
restModel.registerDel();
	
module.exports = exports =  restModel;


