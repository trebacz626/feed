var User= require("../Model/Helpers/UserModel");
var async=require("async");


google={//return access_token and refresh token
  name:'google',
  special_path:null,
  method:'get',
  task:function(req,res,next){
    console.log("id");
    var user = res.locals.user;
    async.waterfall([
      user.googleSignUp(callback),
      function(success){
        if(success){
          res.json({
            userInfo:user.toResponse()
          })
        }else{
          res.json({
            error:"Could not sign in with google"
          });
        }
      }
  ],
    function(err){
      console.log(err);
      if(err) res.json({
        userInfo:user.toResponse(),
        error:err
      });
      else{
        res.json({
          userInfo:user.toResponse(),
          dish:dish.toResponse()
        });
      }
    }
);
  },
  neededData:[],
  authenticationLevel:0,
  localMiddlewares:[
    function(req,res,next){
      console.log("serialize")
      var data={
        code:req.body.code
      }
      res.locals.data=data;
        next();
    }
  ]

}

refreshAccessToken={//refreshAccess token and return
  name:'refreshaccesstoken',
  special_path:null,
  method:'get',
  task:function(req,res,next){
    console.log("refreshaccess token");
    var user;
    async.waterfall([
    function(callback){
      User.getByRefreshToken(res.locals.data.refresh_token,callback);

    },function(receviedUser,callback){
      user=receviedUser;
      user.data.access_token=user.generateAccessToken();
      callback();
    }
  ],
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
  },
  neededData:[],
  authenticationLevel:0,
  localMiddlewares:[
    function(req,res,next){
      console.log("serialize")
      var data={
        refresh_token:req.query.refresh_token
      }
      res.locals.data=data;
        next();
    }
  ]

}
var activities=[];
activities.push(google);
activities.push(refreshAccessToken);
console.log(activities);
controller={
  name:'auth',
  activities:activities
}
module.exports= controller;
