var  User = require("./Model/Helpers/UserModel");
var  Ingredient = require("./Model/Helpers/IngredientModel");
var Dish=require("./Model/Helpers/DishModel");
var async = require("async");
var connection = require("./Model/Helpers/database");
/*var user = new User({
  id:5,
  name:"Kacper",
  email:"email@mail.com",
  refreshToken:"12345"
});
console.log("test 1");
 Dish.getById(42,function(err,dish){
  if(err){
    console.log(err);
    return;
  }
  //console.log(dish);
  dish.delete(function(err){
    if(err)console.log(err);
    else console.log("succesfully deleted");
  });

});

console.log("test 2");
Dish.getById(57,function(err,dishNew){
 if(err){
   console.log(err);
   return;
 }

 dishNew.data.id=47;
 Dish.getById(dishNew.data.id,function(err,dishOld){
   if(err){console.log(errr);return;}
   console.log(dishOld.toResponse());
   dishNew.updateAll(dishOld,function(err){
     if(err)console.log(err);
     else console.log(dishNew.toResponse());
   });
 });


});*/

/*var ingredient = new Ingredient({id:2});
ingredient.delete(function(err){
  if(err)console.log(err);
  else console.log("deleted");
});*/

var user = new User({id:27});
user.delete(function(err){
  if(err)console.log(err);
  else console.log("user deleted succesfully");
});
