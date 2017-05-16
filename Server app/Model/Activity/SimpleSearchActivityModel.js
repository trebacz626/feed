var User = require('../Helpers/UserModel.js');
module.exports=function(data,callback){

  async.series([user.login(next),
  function(success,next){
    if(success)
    Ingredient.checkIngredients(ingredients,next());
    else {
      callback(null,"login failed");
      break;
    }
  },function(message,next){
    if(message){
      callback(null,message);
      break;
    }else{
      
    }
  }],function(err,result){
    if(err)
      callback(err);
      else{
        callback(err,result)
      }
  }
  );
  var user = new User(data.userInfo);
  user.login(function(err,success){
    if(err){
      callback(err);
    }else{
      if(success){
        callback(err,user);
      }else{
        callback(err,user);
      }
    }
  });
}
