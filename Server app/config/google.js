var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');

module.exports={
	googleDATA:{
	 ClientId : "878826402052-vuv9orc3m91ujqb572c3gls5hkdjg6rk.apps.googleusercontent.com",
 ClientSecret : "1psz1jIv49OrGFvK66gH1Xx-",
 RedirectionUrl : "http://localhost:8080/auth/google/callback"
 },
 getOAuthClient:function(){
	 return new OAuth2(this.googleDATA.ClientId ,  this.googleDATA.ClientSecret, this.googleDATA.RedirectionUrl);
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
