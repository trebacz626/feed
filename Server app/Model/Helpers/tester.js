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

var user = new User({});
user.data.token="eyJhbGciOiJSUzI1NiIsImtpZCI6IjI3MzdkZTNmYmYzYTFkMTZiMGU3NzY4ZjVlOTc2MDE4YmNlOTUyYmYifQ.eyJhenAiOiI4Nzg4MjY0MDIwNTItNWlidGM4Y3VsYXJyZ3BiMHZoNDA3azA4YmJoNnZkdHYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4Nzg4MjY0MDIwNTItdnV2OW9yYzNtOTF1anFiNTcyYzNnbHM1aGtkamc2cmsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc4NjY1MDgyODIxMjQ4MDY3MTYiLCJlbWFpbCI6InRyZWJhY3oua2FjcGVyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0OTk2ODg0MzEsImV4cCI6MTQ5OTY5MjAzMSwibmFtZSI6IkthY3BlciBUciIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLTA2cnBPMmZ4NDQwL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FJNnlHWHloLXRCd3lWRVpkeTZoOFhyTm54RGdyWWhwMUEvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkthY3BlciIsImZhbWlseV9uYW1lIjoiVHIiLCJsb2NhbGUiOiJwbCJ9.D45eppq1xRz6kUiduhI0RmKM_0t1zeRuwB20FXqHk-67wIfnGg77AmgrX0-1ivOEIeOfBMxDBGEk_PmDvj5Vkp08gTzU5xZfqkMpK58gb3FSUv7fATtFFGutTjUm7hYuaAN6nVVC6JCa2144k9U9Hg5a-M7yb7TnoRxLQolbsTi1qOAHY-1eZwvTBTRSezMjxwoXpvjmyrkues5BKKZcYFY8iPtdbvfMtaHe7isKWFEUKD18eQbcHbwPXLZAV_IBn36XTHs-59chs0c-1vGmZslXqN9TMCJsdCmvdL7kvUTEbPfT_XKrX1BMrQZtB_X-CIdOqetPu2wWVZ23O4Qsjg";

var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(googleStuff.googleDATA.ClientId, '', '');
client.verifyIdToken(
    user.data.token,
    googleStuff.googleDATA.ClientId,
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
    function(e, login) {
      var payload = login.getPayload();
      var userid = payload['sub'];
      console.log(payload);
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
  console.log(data);
  /*connection.query("SELECT 	user_id from users WHERE google_id=?",data.id,function(err,rows){
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
});*/
//})



/*user.googleLogin(function(err,success){
  if(err){
    console.log(err);
  }
});*/
