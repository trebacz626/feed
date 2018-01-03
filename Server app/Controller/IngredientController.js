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
post.neededData=["name"];
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
          error:"this ingredient already exists"
        });
      }
    }
  ],function(err){
    if(err){
      console.log(err);
      res.json({
        error:err
      });
    }else{
      res.json({
        ingredient:ingredient.toResponse()
      });
    }
  });

};

var get = new Activity();
get.method=Activity.Methods.Get;
get.authenticationLevel=Activity.AuthLevels.Guest;
get.neededData=["id"]
get.localMiddlewares.push(function dataSerializer(req,res,next){
  res.locals.data={id:req.query.id};
  next();
});
get.task=function(req,res,next){  
  console.log(res.locals.data);
  Ingredient.getById(res.locals.data.id,function(err,ingredient){
    if(err){
      console.log(err);
      res.json({error:err});
    }else{
      res.json({
        ingredient:ingredient.toResponse()
      });
    }
  });
};

var put = new Activity();//TODO Move to CMS
put.method=Activity.Methods.Put;
put.authenticationLevel=Activity.AuthLevels.IngredientModerator;
put.neededData=["id","name"];
put.localMiddlewares.push(function dataSerializer(req,res,next){
  res.locals.data={
    ingredient:{
      id:req.query.id,
      name:req.query.name
    }
  };

  next();
});
put.task=function(req,res,next){
  var ingredient=new Ingredient({id:res.locals.data.ingredient.id,name:res.locals.data.ingredient.name});
  ingredient.checkIfExist(function(err,exists){
    if(exists){
      ingredient.update(function(err,result){
        if(err){
          res.json({
            error:err
          })
        }else{
          res.json({
            ingredient:ingredient.toResponse()
          });
        }
      });
    }else{
      res.json({
        error:"this ingredient doesn't exist"
      })
    }
  });
}


ingredientController.activities.push(post);
ingredientController.activities.push(get);
ingredientController.activities.push(put);



module.exports= ingredientController;
