//TODO make it closed service for googlestuff
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');
var googleDATA=require("../config/google");
var async = require("async");
console.log(googleDATA);
google.options({
  auth: new OAuth2(googleDATA.ClientId ,  googleDATA.ClientSecret, googleDATA.RedirectionUrl)
});
var getOAuthClient=function(callback){
	google.auth.getApplicationDefault(function (err, authClient, projectId) {
		//if(err){err="Failed to get googleAPI client";
		callback(err,authClient,projectId);
	})
}

var getAuthUrl=function(){
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
}

var getDetails=function(tokens,callback){

}

var exchangeCode=function(code,callback){
	var client={};
	async.waterfall([
		getOAuthClient,
		function(authClient,projektId,next){
			client=authClient;
			client.getToken(code,next);
		},function(tokens,next){
			client.setCredentials(tokens);
			plus.people.get({ userId: 'me', auth: oauth2Client }, next)
		}

	],function(err,data){
		callback(err,data)
	})
}
module.exports={
  getOAuthClient:getOAuthClient,
	getAuthUrl:getAuthUrl,
  exchangeCode:exchangeCode,
}
