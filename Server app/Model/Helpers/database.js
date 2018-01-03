var mysql= require('mysql');
var async = require('async');
var dbConfig=require('../../config/db');
var connection = mysql.createConnection(dbConfig.credentials);
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
	console.log('connected as id ' + connection.threadId);
	async.each(dbConfig.startupQueries,function(query,callback){
		connection.query(query,callback);
	},function(err){
		if(err){
			console.log("error initializing database");
		}else{
			console.log("database iniitialized succesfully");
		}
	});


});
var combiner= new Object();
combiner.ingredientToDish=  function(ingredient,dish,callback){
	connection.query("INSERT into ingredient_to_dish (ingredient_id,dish_id)VALUES(?,?)",[ingredient.data.id,dish.data.id],function(err,result){
		if(err) callback(err)
		else{
			if(result.insertId)
				callback(null,null) ;
			else {
				callback(null,"error combining");
			}
		}
	});
}
connection.combiner= combiner;
module.exports=database=connection

/*

module.exports=database={
	query:function(statement,data,callback){
		var qry=connection.query(statement,data,function(err,result){
			if(err){
				console.log(err);
				err="Database error";
			}
			callback(err,result);
			return qry;
		});
	},
	combiner:combiner
};

*/
