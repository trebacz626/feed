var connection= require('./database');
var async = require('async');

var Ingredient = require("./IngredientModel");


var Dish = function(data){
  this.data=data;
}

Dish.prototype.data = {}

Dish.getById = function (id,callback) {
  var dish={};
  async.waterfall([
    function(cb){
      connection.query("SELECT name,recipe,author_id from dishes where dish_id=?",id,function(err,rows){
        if(err){
          err="Databse error"
        }
        cb(err,rows);
      });
    },function(rows,cb){
      if(!rows.length){
        cb("No dish with this id");
      }else{
        dish =new Dish({
          dish_id:id,
          name:rows[0].name,
          recipe:rows[0].recipe,
          author_id:rows[0].author_id
        });
        dish.getIngredients(cb);
      }
    }
  ],function(err){
    if(err) {
      callback(err);
    }else{
      callback(null,dish);
    }
  });
};

Dish.prototype.getIngredients=function(callback){
  var self=this;

  connection.query("SELECT ingredients.ingredient_name,ingredients.ingredient_id FROM ingredients INNER JOIN ingredient_to_dish ON ingredients.ingredient_id=ingredient_to_dish.ingredient_id WHERE dish_id=?",self.data.dish_id,function(err,rows){
    if(err){
      callback(err);
    }else{
      if(!rows.length){
        callback("No ingredients with this id");
      }else{
        self.data.ingredients=[];
        for(let i=0;i<rows.length;i++){
          self.data.ingredients.push(new Ingredient({
            name:rows[i].ingredient_name,
            id:rows[i].ingredient_id}));
        }
        console.log(self.toResponse());
        callback(err);
      }

    }
  });
}

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
        dish.data.dish_id=rows[i].dish_id;
        dishes.push(dish);
      };

      async.each(dishes,function(dish,callback){
        dish.getIngredients(callback);
      },
      function(err){
        if(err){
          callback(err);
        }else{
          for(var i=0;i<dishes.length;i++){
            for(var a=0;a<dishes[i].data.ingredients.length;a++){
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

Dish.prototype.update = function(callback){
  var self = this;
  //TODO
}

Dish.prototype.toResponse = function () {
  var ingredients = [];
  if(this.data.ingredients){
    for (let i=0;i<this.data.ingredients.length;i++) {
      ingredients.push(this.data.ingredients[i].toResponse());
    }
  }

  var response = {
    dish_id: this.data.dish_id,
    name: this.data.name,
    recipe: this.data.recipe,
    ingredients:ingredients
  }
  return response;
}


module.exports= Dish;
