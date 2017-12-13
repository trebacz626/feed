var googleStuff = require("../services/googleVB");
module.exports=function(app){


	app.get("/", function (req, res) {
	    var url = googleStuff.getAuthUrl();
	    res.render("index",{url:url});

	});
}
