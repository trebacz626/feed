var Ingredient= require("../Model/Helpers/IngredientModel");
var Dish= require("../Model/Helpers/DishModel");
var User= require("../Model/Helpers/UserModel");
var async=require("async");

var Controller=require("../Utils/Controller");
var Activity = require("../Utils/Activity");

var dishController = new Controller();
dishController.name="dish";

var post = new Activity();
post.method=Activity.Methods.Get;
post.task=function(req,res,next){
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
  }
post.authenticationLevel=Activity.AuthLevels.User;
post.neededData=["dishName","recipe","ingredient"];
post.localMiddlewares.push(function dataSerializer(req,res,next){
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
});


var get =new Activity();
get.method=Activity.Methods.Get;
get.authenticationLevel=Activity.AuthLevels.User;
get.neededData=["id"];
get.localMiddlewares.push(function(req,res,next){
  console.log()
  var data={
    dish:{
          id:req.query.id
        }
  }
  res.locals.data=data;
  next();
});
get.task=function(req,res,next){
  console.log("id");
  var user = res.locals.user;
  async.waterfall([
    function(next){
      console.log("Get by id")
      Dish.getById(res.locals.data.dish.id,next);
    }],
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
}


var put = new Activity();
put.method=Activity.Methods.Put;
put.authenticationLevel=Activity.AuthLevels.User;
put.neededData=["id","dishName","recipe","ingredient"];
put.localMiddlewares.push(function(req,res,next){
  console.log()
  var data={
    dish:{
          id:req.query.id
        }
  }
  res.locals.data=data;
  next();
});
put.task=function(req,res,next){
  var user=res.locals.user;
  var newDish=res.locals.data.dish;
  var oldDish={};
  async.waterfall([function(next){
      Dish.getById(newDish.data.id,function(err,dish){
        oldDish=dish;
        next(err);
      });
    },function(next){
      if(user.data.id===oldDish.data.author_id){
        newDish.update(oldDish,next);
      }else{
        next("It's not your dish");
      }
    }],
    function(err){
      if(err)res.json({error:err});
      else res.json({
        dish:newDish
      });

    });
};

//TODO delete

dishController.activities.push(post);
dishController.activities.push(get);
dishController.activities.push(put);

module.exports= dishController;
