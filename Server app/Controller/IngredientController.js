var Ingredient= require("../Model/Helpers/IngredientModel");
var Dish= require("../Model/Helpers/DishModel");
var User= require("../Model/Helpers/UserModel");
var async=require("async");
var datSerializer=function(req,res,next){
  console.log("serialize")
  var data={
    ingredient:{
					id:null,
					name:req.body.name
				}
  }
  res.locals.data=data;
    next();
}
post={
  name:'',
  special_path:null,
  method:'post',
  task:function(req,res,next){
    var user = res.locals.user;
    var ingredient= new Ingredient(res.locals.data.ingredient);
    async.waterfall([
      function(callback){
        ingredient.checkIfExist(callback);
      },
      function(exists,callback){
        if(!exists){
          console.log(ingredient);
          ingredient.save(callback);
        }else{
          res.json({
            userInfo:user.data,
            message:"this ingredient already exists"
          });
        }
      }
    ],function(err){
      if(err){
        console.log(err);
        res.json({
          userInfo:user.data,
          error:err
        });
      }else{
        res.json({
          userInfo:user.data,
          ingredient:ingredient.toResponse()
        });
      }
    });

  },
  neededData:[],
  authenticationLevel:1,
  localMiddlewares:[
    datSerializer
  ]
}


var activities=[];
activities.push(post);
console.log(activities);
controller={
  name:'ingredient',
  activities:activities
}
module.exports= controller;
