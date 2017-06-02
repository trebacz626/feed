var connection= require('./database');
var async = require('async');

var Ingredient = require("./IngredientModel");


var Dish = function(data){
  this.data=data;
}

Dish.prototype.data = {}

Dish.getById = function (id,callback) {
  connection.query("SELECT name,recipe,author_id from dishes where dish_id=?",id,function(err,rows){
    if(err){
      callback(err);
    }else{
      data={
        name:rows[0]['name'],
        picture:rows[0]['picture']
      };
      callback(null,data);
    }
  });
};

Dish.simpleSearch= function(ingredients,callback){
  var query="SELECT dishes.dish_id,dishes.name,dishes.recipe,ingredients.ingredient_name FROM dishes INNER JOIN ingredient_to_dish ON dishes.dish_id=ingredient_to_dish.dish_id INNER JOIN ingredients ON ingredients.ingredient_id=ingredient_to_dish.ingredient_id where ingredients.ingredient_name in (";
  for(var i=0;i<ingredients.length;i++){
    if(ingredients[i].data.id!=null){
      if(i>0){
        query+=", ";
      }
      query+="'"+ingredients[i].data.name+"'";
    }
  }
  query+=") group by dishes.dish_id, dishes.name ";

  connection.query(query,{},function(err,rows){
    if(err){
      callback(err);
    }else{
      var dishes=new Array();
      var items=new Array();
      for(var i=0;i<rows.length;i++){
        var dish= new Dish({});
        dish.data.name=rows[i].name;
        dish.data.recipe=rows[i].recipe;
        dish.data.ingredients= new Array();
        dish.data.id=rows[i].dish_id;
        dishes.push(dish);
        items.push({
          query:"SELECT ingredients.ingredient_name,ingredients.ingredient_id FROM ingredients INNER JOIN ingredient_to_dish ON ingredients.ingredient_id=ingredient_to_dish.ingredient_id WHERE dish_id="+ dish.data.id,
          index:i
        });
      };

      async.each(items,function(item,callback){
        connection.query(item.query,{},function(err,rows){
          if(err){
            callback(err);
          }else{
            for(var i=0;i<rows.length;i++){

            dishes[item.index].data.ingredients.push(new Ingredient({
              name:rows[i].ingredient_name,
              id:rows[i].ingredient_id}));
          }
          callback();
          }
        });
      },
      function(err){
        if(err){
          callback(err);
        }else{
          for(var i=0;i<dishes.length;i++){
            for(var a=0;a<dishes[i].data.ingredients.length;a++){
              console.log(a);
              var was=false;
              for(var b=0;b<ingredients.length;b++){
                if(dishes[i].data.ingredients[a].data.name==ingredients[b].data.name){
                  was=true;
                }
              }
              if(!was){
                 dishes[i].data.tooMuch=true;//has too much ingredients
                break;
              }else{
                 dishes[i].data.tooMuch=false;
              }
            }
          }
          callback(null,dishes);
        }
      });



  }
});
}



Dish.prototype.checkIfExist = function (callback) {
  var self = this;
  connection.query("SELECT 	dish_id from dishes WHERE name=?",self.data.name,function(err,rows){
    if(err){
      callback(err);
    }else{
      if(!rows.length){
        callback(null,false);
      }else{
        self.data.id=rows[0]['ingredient_id'];
        callback(null,true);
      }
    }
  });
}

Dish.prototype.save = function(callback){
  var self = this;
  connection.query("INSERT into dishes(name,recipe,author_id)VALUES(?,?,?)",[self.data.name,self.data.recipe,self.data.author_id],function(err,result){
    if(err){
      callback(err);
    }else{
      if(!result.insertId){
      }
      self.data.id=result.insertId
      async.forEach(self.data.ingredients,function(ingredient,next){
        connection.combiner.ingredientToDish(ingredient,self,next);

      },function(err){
        if(err){
          callback(err);
        }else{
          callback(null);
        }
      });
    }
  });
}


module.exports= Dish;
