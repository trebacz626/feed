var User = require('../Helpers/UserModel.js');
module.exports=function(data,callback){

  var user = new User(data.userInfo);
  user.login(data.userInfo.email,data.userInfo.password,callback);
}
