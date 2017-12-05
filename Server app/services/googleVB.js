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
   oauth2Client=getOAuthClient();
   oauth2Client.getToken(code, function(err, tokens) {
         if(!err) {
           oauth2Client.setCredentials(tokens);
                   plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
                    callback(err,response);
                   });
       }else{
         callback("Invalid code");
       }

 })
 }

 var getDetails=function(access_token,callback){
   oauth2Client=getOAuthClient();
   oauth2Client.setCredentials({access_token:access_token});
   plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
            callback(err,response);
           });
 }

 var refreshToken=function(refreshToken,callback){
   oauth2Client.setCredentials({refresh_token:refreshToken});
   oauth2Client.refreshAccessToken(function(err,tokens){
     callback(err,tokens);
   });
 }





 module.exports={
   getOAuthClient:getOAuthClient,
   getAuthUrl:getAuthUrl,
   exchangeCode:exchangeCode,
   plus:plus
 }
