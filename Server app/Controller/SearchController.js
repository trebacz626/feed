var Ingredient= require("../Model/Helpers/IngredientModel");
var Dish= require("../Model/Helpers/DishModel");
var User= require("../Model/Helpers/UserModel");
var async=require("async");
var datSerializer=function(req,res,next){
  console.log("serialize")
  var data={
      ingredients:new Array()
  }
  for(var i=0;i<req.query.ingredient.length;i++){
    var ing = new Ingredient({id:null,name:req.query.ingredient[i]});
    data.ingredients.push(ing);
  }
  res.locals.data=data;
    next();
}
simple={
  name:'simple',
  special_path:null,
  method:'get',
  task:function(req,res,next){
    var user =res.locals.user;
    var ingredients = res.locals.data.ingredients;
    var dish = new Dish(res.locals.data.dish);

    async.waterfall([function(next){
        console.log("calling check ingredients");
      Ingredient.checkIngredients(ingredients,next);
    },
    function(message,next){
      if(message) res.json({
        userInfo:user.data,
        message:message
      });
      else{

        console.log("calling save")
        Dish.simpleSearch(ingredients,next);
      }
    }
  ],
    function(err,dishes){
      if(err) res.json({
        userInfo:user.data,
        error:err
      });
      else{
        console.log(user.data);
        res.json({
          userInfo:user.data,
          dishes:dishes
        })
      }
    }
  );
  },
  neededData:[],
  authenticationLevel:0,
  localMiddlewares:[
    datSerializer
  ]
}


var activities=[];
activities.push(simple);
controller={
  name:'search',
  activities:activities
}
module.exports= controller;
