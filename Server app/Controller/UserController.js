var User= require("../Model/Helpers/UserModel");
var async=require("async");
var Controller=require("../Utils/Controller");
var Activity = require("../Utils/Activity");

var userController=new Controller();
userController.name="user";

var get = new Activity();
get.method=Activity.Methods.Get;
get.authenticationLevel=Activity.AuthLevels.Guest;
get.neededData=["id"];
get.localMiddlewares.push(function dataSerializer(req,res,next){
  res.locals.data={
    user:{
      id:req.query.id
    }
  };
  next();
});
get.task=function(req,res,next){
  User.getById(res.locals.data.user.id,function(err,user){
    if(err){
      res.json({
        error:err
      });
    }else{
      res.json({
        user:user.toResponse(true)
      });
    }
  });
};

var put = new Activity();
put.method=Activity.Methods.Put;
put.authenticationLevel=Activity.AuthLevels.User;
put.neededData=["name","email","picture"];
put.localMiddlewares.push(function dataSerializer(req,res,next){
  res.locals.data={
    user:{
      id:res.locals.user.data.id,
      name:req.body.name,
      email:req.body.email,
      picture:req.body.picture
    }
  };
  next();
});
put.task=function(req,res,next){
  var user=new User(res.locals.data.user);
  async.waterfall([function(next){
    User.getById(user.data.id,next);
  },function(user2,next){
    console.log("user gotten");
      user.updateBasic(next);
  }],function(err){
    if(err){
      console.log(err);
      res.json({
        error:err
      })
    }else{
        res.json({
          user:user.toResponse()
        })
    }
  })
}


userController.activities.push(get);
userController.activities.push(put);



module.exports= userController;
