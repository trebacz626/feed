var User = require('../Helpers/UserModel.js');
module.exports=function(data,callback){

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
