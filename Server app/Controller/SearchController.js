var Ingredient= require("../Model/Helpers/IngredientModel");
var Dish= require("../Model/Helpers/DishModel");
var User= require("../Model/Helpers/UserModel");
var async=require("async");

var Controller=require("../Utils/Controller");
var Activity = require("../Utils/Activity");
var searchController = new Controller();
searchController.name="search";

var simple = new Activity();
simple.name="simple";
simple.method=Activity.Methods.Get;
simple.authenticationLevel=Activity.AuthLevels.Guest;
simple.neededData=["ingredient"];
simple.task=function(req,res,next){
  var user =res.locals.user;
  var ingredients = res.locals.data.ingredients;
  var dish = new Dish(res.locals.data.dish);

  async.waterfall([function(next){
    Ingredient.checkIngredients(ingredients,next);
    },
    function(message,next){
      if(message) res.json({
        userInfo:user.data,
        message:message
      });
      else{

        Dish.simpleSearch(ingredients,next);
      }
    }],
    function(err,dishes){
      if(err) res.json({
        userInfo:user.data,
        error:err
      });
      else{
        var toResponsedishes=[];
        for(let i=0;i<dishes.length;i++){
          toResponsedishes.push(dishes[i].toResponse());
        }
        console.log(user.data);
        res.json({
          userInfo:user.data,
          dishes:toResponsedishes
        });
      }
    }
  );
};
simple.localMiddlewares.push(function serializer(req,res,next){
  var data={
      ingredients:new Array()
  }
  for(var i=0;i<req.query.ingredient.length;i++){
    var ing = new Ingredient({id:null,name:req.query.ingredient[i]});
    data.ingredients.push(ing);
  }
  res.locals.data=data;
    next();
});

searchController.activities.push(simple);
module.exports= searchController;
