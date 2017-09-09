var User = require('../Helpers/UserModel.js');
var Ingredient = require('../Helpers/IngredientModel.js');
var Dish = require('../Helpers/DishModel.js');
var async = require('async');



module.exports=function(data,callback){
  var user = data.user;
  var ingredients = data.activityData.dish.ingredients;
  var dish = new Dish(data.activityData.dish);
  async.waterfall([
  function(next){
      console.log("calling check ingredients");
    Ingredient.checkIngredients(ingredients,next);
    console.log(ingredients);
    console.log("checking ingredients done");

  },
  function(message,next){
    console.log(message);
    if(message) callback(null,user,message);
    else{
      dish.data.author_id=user.data.id;
      console.log("calling save")
      dish.save(next);
    }
  }
],
  function(err){

    if(err) callback(err,user);
    else{
      callback(err,user,"dish added succesfully")
    }
  }
);
}
