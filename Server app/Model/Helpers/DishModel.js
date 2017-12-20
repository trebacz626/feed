var connection= require('./database');
var async = require('async');
var Ingredient = require("./IngredientModel");
var Pair = require("../../Utils/Pair")
var Dish = function(data){
  this.data=data;
}

Dish.prototype.data = {}

Dish.getById = function (id,callback) {
  var dish={};
  async.waterfall([
    function(cb){
      connection.query("SELECT name,recipe,author_id from dishes where dish_id=?",id,function(err,rows){
        cb(err,rows);
      });
    },function(rows,cb){
      if(!rows.length){
        cb("No dish with this id");
      }else{
        dish =new Dish({
          id:id,
          name:rows[0].name,
          recipe:rows[0].recipe,
          authorId:rows[0].author_id
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

  connection.query("SELECT ingredients.ingredient_name,ingredients.ingredient_id FROM ingredients INNER JOIN ingredient_to_dish ON ingredients.ingredient_id=ingredient_to_dish.ingredient_id WHERE dish_id=?",self.data.id,function(err,rows){
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
        callback(err);
      }

    }
  });
}

Dish.simpleSearch= function(ingredients,callback){//TODO move to search controller
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
  connection.query("",[],function(err,result){
    callback(err,result);
  });
}

Dish.prototype.delete=function(callback){
  var self = this;
  connection.query("DELETE FROM dishes WHERE dish_id=?",self.data.id,function(err,result){
    callback(err,result);
  });
}

Dish.prototype.updateValue = function(DBvalueName,userValue,callback){
  var self = this;
  connection.query("UPDATE dishes SET "+DBvalueName+"=? WHERE user_id = ?",[userValue,self.data.id],function(err,result){
    callback(err,result);
  });
}
Dish.prototype.updateBasic=function(callback){//TODO
  var self = this;
  connection.query("UPDATE dishes SET name=?,recipe=?,picture=?,author_id=? WHERE dish_id = ?",[self.data.name,self.data.recipe,self.data.picture,self.data.authorId,self.data.id],function(err,result){
    callback(err,result);
  });

}

function similarElements(array1,array2){
  var lookupArray=[];

  var similar=[];
  for(let i=0;i<array1.length;i++){
    lookupArray[array1[i].data.name]=1;
  }
  for(let i=0;i<array2.length;i++){
    if(lookupArray[array2[i].data.name]){
      similar.push(array2[i]);
    }
  }
  return similar;
}
function differentElements(array1,array2){
  var lookupArray=[];

  var different=[];
  for(let i=0;i<array1.length;i++){
    lookupArray[array1[i].data.name]=1;
  }
  for(let i=0;i<array2.length;i++){
    if(!lookupArray[array2[i].data.name]){
      different.push(array2[i]);
    }
  }
  return different;
}
Dish.test=function(){
  array1=[
    new Ingredient({name:"egg"}),
    new Ingredient({name:"apple"}),
    new Ingredient({name:"ham"}),
    new Ingredient({name:"sausage"})
  ];
  array2=[
    new Ingredient({name:"qwerty"}),
    new Ingredient({name:"egg"}),
    new Ingredient({name:"apple"}),
    new Ingredient({name:"ninety"})
  ];
  var self={data:{id:2}};
  var old={data:{id:2}};
  var similar =similarElements(array1,array2);
  var toAdd=differentElements(similar,array1);
  var toDelete=differentElements(similar,array2);
  var query1="DELETE FROM ingredient_to_dish WHERE dish_id=? AND (";
  var params1=[];
  params1.push(self.data.id);
  for(let i=0;i<toDelete.length;i++){//TODO queryMaker
    query1+="ingredient_id=?";
    params1.push(toDelete[i].data.id);
    if(i!=toDelete.length-1)query1+=" OR ";
  }
  query1+=")";
  var query2="INSERT INTO ingredient_to_dish(ingredient_id,dish_id) VALUES";
  var params2=[];
  for(let i=0;i<toAdd.length;i++){//TODO queryMaker
    query2+="(?,?) ";
    params2.push(toDelete[i].data.id);
    params2.push(self.data.id);
    if(i!=toDelete.length-1)query2+=",";
  }

}

Dish.prototype.updateAll=function(callback){
  var self = this;
  var old;
  async.waterfall([function(next){
      self.updateBasic(function(err,result){
        next(err,result);
      });
    },function(result,next){
      Dish.getById(self.data.id,next);
    },function(dish,next){
      var old=dish;
      var similar=similarElements(self.data.ingredients,old.data.ingredients);
      var toAdd=differentElements(similar,self.data.ingredients);
      var toDelete=differentElements(similar,old.data.ingredients);
      var query1="DELETE FROM ingredient_to_dish WHERE dish_id=? AND (";
      var params1=[];
      params1.push(self.data.id);
      for(let i=0;i<toDelete.length;i++){//TODO queryMaker
        query1+="ingredient_id=? ";
        params1.push(toDelete[i].data.id);
        if(i!=toDelete.length-1)query1+="OR";
      }
      query1+=")";
      var query2="INSERT INTO ingredient_to_dish(ingredient_id,dish_id) VALUES";
      var params2=[];
      for(let i=0;i<toAdd.length;i++){//TODO queryMaker
        query2+="(?,?) ";
        params2.push(toAdd[i].data.id);
        params2.push(self.data.id);
        if(i!=toAdd.length-1)query2+=",";
      }
      console.log("last error");
      async.parallel({
        one:function(parallelCb){
          if(toDelete.length<1)parallelCb(null)
          else{
            connection.query(query1,params1,function(err,result){
              parallelCb(err);
          });
        }
        },
        two:function(parallelCb){
          if(toAdd.length<1)parallelCb(null)
          else{
            connection.query(query2,params2,function(err,result){
              parallelCb(err);
            });
          }
        }
      },function(err,result){
        callback(err);
      });
  },
  function(next){

  }],
    function(err){
      callback(err);
    });

}

Dish.prototype.hasIngredient=function(ingredient,callback){
  connection.query("SELECT * FROM ingredient_to_dish WHERE dish_id =? AND ingredient_id=? ",[self.data.id,ingredient.data.id],function(err,rows){
    if(err)callback(err)
    else{
      if(!rows.length){
        callback(null,false);
      }else{
        callback(null,true);
      }
    }
  });
}
Dish.prototype.toResponse = function () {
  var ingredients = [];
  if(this.data.ingredients){
    for (let i=0;i<this.data.ingredients.length;i++) {
      ingredients.push(this.data.ingredients[i].toResponse());
    }
  }

  var response = {
    id: this.data.id,
    name: this.data.name,
    recipe: this.data.recipe,
    ingredients:ingredients,
    authorId:this.data.authorId
  }
  return response;
}


module.exports= Dish;
