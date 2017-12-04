var google = require('googleapis');
 var OAuth2 = google.auth.OAuth2;
 var plus = google.plus('v1');
 var googleDATA=require("../config/google");
var async = require("async");

  var getOAuthClient=function(){
 	 return new OAuth2(googleDATA.ClientId ,  googleDATA.ClientSecret, googleDATA.RedirectionUrl);
  }

  var getAuthUrl=function(){
      var oauth2Client = this.getOAuthClient();
      // generate a url that asks permissions for Google and Google Calendar scopes
      var scopes = [
        'https://www.googleapis.com/auth/plus.me',
  			'https://www.googleapis.com/auth/plus.login',
 			'https://www.googleapis.com/auth/userinfo.email'
      ];

      var url = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: scopes // If you only need one scope you can pass it as string
      });

      return url;
  }

 var exchangeCode=function(code,callback){
 	var client=getOAuthClient();
 	async.waterfall([
 		function(next){
 			client.getToken(code,next);
 		},function(tokens,next){
 			client.setCredentials(tokens);
 			plus.people.get({ userId: 'me', auth: client }, next)
 		}

 	],function(err,data){
 		callback(err,data)
 	})
 }


 module.exports={
   getOAuthClient:getOAuthClient,
   getAuthUrl:getAuthUrl,
   exchangeCode:exchangeCode
 }
