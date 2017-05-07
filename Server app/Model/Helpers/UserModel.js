var connection= require('./database');
var async = require('async');

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
      name:rows[0]['name'],
      picture:rows[0]['picture']
  };
    callback(null,data);
  }
});
};

/*User.getById = function (id,mainCallback) {
  async.waterfall([
    function(next){
      connection.query("SELECT name,picture from users where user_id=?",id,next(err,rows));
    },
    function(err,rows,next){

    }
  ],main);
};*/

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
User.createNew = function(email,password,callback){
  connection.query("INSERT into users(email,password)VALUES(?,?)",[email,password],function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result.insertId);
    }
  });
}

User.prototype.login=function(email,password,callback){
  console.log("what"+this.data.id);
  if(!this.data.id){
    connection.query("SELECT 	user_id from users WHERE email=? AND password=?",[email,password],function(err,rows){
      if(err){
        callback(err);
      }else{
        if(rows.length){
          callback(null,rows[0]['user_id']);
        }else{
          callback("no user with this email and password",rows[0]['user_id']);
        }
      }
    });
  }
}
module.exports= User;
