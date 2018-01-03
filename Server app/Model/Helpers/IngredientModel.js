var connection= require('./database');
var async = require('async');

function mergeString(tableOfData,separator,next){
  var string='';
  for(var i=0;i<tableOfData.length;i++){
    if(tableOfData[i].data.name){
      string+=tableOfData[i].data.name;
    if(i!=tableOfData.length-1)
      string+=separator;
  }
  }
  next(string);
}

var Ingredient = function(data){
  this.data=data;
}

Ingredient.prototype.data = {}

Ingredient.getById = function (id,callback) {
  Number(id);
  connection.query("SELECT ingredient_name FROM ingredients where ingredient_id=?",id,function(err,rows){
  if(err){
    callback(err);
  }else{
    if(rows.length){
      callback(null,new Ingredient({
        id:id,
        name:rows[0]["ingredient_name"]
      }))
    }else{
      callback("No ingredient with this id");
    }
    }
  });
};

Ingredient.checkIngredients= function(ingredients,callback){
  var noIngredient = new Array();
  async.forEach(ingredients,function(ingredient,next){
    //console.log("namei"+ingredient.data);
    ingredient.checkIfExist(function(err,exists){
      if(err){
        next(err);
      }else{
        if(exists){
          next();
        }else{
          noIngredient.push(ingredient);
          next();
        }
      }
    });
  },function(err){
    if(err){
      callback(err);
    }else{
      if(noIngredient[0]){
        var message="there is no ";
        mergeString(noIngredient," and ",function(string){
          message+=string;
        });
        callback(null,message)
      }else{
        callback(null,null);
      }
  }
  });
}

Ingredient.prototype.checkIfExist = function (callback) {
  console.log(callback);
  var self = this;
  connection.query("SELECT 	ingredient_id from ingredients WHERE ingredient_name=?",self.data.name,function(err,rows){
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

Ingredient.prototype.save = function(callback){
  var self = this;
  connection.query("INSERT into ingredients(ingredient_name)VALUES(?)",self.data.name,function(err,result){
    if(err){
      callback(err);
    }else{
      self.data.id=result.insertId
      callback(null);
    }
  });
}

Ingredient.prototype.update=function(callback){
  var self = this;
  connection.query("UPDATE ingredients SET ingredient_name=? WHERE ingredient_id = ?",[self.data.name,self.data.id],function(err,result){
    callback(err,result);
  });
}

Ingredient.prototype.delete=function(callback){
  var self = this;
  async.waterfall([function(next){
      connection.query("SELECT dish_id FROM ingredient_to_dish WHERE ingredient_id=? ",self.data.id,function(err,result){//TODO getDish by ingredient
        next(err,result);
      })
    },function(result,next){
      if(!result.length){
        next();
      }else{
          var query1="DELETE FROM ingredient_to_dish WHERE ";
          var params1 =[];
          for(var i=0;i<result.length;i++){
            query1+="dish_id= ?"
            params1.push(result[i]["dish_id"]);
            if(i!=result.length-1)query1+=" OR ";
          }

          var query2="DELETE FROM dishes WHERE ";
          var params2 =[];
          for(var i=0;i<result.length;i++){
            query2+="dish_id= ?"
            params2.push(result[i]["dish_id"]);
            if(i!=result.length-1)query2+=" OR ";
          }
          async.parallel({
            one:function(parallelCb){
              if(params1.length<1)parallelCb(null)
              else{
                connection.query(query1,params1,function(err,result){
                  parallelCb(err);
              });
            }
            },
            two:function(parallelCb){
              if(params2.length<1)parallelCb(null)
              else{
                connection.query(query2,params2,function(err,result){
                  parallelCb(err);
                });
              }
            }
            },function(err,result){
              next(err);
            });
          }
    },function(next){
      connection.query("DELETE FROM ingredients WHERE ingredient_id=?",self.data.id,function(err,result){
        next(err);
      });
    }],function(err){
      callback(err);
  });
}

Ingredient.prototype.toResponse = function () {
  var response = {
    id: this.data.id,
    name: this.data.name
  }
  return response;
}
module.exports= Ingredient;
