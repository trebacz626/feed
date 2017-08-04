var User = require('../Helpers/UserModel.js');
var Ingredient = require('../Helpers/IngredientModel.js');
var Dish = require('../Helpers/DishModel.js');
var async = require('async');


module.exports=function(data,callback){

  var user = new User(data.userInfo);
  var ingredients = data.activityData.ingredients;
  var dish = new Dish(data.activityData.dish);

  async.waterfall([function(next){
    user.googleLogin(next)
  },
  function(success,next){
    if(success){
      console.log("calling check ingredients");
    Ingredient.checkIngredients(ingredients,next);
    console.log("checking ingredients done");

    }else {
      callback(null,null,"login failed");
    }
  },
  function(message,next){
    if(message) callback(null,null,message);
    else{

      console.log("calling save")
      Dish.simpleSearch(ingredients,next);
    }
  }
],
  function(err,dishes){
    if(err) callback(err);
    else{
      callback(err,user,"search success",dishes);
    }
  }
);
}
