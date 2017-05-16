
var addIngredientActivity = require('./Model/Activity/AddIngredientActivityModel');

var crypto = require('crypto');
function md5(string) {
	return crypto.createHash('md5').update(string).digest('hex');
}

var data={
  userInfo:{
    id:null,
    email:"qwe@wp.pl",
    password:md5("qwe"),
  },
  activityData:{
    ingredient:{
      id:null,
      name:"egg"
    }
  }
}

addIngredientActivity(data,function(err,message){
  if(err){
    console.log(err);
  }else{
    console.log(message);
  }
});
