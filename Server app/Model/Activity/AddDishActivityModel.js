var User = require('../Helpers/UserModel.js');
var Ingredient = require('../Helpers/IngredientModel.js');
var async = require('async');
function checkIngredients(ingredients,callback){
  var noingredient = new Array();
  async.forEach(Ingredients,function(ingredient,next){
    ingredient.checkIfExist(function(err,exists){
      if(err){
        next(err);
      }else{
        if(exists){
          next();
        }else{
          noIngredient.push(ingredient);
          next();
        }
      }
    });
  },function(err){
    if(err){
      callback(err);
    }else{
      if(noIngredient[0]){
        var message="there is no ";
        mergeString(noIngredient," and ",function(string){
          message+=string;
        });
        callback(null,message)
      }else{
        callback(null,null);
      }
  }
  });
}

function mergeString(tableOfData,separator,next){
  var string='';
  for(var i=0;i<tableOfData.length;i++){
    if(tableOfData[i]){
      string+=tableOfData[i];
    if(i!=tableOfData.length-1)
      string+=separator;
  }
  }
  next(string);
}


module.exports=function(data,callback){
  var user = new User(data.userInfo);
  var ingredients = data.activityData.dish.ingredients;
  var dish = new Dish(data.activityData.dish);
  async.series([
    user.login(next),
  function(success,next){
    if(success)
    Ingredient.checkIngredients(ingredients,next());
    else {
      callback(null,"login failed");
    }
  },
  function(message,next){
    if(message) callback(err,message); break;
    dish.save(next);
  },function(next){
    IngredientToDish.save(ingredients,dish,next);
  },function(next){
    dishToUser.save(dish,user,next);
  }
],
  function(err){
    if(err) callback(err);
    else{
      callback(err,"dish added succesfully")
    }
  }
);
  var user = new User(data.userInfo);
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
  });
}
