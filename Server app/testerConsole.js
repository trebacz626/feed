var  User = require("./Model/Helpers/UserModel");
var Pair = require("./Utils/Pair");
var user = new User({
  id:5,
  name:"Kacper",
  email:"email@mail.com",
  refreshToken:"12345"
});

user.updateValues([User.dbPairs.name,User.dbPairs.email,User.dbPairs.refreshToken],function(err,result){
  console.log(err);
});
