var Ingredient = require('./IngredientModel.js');
var Dish = require('./DishModel.js');


var ingredient1 = new Ingredient({ id: null, name: 'egg' });
var ingredient2 = new Ingredient({ id: null, name: 'pasta' });

var ingredients=[ ingredient1,ingredient2 ];

Ingredient.checkIngredients(ingredients,function(err,message){
  if(err||message){
    console.log(err+message);
  }else{
    Dish.simpleSearch(ingredients,function(err,dishes){
      if(err){
        console.log(err);
      }else{
        for(var i=0;i<dishes.length;i++){
        }
      }
    });
  }
});
