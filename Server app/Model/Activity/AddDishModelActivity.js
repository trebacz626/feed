var Ingredient = require('../Helpers/IngredientModel.js');
var async = require('async');
function checkIngredients(callback,ingredients){
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
  user.login(function(err,user){

  });
}
