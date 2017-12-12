var connection= require('./database');
var async = require('async');
var googleStuff = require('../../services/googleVB');
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
    callback(null,new User( User.convertDataFromDatabase(rows[0])));
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
User.prototype.save = function(callback){
  var self = this;
  connection.query("INSERT into users(name,email,google_id,picture,google_refresh_token)VALUES(?,?,?,?,?)",[self.data.name,self.data.email,self.data.googleId,self.data.picture,self.data.googleRefreshToken],function(err,result){
    if(err){
      callback(err);
    }else{
      self.data.id=result.insertId;
      callback(null);
    }
  });
}

<<<<<<< HEAD
=======
User.prototype.update = function(DBvalueName,userValue,callback){
  var self = this;
  connection.query("UPDATE users SET "+DBvalueName+"=? WHERE user_id = ?",[userValue,self.data.id],function(err,result){
    callback(err,result);
  });
}

User.prototype.login=function(callback){
  var user =this;
  if(!this.data.id){
    connection.query("SELECT 	user_id from users WHERE email=? AND password=?",[user.data.email,user.data.password],function(err,rows){

      if(err){
        callback(err);
      }else{
        if(rows.length){
          user.data.id=rows[0]['user_id'];
          callback(err,1);
        }else{
          callback(err,0);
        }
      }
    });
  }

}
User.convertDataFromDatabase=function(row){
  return{
    id:row['user_id'],
    name:row['name'],
    email:row['email'],
    picture:row['picture'],
    refreshToken:row['refresh_token'],
    googleId:row['google_id'],
    googleRefreshToken:row['google_refresh_token']
  }

}


User.getByGoogleId=function(gId,callback){
  connection.query("SELECT 	user_id,name,email,picture,refresh_token from users WHERE google_id=?",gId,function(err,rows){
    if(err)callback(err);
    else{
      if(!rows.length){callback("There is no user with this id");return;}
      var user=new User( User.convertDataFromDatabase(rows[0]));
      callback(err,user);
    }
  })
}

User.checkIfExistByGoogleId = function (gId,callback) {
  connection.query("SELECT 	user_id from users WHERE google_id=?",gId,function(err,rows){
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

User.prototype.googleSignUp=function(callback){
  var user=this;
  var oauth2Client = googleStuff.getOAuthClient();
  if(user.data.code){
    oauth2Client.getToken(user.data.code, function(err, tokens) {
          // Now tokens contains an access_token and an optional refresh_token. Save them.
          if(!err) {
            oauth2Client.setCredentials(tokens);
            var p = new Promise(function (resolve, reject) {
                    googleStuff.plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
              console.log("user ERROR");
              console.log(err);
                        resolve(response || err);
                    });
                }).then(function (data) {
                    //user.data.token=tokens.access_token;
                    connection.query("SELECT 	user_id,name,email,google_id,picture,refresh_token from users WHERE google_id=?",data.id,function(err,rows){
                      if(err){

                        callback(err,0);

                      }else{
                      if(!rows.length){
                        console.log(data);
                        connection.query("INSERT into users(name,email,google_id,picture,google_refresh_token,refresh_token)VALUES(?,?,?,?,?,?)",[data.displayName,data.emails[0].value,data.id,data.image.url,tokens.refresh_token,user.generateRefreshToken()],function(err,result){
                          if(err){
                            console.log(err);
                            callback(err,0);
                          }else{
                            console.log(result);
                            user.data.id=result.insertId;
                          callback(err,1);
                        }


                        });
                      }else{
                        user.data.id=rows[0]['user_id'];
                        callback(err,1);

                      }
                    }
                  });
                });
          }
          else{

            callback("Wrong code",0);
          }
        });
  }else{
    callback("no code",0);
  }
}
>>>>>>> e2385152e8973206e73ec038096bdca0037954de

User.prototype.generateRefreshToken=function(){
  var self=this;
  return self.data.id+'.'+crypto.randomBytes(40).toString('hex');
}

User.prototype.generateAccessToken=function(){
  var self=this;
  return jwt.sign({
    id:self.data.id
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
          user.data.id=decoded.id;
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
    callback(null,new User( User.convertDataFromDatabase(rows[0])));
  }
  }
});
}


User.prototype.toResponse=function(){
  var response=this.data;
  return response;
}

module.exports= User;
