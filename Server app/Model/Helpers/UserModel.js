var connection= require('./database');
var async = require('async');
var googleStuff = require('../../config/google');

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
User.prototype.save = function(email,password,callback){
  connection.query("INSERT into users(email,password)VALUES(?,?)",[email,password],function(err,result){
    if(err){
      callback(err);
    }else{
      callback(null,result.insertId);
    }
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
                        resolve(response || err);
                    });
                }).then(function (data) {
                    user.data.token=tokens.access_token;
                    connection.query("SELECT 	user_id from users WHERE google_id=?",data.id,function(err,rows){
                      if(err){

                        callback(err,0);

                      }else{
                      if(!rows.length){
                        console.log(data);
                        connection.query("INSERT into users(name,email,google_id,picture,access_token,refresh_token)VALUES(?,?,?,?,?,?)",[data.displayName,data.emails[0].value,data.id,data.image.url,tokens.access_token,tokens.refresh_token],function(err,result){
                          if(err){
                            console.log(err);
                            callback(err,0);
                          }else{
                            user.data.id=result.insertId;
                          callback(err,1);
                        }


                        });
                      }else{
                        user.data.id=rows[0]['user_id'];
                          connection.query("UPDATE users SET access_token=? WHERE user_id=?",[user.data.token ,user.data.id],function(err,result){
                            if(err){
                              callback(err,0);
                            }else{
                              callback(err,1)
                            }
                          });

                      }
                    }
                  });
                });
          }
          else{
            callback(err,0);
          }
        });
  }else{
    callback("no code",0);
  }
}


User.prototype.googleLogin=function(callback){
  var user=this;
  var oauth2Client = googleStuff.getOAuthClient();
  async.waterfall([
    function(next){
      connection.query("SELECT 	refresh_token,user_id from users WHERE access_token=?",user.data.token,next);
    },
    function(rows,fields,next){
      if(rows.length){
        user.data.id=rows[0]['user_id'];
        var tokens={
          access_token:user.data.token,
          refresh_token:rows[0]['refresh_token'],
           expiry_date: true
        };
        oauth2Client.setCredentials(tokens);
        oauth2Client.getAccessToken(function(err,access_token){
          next(err,access_token);
        });


      }else{
        next("Invalid token");
      }
    },function(access_token,next){
      user.data.token=access_token;
      connection.query("UPDATE users SET access_token=? WHERE user_id=?",[access_token ,user.data.id],next);

    },function(result,fields,next){
      googleStuff.plus.people.get({ userId: 'me', auth: oauth2Client }, function(err,data){
        next(err,data);
      });
    }
    ,function(data,next){
      //user.data.d=data;
      console.log(user.data.d);
      next();
    }
  ],function(err){
    if(err) callback(err);
    else{
      callback(err,1);
    }
  });


}

module.exports= User;
