/*var Ingredient = require('./IngredientModel.js');
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
});*/

var User = require('./UserModel');
var googleStuff = require('../../config/google');
var connection =require ('./database');
var user = new User({});
user.data.code="4/ebPWvPPlaamIS8YEhCfKxfoMjSSzf3ofD2HnnHDV1g4";
user.googleSignUp(function(err,correct){
  console.log(err);
  console.log(correct);
});



/*
///////////////////googogoggogog
var User = require('./UserModel');
var googleStuff = require('../../config/google');
var connection =require ('./database');
var user = new User({});
user.data.code="4/Usb1mqNgzWQqKfUlwOEOu7FdD9fVCXZzpl1ligiZJFo";
user.data.token="ya29.GlyEBCV1avOUQ7oBXthNPzlfkcplM2jBgI5r9aU0mbTpy8wctGJKh-1pHUwHtunLk-MjjXH-xEj2kAma1yWtk1RsWD19srbbp1d6I0TNPg7Q8oV2bRwDfvaYS_uXnQ";

user.googleLogin(function(err,success){
  if(err){
    console.log(err);
  }
  if(success){
    console.log(success);
  }else{
    console.log("dupa");
  }
});
/////////////////////////////////////////////ogogogooggo




/*var oauth2Client = googleStuff.getOAuthClient();
else if(user.data.token){
  connection.query("SELECT 	access_token from users WHERE access_token=?",user.data.token,function(err,rows){
    if(err){
      console.log("database error");
    }
  });
  var p = new Promise(function (resolve, reject) {
          googleStuff.plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
              resolve(response || err);
          });
      }).then(function (data) {

      });
}else{

}

/*var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(googleStuff.googleDATA.ClientId, '', '');
client.verifyIdToken(
    user.data.token,
    googleStuff.googleDATA.ClientId,
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
    function(e, login) {
    if(e||!login){
      console.log(e);
    }else{
      var payload = login.getPayload();
      var userid = payload['sub'];
      console.log(payload);
      console.log(payload.email+" "+payload.name+" "+userid);

      connection.query("SELECT 	user_id from users WHERE google_id=?",payload.sub,function(err,rows){
        if(err){
          callback(err);

        }else{
          if(!rows.length){
          connection.query("INSERT into users(name,email,google_id,picture)VALUES(?,?,?,?)",[payload.name,payload.email,payload.sub,payload.picture],function(err,result){

            this.data.id=result.insertId;
            callback(err,1);
          });
        }else{
          this.data.id=rows[0]['user_id'];
          callback(err,1);
        }
      }
    });
    }
      // If request specified a G Suite domain:
      //var domain = payload['hd'];
    });



/*var oauth2Client = googleStuff.getOAuthClient();
oauth2Client.setCredentials(user.data.token);
var p = new Promise(function (resolve, reject) {
        googleStuff.plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
            resolve(response || err);
        });
}).then(function (data) {
*/
/*  console.log(data);
  connection.query("SELECT 	user_id from users WHERE google_id=?",data.id,function(err,rows){
    if(err){
      callback(err);

    }else{
      if(!rows.length){
      connection.query("INSERT into users(name,email,google_id,picture)VALUES(?,?,?,?)",[data.displayName,data.emails[0].value,data.id,data.image.url],function(err,result){

        this.data.id=result.insertId;
        callback(err,1);
      });
    }else{
      this.data.id=rows[0]['user_id'];
      callback(err,1);
    }
  }
});
//})



/*user.googleLogin(function(err,success){
  if(err){
    console.log(err);
  }
});*/
