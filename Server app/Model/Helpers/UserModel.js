var connection= require('./database');
var async = require('async');
var googleStuff = require('../../services/googleVB');
var crypto = require('crypto');
var jwt=require("jsonwebtoken");
var authConfig=require("../../config/auth");
var Pair = require("../../Utils/Pair");
var User = function(data){
  this.data=data;
}

User.prototype.data = {}

User.getById = function (id,callback) {
  connection.query("SELECT * from users where user_id=?",id,function(err,rows){
    if(err){
      callback(err);
    }else{
      if(!rows.length)
        callback("No user with this id");
      else
        callback(null,new User( User.convertDataFromDatabase(rows[0])));
    }
  });
};


User.checkIfExist = function (email,callback) {
  connection.query("SELECT 	user_id from users WHERE email=?",email,function(err,rows){
    if(err){
      callback(err);
    }else{
      if(!rows.length){
        callback(null,false);
      }else{
        callback(null,true);
      }
    }
  });
}

User.prototype.save = function(callback){
  var self = this;
  connection.query("INSERT into users(name,email,google_id,picture,google_refresh_token)VALUES(?,?,?,?,?)",[self.data.name,self.data.email,self.data.googleId,self.data.picture,self.data.googleRefreshToken],function(err,result){
    if(err){
      callback(err);
    }else{
      self.data.id=result.insertId;
      callback(null);
    }
  });
}

User.prototype.updateValue = function(DBvalueName,userValue,callback){
  var self = this;
  connection.query("UPDATE users SET "+DBvalueName+"=? WHERE user_id = ?",[userValue,self.data.id],function(err,result){
    callback(err,result);
  });
}

User.prototype.updateValues = function(pairs,callback){
  var self = this;
  var query="UPDATE users SET ";
  var values=[];
  for(let i=0;i<pairs.length;i++){
    query+=pairs[i].key+"=?";
    values.push(self.data[pairs[i].value]);
    if(i+1!=pairs.length)query+=",";
  }
  query+=" WHERE user_id = ?";
  values.push(self.data.id);
  connection.query("UPDATE users SET "+DBvalueName+"=? WHERE user_id = ?",values,function(err,result){
    callback(err,result);
  });
}

User.prototype.updateBasic=function(callback){
  var self = this;
  connection.query("UPDATE users SET name=?,email=?,picture=? WHERE user_id = ?",[self.data.name,self.data.email,self.data.picture,self.data.id],function(err,result){
    callback(err,result);
  });
}

User.prototype.updateAll=function(callback){
  var self = this;
  connection.query("UPDATE users SET name=?,email=?,picture=?,refresh_oken=?,googl_id=?,google_refresh_token=? WHERE user_id = ?",[self.data.name,self.data.email,self.data.picture,self.data.refreshToken,self.data.googleId,self.data.googleRefreshToken],function(err,result){
    callback(err,result);
  });
}

User.prototype.delete=function(callback){
  var self = this;
  async.waterfall([function(next){
    connection.query("SELECT dishes.dish_id FROM dishes WHERE author_id=?",self.data.id,function(err,result){
      next(err,result);
    });
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
    connection.query("DELETE FROM users WHERE user_id= ?",self.data.id,function(err,result){
      next(err);
    });
  }],function(err){
    callback(err);
  })
  connection.query("DELETE FROM users WHERE user_id=?",self.data.id,function(err,result){
    callback(err,result);
  });
}

User.dbPairs={
  id:new Pair("user_id","id"),
  name:new Pair("name","name"),
  email:new Pair("email","email"),
  picture:new Pair("picture","picture"),
  refreshToken:new Pair("refresh_token","refreshToken"),
  googleId:new Pair("google_id","googleId"),
  googleRefreshToken:new Pair("google_refresh_token","googleRefreshToken")
}

User.convertDataFromDatabase=function(row){
  return{
    id:row['user_id'],
    name:row['name'],
    email:row['email'],
    picture:row['picture'],
    refreshToken:row['refresh_token'],
    googleId:row['google_id'],
    googleRefreshToken:row['google_refresh_token']
  }

}

User.getByGoogleId=function(gId,callback){
  connection.query("SELECT 	user_id,name,email,picture,refresh_token from users WHERE google_id=?",gId,function(err,rows){
    if(err)callback(err);
    else{
      if(!rows.length){callback("There is no user with this id");return;}
      var user=new User( User.convertDataFromDatabase(rows[0]));
      callback(err,user);
    }
  })
}

User.checkIfExistByGoogleId = function (gId,callback) {
  connection.query("SELECT 	user_id from users WHERE google_id=?",gId,function(err,rows){
    if(err){
      callback(err);
    }else{
      if(!rows.length){
        callback(null,false);
      }else{
        callback(null,true);
      }
    }
  });
}


User.prototype.generateRefreshToken=function(){
  var self=this;
  return self.data.id+'.'+crypto.randomBytes(40).toString('hex');
}

User.prototype.generateAccessToken=function(){
  var self=this;
  return jwt.sign({
      id:self.data.id
    },authConfig.jwtSecret,
  {
    expiresIn: 60*60
  });
}

User.getByAccessToken=function(token,callback){
  jwt.verify(token,authConfig.jwtSecret,function(err,decoded){
    if(err){
      callback("Invalid access token");
    }else{
      console.log("verified");
      User.getById(decoded.id,function(err,user){
        if(err) callback(err);
        else{
          user.data.id=decoded.id;
          callback(err,user);
        }
      })
    }
  });
}

User.getByRefreshToken=function(token,callback){
  console.log(token);
  connection.query("SELECT user_id,name,picture from users where refresh_token=?",token,function(err,rows){

  if(err){
    console.log("error");
    callback(err);
  }else{
    console.log(rows[0]);
    if(!rows.length){
      callback("wrong refresh token");
    }else{
    callback(null,new User( User.convertDataFromDatabase(rows[0])));
  }
  }
});
}


User.prototype.toResponse=function(isPublic){
  if(isPublic){
  return{
    id:this.data.id,
    name:this.data.name,
    email:this.data.email,
    picture:this.data.picture

  }
  }
  var response=this.data;
  return response;
}


module.exports= User;
