module.exports=function(app,googleStuff,connection){

	app.get("/", function (req, res) {
	    var url = googleStuff.getAuthUrl();
	    res.render("index",{url:url});

	});

	app.get("/auth/google/callback", function (req, res) {
	    var oauth2Client = googleStuff.getOAuthClient();
	    var session = req.session;
	    var code = req.query.code;
	    oauth2Client.getToken(code, function(err, tokens) {
	      // Now tokens contains an access_token and an optional refresh_token. Save them.
	      if(!err) {
	        oauth2Client.setCredentials(tokens);
	        session["tokens"]=tokens;
					var p = new Promise(function (resolve, reject) {
					        googleStuff.plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
					            resolve(response || err);
					        });
					    }).then(function (data) {
									connection.query("SELECT 	user_id from users WHERE google_id=?",data.id,function(err,rows){
										if(err){
											session["is_logged"]=false;
							        res.render('loginFailed',{error:err});

										}else{
										if(!rows.length){
											connection.query("INSERT into users(google_name,google_email,google_id,picture)VALUES(?,?,?,?)",[data.displayName,data.emails[0].value,data.id,data.image.url],function(err,result){

												session.user_id=result.insertId;
											});
										}else{
											session.user_id=rows[0]['user_id'];

										}
										session["is_logged"]=true;
										 res.redirect('/');
									}
								});

				       

							});

	      }
	      else{
					session["is_logged"]=false;
	        res.render('loginFailed',{error:err});

	      }
	    });
	});

	app.get("/logout",function(req,res){
		var session = req.session;
		session["is_logged"]=false;
		session.user_id=null;
		res.redirect("/");

	});
	 
	app.get("/profile", function (req, res) {
		var data={};
		var session = req.session;
		if(session["is_logged"]){
		connection.query("SELECT google_name,picture from users where user_id=?",session.user_id,function(err,rows){
			if(err){
				console.log(err);
				 res.render('error',{error:err});
			}else{
				data.userInfo={
					name:rows[0]['google_name'],
					picture:rows[0]['picture']
				};
				res.render('details',{datas:data});
			}
		});
	 }else{
		res.redirect("/");
	}
	    
	       
	});
	 
	app.get("/addDish", function (req, res) {
		var session = req.session;
		if(session['is_logged']&&session.user_id){
			var data={
				user_id:session.user_id,
				message:''
			}
			res.render("addDish",{data:data})
		}else{
			res.render('PleaseLogin',{message:'add a dish'});
		}
	});

		function checkIngredients(noIngredient,ingredient,index,message,next){
			if(index<ingredient.length){
			connection.query("Select ingredient_id FROM ingredients where name = ?",ingredient[index].name,function(err,rows){
				if(!err){
					if(ingredient[index].name){
						if(!rows.length){
							noIngredient.push(ingredient[index].name);
						}else{
							ingredient[index].id=rows[0]['ingredient_id'];
						}
					}

				}else{
					message=err;
				}
				checkIngredients(noIngredient,ingredient,index+1,message,next);
			});
		}else{
					next(message,ingredient);
			}
		}

		function mergeString(tableOfData,separator,next){
			var string='';
			for(var i=0;i<tableOfData.length;i++){
				if(tableOfData[i]){
					string+=tableOfData[i];
				if(i!=tableOfData.length-1)
					string+=separator;
			}
			}
			next(string);
		}
	app.post("/addDish", function (req, res) {
		var session = req.session;
		if(session['is_logged']&&session.user_id){
			var data={
				user_id:session.user_id
			};
			if(req.body.dishName&&req.body.ingredient&&req.body.recipe){
				var noIngredient= new Array();
				var m;
				var ingredient=new Array();
				for(var i=0;i<req.body.ingredient.length;i++){
					var obj={
						name:req.body.ingredient[i],
						id:null
					}
					ingredient.push(obj);
				}
				checkIngredients(noIngredient,ingredient,0,m,function(message){
					if(message){
						res.render('error',{error:message});
					}else{
					if(noIngredient[0]){
						data.message="there is no ";
						mergeString(noIngredient," and ",function(string){
							data.message+=string;
						});
						res.render('addDish',{data:data});
					}else{
						console.log("correct");
						connection.query("INSERT INTO dishes(name,recipe,author_id) VALUES (?,?,?)",[req.body.dishName,req.body.recipe,session.user_id],function(err,result){
							if(err){
								res.render('error',{error:err});
							}else {
								console.log("insert "+result.insertId);
								var dish_id=result.insertId;
								var query="INSERT INTO ingredient_to_dish(ingredient_id,dish_id) VALUES ";
								for(var i=0;i<ingredient.length;i++){
									if(ingredient[i].id!=null){
										if(i>0){
											query+=", ";
										}
										query+="("+ingredient[i].id+","+dish_id+")";

									}
								}
								console.log(query);
								connection.query(query,function(err,result){
									if(err){
										res.render('error',{error:err});
									}else{
										data.message="all went ok";
										res.render('addDish',{data:data});
									}
								});
							}
						});

					}
				}
				});

			}else{
				data.message="Fill all fields";
				res.render("addDish",{data:data})
			}
		}else{
			res.render('PleaseLogin',{message:'add a dish'});
		}
	});



}
