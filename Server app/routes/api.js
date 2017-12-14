var express = require('express');
var router = express.Router();
var Ingredient = require('../Model/Helpers/IngredientModel');
var crypto = require('crypto');
var middleware= require('../middleware');
function md5(string) {
	return crypto.createHash('md5').update(string).digest('hex');
}


require('../Controller/controllers.js')(router);

module.exports=router;
