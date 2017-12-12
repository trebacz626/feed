var express = require('express');
var router = express.Router();
var loginActivity = require('../Model/Activity/LoginActivityModel');
var addIngredientActivity = require('../Model/Activity/AddIngredientActivityModel');
var addDishActivity = require('../Model/Activity/AddDishActivityModel');
var simpleSearchActivity = require('../Model/Activity/SimpleSearchActivityModel');
var loginGoogleActivityModel = require('../Model/Activity/LoginGoogleActivityModel');
var Ingredient = require('../Model/Helpers/IngredientModel');
var crypto = require('crypto');
var middleware= require('../middleware');
function md5(string) {
	return crypto.createHash('md5').update(string).digest('hex');
}


require('../Controller/controllers.js')(router);
console.log("rr");


module.exports=router;
