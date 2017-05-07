var mysql= require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
  user     : 'simple-cookingdbadmin',
  password : 'simple-cookingdbadmin626',
  database : 'simple-cookingdb'

});

module.exports=connection;
