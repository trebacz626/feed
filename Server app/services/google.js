var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');
var googleDATA=require("../config/google");

module.exports={
 getOAuthClient:function(){
	 return new OAuth2(googleDATA.ClientId ,  googleDATA.ClientSecret, googleDATA.RedirectionUrl);
 },

 getAuthUrl:function(){
     var oauth2Client = this.getOAuthClient();
     // generate a url that asks permissions for Google+ and Google Calendar scopes
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
 },
 plus:plus
}
