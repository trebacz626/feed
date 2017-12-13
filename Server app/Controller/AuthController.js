var User= require("../Model/Helpers/UserModel");
var async=require("async");
var googleStuff=require("../services/googleVB");

var Controller=require("../Utils/Controller");
var Activity = require("../Utils/Activity");

var authController = new Controller();
authController.name="auth";

var google = new Activity();
google.name="google/callback";
google.method=Activity.Methods.Get;
google.authenticationLevel=Activity.AuthLevels.Guest;
google.task=function(req,res,nextM){
  var user = res.locals.user;
  oauth2Client=googleStuff.getOAuthClient();
  var googleData ={};
  async.waterfall([
    function(next){
      oauth2Client.getToken(res.locals.data.code,function(err,tokens){ next(err,tokens)});
    },function(tokens,next){
      oauth2Client.setCredentials(tokens);
      googleStuff.plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {next(err,response)});
    },function(data,next){
      googleData=data;
      User.checkIfExistByGoogleId(googleData.id,next);
    },function(exists,next){
      if(exists){
        User.getByGoogleId(googleData.id,next);
      }else{
        var userLoc = new User({
          googleId:googleData.id,
          googleRefreshToken:oauth2Client.credentials.refresh_token,
          name:googleData.displayName,
          email:googleData.emails[0].value,
          picture:googleData.image.url,
        });
        userLoc.save(function(err){
          if(err){next(err);return;}
          userLoc.data.refreshToken=userLoc.generateRefreshToken();
          userLoc.update("refresh_token",userLoc.data.refreshToken,function(err,result){
            if(err){next(err);return;}
            next(err,userLoc);
          });

        });
      }
    },function(receviedUser,next){
      user=receviedUser;
      user.data.accessToken=user.generateAccessToken();
      next(null);
    }],
    function(err){
      if(err) res.json({
        error:err
      });
      else{
        res.json({
          userInfo:user.toResponse()
        });
      }
    }
  );
};
google.localMiddlewares.push(function serialize(req,res,next){
  var data={
    code:req.query.code
  }
  res.locals.data=data;
    next();
});

var refreshAccessToken = new Activity();
refreshAccessToken.name='refreshaccesstoken';
refreshAccessToken.method=Activity.Methods.Get;
refreshAccessToken.authenticationLevel=Activity.AuthLevels.Guest;
refreshAccessToken.task =function(req,res,next){
  var user;
  async.waterfall([
    function(callback){
      User.getByRefreshToken(res.locals.data.refresh_token,callback);

    },function(receviedUser,callback){
      user=receviedUser;
      user.data.access_token=user.generateAccessToken();
      callback();
    }],
    function(err){
      console.log(err);
      if(err) res.json({
        userInfo:user.toResponse(),
        error:err
      });
      else{
        res.json({
          userInfo:user.toResponse()
        });
      }
    }
  );
};
refreshAccessToken.localMiddlewares.push( function serialize(req,res,next){
  var data={
    refresh_token:req.query.refresh_token
  }
  res.locals.data=data;
    next();
});

authController.activities.push(google);
authController.activities.push(refreshAccessToken);

module.exports= authController;
