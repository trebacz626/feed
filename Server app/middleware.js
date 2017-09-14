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

var authenticate = function(role){
  return function(req,res,next){
    var access_token = req.body.access_token || req.body.access_token || req.headers['access_token'];
    var device_key = req.body.device_key || req.body.device_key || req.headers['device_key'];
    if (!device_key) {
      res.json({
        error:"No device key provided"
      });
      return;
    }
    if(access_token){
      var oauth2Client = googleStuff.getOAuthClient();
      var user = new User({access_token:access_token});
      async.waterfall([
        function (callback) {
          connection.query("SELECT 	refresh_token,user_id from users WHERE access_token=? AND device_id=?", [user.data.token, device_key], callback);
        },
        function(rows,fields,callback){
          if(rows.length){
            user.data=rows[0];
            oauth2Client.setCredentials({
              access_token:user.data.access_token,
              refresh_token:rows[0]['refresh_token'],
               expiry_date: true
            });
            oauth2Client.getAccessToken(function(err,access_token){
              callback(err,access_token);
            });


          }else{
            callback("Invalid token");
          }
        },function(access_token,callback){
          user.data.access_token=access_token;
          connection.query("UPDATE users SET access_token=? WHERE user_id=?",[access_token ,user.data.id],callback);

        },function(result,fields,callback){
          googleStuff.plus.people.get({ userId: 'me', auth: oauth2Client }, function(err,data){
            callback(err,data);
          });
        }
        ,function(data,callback){
          callback();
        }
      ],function(err){
        if(err) res.status(401).send("Invalid token");
        else{
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
