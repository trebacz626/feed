var mysql= require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
  user     : 'simple-cookingdbadmin',
  password : 'simple-cookingdbadmin626',
  database : 'simple-cookingdb'

});
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
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
module.exports=connection;
