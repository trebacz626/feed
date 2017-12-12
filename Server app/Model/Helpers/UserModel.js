var connection= require('./database');
var async = require('async');
var googleStuff = require('../../services/google');
var crypto = require('crypto');
var jwt=require("jsonwebtoken");
var authConfig=require("../../config/auth")
var User = function(data){
  this.data=data;
}

User.prototype.data = {}

User.getById = function (id,callback) {
  connection.query("SELECT name,picture from users where user_id=?",id,function(err,rows){
  if(err){
    callback(err);
  }else{
    data={
      user_id:id,
      name:rows[0]['name'],
      picture:rows[0]['picture']
  };
    callback(null,new User(data));
  }
});
};


User.checkIfExist = function (email,callback) {
  connection.query("SELECT 	user_id from users WHERE email=?",email,function(err,rows){
    if(err){
      callback(err);
    }else{
      if(!rows.length){
        callback(null,false);
      }else{
        callback(null,true);
      }
    }
  });
}
User.prototype.save = function(email,password,callback){
  connection.query("INSERT into users(email,password)VALUES(?,?)",[email,password],function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result.insertId);
    }
  });
}


User.prototype.generateRefreshToken=function(){
  var self=this;
  return self.data.user_id+'.'+crypto.randomBytes(40).toString('hex');
}

User.prototype.generateAccessToken=function(){
  var self=this;
  return jwt.sign({
    id:self.data.user_id
  },authConfig.jwtSecret,
{
  expiresIn: 60*60
})
}

User.getByAccessToken=function(token,callback){
  jwt.verify(token,authConfig.jwtSecret,function(err,decoded){
    if(err){
      callback("Invalid access token");
    }else{
      console.log("verified");
      User.getById(decoded.id,function(err,user){
        if(err) callback(err);
        else{
          callback(err,user);
        }
      })
    }
  });
}

User.getByRefreshToken=function(token,callback){
  console.log(token);
  connection.query("SELECT user_id,name,picture from users where refresh_token=?",token,function(err,rows){

  if(err){
    console.log("error");
    callback(err);
  }else{
    console.log(rows[0]);
    if(!rows.length){
      callback("wrong refresh token");
    }else{
    callback(null,new User(
      {user_id:rows[0]['user_id'],
      name:rows[0]['name'],
      picture:rows[0]['picture']
  }));
  }
  }
});
}


User.prototype.toResponse=function(){
  var response=this.data;
  return response;
}

module.exports= User;
