module.exports=function(app,googleStuff,connection){

	var async = require("async");
	var crypto = require('crypto');

	app.get("/", function (req, res) {
	    var url = googleStuff.getAuthUrl();
	    res.render("index",{url:url});

	});
}
