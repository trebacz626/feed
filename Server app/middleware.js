var googleStuff=require('./config/google');
var async= require('async');
var connection=require('./Model/Helpers/database');
var User = require('./Model/Helpers/UserModel');

var roles={
  Guest:0,
  User:1,
  Moderator:2,
  Admin:3
}

//rewrite for my own accessTokens
var authenticate = function(role){

  return function(req,res,next){
    console.log("auth");
    var access_token = req.body.access_token || req.body.access_token || req.headers['access_token'];
    if(access_token){
      async.waterfall([
        function(callback){
          console.log("getting by access token")
          User.getByAccessToken(access_token,callback);
        }

      ],function(err,user){
        console.log(user);
        if(err) res.status(401).json({
          error:err
        });
        else{
          res.locals.user=user;
          next();
        }
      });
    }else{
      if(role>0){
        res.status(401).send('No access_token provided');
      }else{
        res.locals.user= new User({role:roles.Guest,isAuthenticated:false});
        next();
      }
    }
  }
}


var checkData = function(table){
  return function(req,res,next){
    var hasAll=true;
    for(let i=0;i<table.length;i++){
      if(!(req.body[table[1]]||req.body[table[1]]||req.headers[[table[1]]])){
        hasAll=false
      }
    }
    if(hasAll){
      next()
    }else{
      res.status(400).send('not enough data');
    }
  }

}
module.exports={
  authenticate:authenticate,
  checkData:checkData
}
