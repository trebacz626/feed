var Ingredient = require('../Helpers/IngredientModel.js');
var User = require('../Helpers/UserModel.js');
module.exports=function(data,callback){

  var user = new User(data.userInfo);
  user.login(function(err,success){
    if(err){
      callback(err);
    }else{
      if(success){
        var ingredient= new Ingredient(data.activityData.ingredient);
        ingredient.checkIfExist(function(err,exists){
          if(!exists){
            ingredient.save(function(err,next){
              callback(err,ingredient.data.name+" added succesfully");
            });
          }else{
            callback(err,"this ingredient already exists");
          }
        });
      }else{
        callback(err,"loginFailed");
      }
    }
  });
}
