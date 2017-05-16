var connection= require('./database');
var async = require('async');

function mergeString(tableOfData,separator,next){
  var string='';
  for(var i=0;i<tableOfData.length;i++){
    if(tableOfData[i]){
      string+=tableOfData[i];
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
  connection.query("SELECT name,picture from users where user_id=?",id,function(err,rows){
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

Ingredient.checkIngredients(ingredients,callback){
  var noingredient = new Array();
  async.forEach(Ingredients,function(ingredient,next){
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
      callback(null,self);
    }
  });
}


module.exports= Ingredient;
