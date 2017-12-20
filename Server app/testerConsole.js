var  User = require("./Model/Helpers/UserModel");
var  Ingredient = require("./Model/Helpers/IngredientModel");
var Pair = require("./Utils/Pair");
var user = new User({
  id:5,
  name:"Kacper",
  email:"email@mail.com",
  refreshToken:"12345"
});

var Dish = require("./Model/Helpers/DishModel");

var gotten= new Dish({ id: 10,
  name: 'apple egg',
  recipe: '1. Boil egg\r\n2. Eat egg and apple',
  ingredients: [ new Ingredient({ id: 1, name: 'egg' }),
   new Ingredient({ id: 2, name: 'apple' }),
 new Ingredient({ id: 3, name: 'chocolate' }) ],
 authorId:15
});
gotten.updateAll(function(err){
  console.log(err||"dish Updated succesfully");
  Dish.getById(gotten.data.id,function(err,dish){
    console.log(dish.toResponse());
  });
});
