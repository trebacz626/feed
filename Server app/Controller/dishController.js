var Ingredient= require("../Model/Helpers/IngredientModel");
var Dish= require("../Model/Helpers/DishModel");
var User= require("../Model/Helpers/UserModel");
var async=require("async");
var datSerializer=function(req,res,next){
  console.log("serialize")
  var data={
    dish:{
					name:req.body.dishName,
					ingredients:new Array(),
					recipe:req.body.recipe,
					author_id:null,
				}
  }

  for(let i=0;i<req.body.ingredient.length;i++){
			var ing = new Ingredient({id:null,name:req.body.ingredient[i]});
			data.dish.ingredients.push(ing);
		}
    res.locals.data=data;
    next();
}
post={
  name:'',
  special_path:null,
  method:'post',
  task:function(req,res,next){
    console.log(res.locals);
    var user = res.locals.user;
    var ingredients = res.locals.data.dish.ingredients;
    var dish = new Dish(res.locals.data.dish);
    async.waterfall([
    function(next){
        console.log("calling check ingredients");
      Ingredient.checkIngredients(ingredients,next);
      console.log("checking ingredients done");

    },
    function(message,next){
      if(message) res.json({
        userInfo:user.toResponse(),
        message:message
      });
      else{
        console.log(dish);
        dish.data.author_id=user.data.id//11;
        console.log("calling save")
        dish.save(next);
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
  authenticationLevel:1,
  localMiddlewares:[
    datSerializer
  ]

}

get={
  name:'',
  special_path:null,
  method:'get',
  task:function(req,res,next){
    console.log("id");
    var user = res.locals.user;
    async.waterfall([
    function(next){
      console.log("Get by id")
        Dish.getById(res.locals.data.dish.id,next);

    }
  ],
    function(err,dish){
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
      console.log()
      var data={
        dish:{
    					id:req.query.id
    				}
      }
      res.locals.data=data;
      next();
    }
  ]

}
var activities=[];
activities.push(post);
activities.push(get);
controller={
  name:'dish',
  activities:activities
}
module.exports= controller;
