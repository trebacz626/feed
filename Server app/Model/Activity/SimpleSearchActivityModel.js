var User = require('../Helpers/UserModel.js');
var Ingredient = require('../Helpers/IngredientModel.js');
var Dish = require('../Helpers/DishModel.js');
var async = require('async');


module.exports=function(data,callback){

  var user = new User(data.userInfo);
  var ingredients = data.activityData.ingredients;
  var dish = new Dish(data.activityData.dish);

  async.waterfall([function(next){
    user.login(next)
  },
  function(success,next){
    if(success){
      console.log("calling check ingredients");
    Ingredient.checkIngredients(ingredients,next);
    console.log("checking ingredients done");

    }else {
      callback(null,"login failed");
    }
  },
  function(message,next){
    if(message) callback(null,message);
    else{

      console.log("calling save")
      Dish.simpleSearch(ingredients,next);
    }
  }
],
  function(err,dishes){
    if(err) callback(err);
    else{
      callback(err,"search success",dishes);
    }
  }
);
}
