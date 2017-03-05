module.exports=function(app,connection){

	app.use("/", function (req, res) {
        res.send(`&lt;h1&gt;Authentication using google oAuth&lt;/h1&gt;`)
	});
}