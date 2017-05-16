var connection= require('./database');
var async = require('async');



var Dish = function(data){
  this.data=data;
}

Dish.prototype.data = {}

Dish.getById = function (id,callback) {
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



Dish.prototype.checkIfExist = function (callback) {
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

Dish.prototype.save = function(callback){
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


module.exports= Dish;