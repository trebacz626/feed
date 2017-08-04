var User = require('../Helpers/UserModel.js');
var Ingredient = require('../Helpers/IngredientModel.js');
var Dish = require('../Helpers/DishModel.js');
var async = require('async');



module.exports=function(data,callback){
  var user = new User(data.userInfo);
  var ingredients = data.activityData.dish.ingredients;
  var dish = new Dish(data.activityData.dish);
  async.waterfall([function(next){
    user.googleLogin(next);
  },
  function(success,next){
    if(success){
      data.userInfo.token=user.data.token;
      console.log("calling check ingredients");
    Ingredient.checkIngredients(ingredients,next);
    console.log("checking ingredients done");

    }else {
      callback(null,null,"login failed");
    }
  },
  function(message,next){
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
/*  var user = new User(data.userInfo);
  user.login(function(err,user){
    var ingredients = data.activityData.dish.ingredients;
    Ingredient.checkIngredients(ingredients,function(err,message){
      if(err){
        callback(err);
      }else{
        if(message){
            callback(err,message);
        }else{
          var dish = new Dish(data.activityData.dish);
          dish.save(function(err){
            if(err){
              callback(err,"there was an error");
            }else{
              ingredientToDish.save(ingredients,dish,function(err){
                if(err){
                  callback(err)
                }
                dishToUser.save(dish,user,function(err)){

                };
              });
            }
          });
        }
      }

    });
  });*/
}
