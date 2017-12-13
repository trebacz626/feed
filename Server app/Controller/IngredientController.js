var Ingredient= require("../Model/Helpers/IngredientModel");
var Dish= require("../Model/Helpers/DishModel");
var User= require("../Model/Helpers/UserModel");
var async=require("async"); 
var Controller=require("../Utils/Controller");
var Activity = require("../Utils/Activity");

var ingredientController=new Controller();
ingredientController.name="ingredient";

var post = new Activity();
post.method=Activity.Methods.Post;
post.authenticationLevel=Activity.AuthLevels.User;
post.localMiddlewares.push(function(req,res,next){
  console.log("serialize")
  var data={
    ingredient:{
					id:null,
					name:req.body.name
				}
  }
  res.locals.data=data;
    next();
});
post.task=function(req,res,next){
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

};

var get = new Activity();
get.method=Activity.Methods.Get;
get.authenticationLevel=Activity.AuthLevels.Guest;
get.task=function(reqq,res,next){

};

ingredientController.activities.push(post);
ingredientController.activities.push(get);



module.exports= ingredientController;
