module.exports=function(app,googleStuff,connection){

	var async = require("async");
	var crypto = require('crypto');



	function md5(string) {
  	return crypto.createHash('md5').update(string).digest('hex');
	}

	function checkIngredients(noIngredient,ingredient,index,message,next){
		if(index<ingredient.length){
		connection.query("Select ingredient_id FROM ingredients where ingredient_name = ?",ingredient[index].name,function(err,rows){
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
											connection.query("INSERT into users(name,email,google_id,picture)VALUES(?,?,?,?)",[data.displayName,data.emails[0].value,data.id,data.image.url],function(err,result){

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

	app.get("/login",function(req,res){
		if(req.session.user_id&&req.session["is_logged"]){
			res.redirect("/profile");
		}else{
			res.render("login",{});
		}
	});

	app.post("/login",function(req,res){
		var session = req.session;
		if(session.user_id&&session["is_logged"]){
			res.redirect("/profile");
		}else{
			connection.query("SELECT 	user_id,email from users WHERE email=? AND password=?",[req.body.mail,md5(req.body.password)],function(err,rows){
				if(err){
					session["is_logged"]=false;
	        res.render('loginFailed',{error:err});

				}else{
					session["is_logged"]=true;
					session.user_id=rows[0]['user_id'];;
					var data={
						user:{
							email:rows[0]['email'],
							password:req.body.password
						}
					};
					console.log(data);
					res.json(data);
			}
		});


		}
	});

	app.get("/register",function(req,res){
		if(req.session.user_id&&req.session["is_logged"]){
			res.redirect("/profile");
		}else{
			res.render("register",{});
		}
	});

	app.post("/register",function(req,res){
		var session = req.session;
		if(req.session.user_id&&req.session["is_logged"]){
			res.redirect("/profile");
		}else{

			connection.query("SELECT 	user_id from users WHERE email=?",[req.body.mail],function(err,rows){
				if(err){
					session["is_logged"]=false;
	        res.render('loginFailed',{error:err});

				}else{
				if(!rows.length){
					connection.query("INSERT into users(email,password)VALUES(?,?)",[req.body.mail,md5(req.body.password)],function(err,result){
							if(err){
								res.render('error',{error:err});
							}else{
						session.user_id=result.insertId;
						res.redirect('/profile');
						}
					});
				}else{
					res.render("register",{})

				}

			}
		});

		}
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
			connection.query("SELECT name,picture from users where user_id=?",session.user_id,function(err,rows){
			if(err){
				console.log(err);
				res.render('error',{error:err});
			}else{
				data.userInfo={
					name:rows[0]['name'],
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

	app.get("/simplesearch",function(req,res){
		var data={};
		data.message="";
		res.render('simplesearch',{data:data});
	});

	app.post("/simplesearch",function(req,res){
		var data={};
		if(req.body.ingredient){
			var noIngredient= new Array();
			var m;
			var ingredient=new Array();
			for(var i=0;i<req.body.ingredient.length;i++){
				if(req.body.ingredient[i]){
					var obj={
						name:req.body.ingredient[i],
						id:null
					}
					ingredient.push(obj);
				}
			}
			checkIngredients(noIngredient,ingredient,0,m,function(message){
				if(message){
					res.render('error',{error:message});
				}else{
					if(noIngredient[0]){
						data.message="in databse there is no ";
						mergeString(noIngredient," and ",function(string){
							data.message+=string;
						});
						res.render('simplesearch',{data:data});
					}else{
							var query="SELECT dishes.dish_id,dishes.name,dishes.recipe,ingredients.ingredient_name FROM dishes INNER JOIN ingredient_to_dish ON dishes.dish_id=ingredient_to_dish.dish_id INNER JOIN ingredients ON ingredients.ingredient_id=ingredient_to_dish.ingredient_id WHERE ingredients.ingredient_name in (";
							for(var i=0;i<ingredient.length;i++){
								if(ingredient[i].id!=null){
									if(i>0){
										query+=", ";
									}
									query+="'"+ingredient[i].name+"'";
								}
							}
							query+=") group by dishes.dish_id, dishes.name ";
							connection.query(query,{},function(err,rows){
								if(err){
									res.render('error',{error:err});
								}else{
									data.dishes=new Array();
									var items=new Array();
									for(var i=0;i<rows.length;i++){
										var dishObj={};
										dishObj.name=rows[i].name;
										dishObj.recipe=rows[i].recipe;
										dishObj.ingredients= new Array();
										//for(var a=0;a<rows[i].ingredients.length;a++){
											//dishObj.ingredients.push(rows[i].ingredient_name);
											//console.log("iiiii"+rows[i].ingredient_name);
											//console.log(dishObj);
										//}
										data.dishes.push(dishObj)
										items.push({
											query:"SELECT ingredients.ingredient_name FROM ingredients INNER JOIN ingredient_to_dish ON ingredients.ingredient_id=ingredient_to_dish.ingredient_id WHERE dish_id="+ rows[i].dish_id,
											index:i
										});
									};

									async.each(items,function(item,callback){
										connection.query(item.query,{},function(err,rows){
											if(err){
												console.log("error "+ err)
											}else{
												for(var i=0;i<rows.length;i++){
												data.dishes[item.index].ingredients.push(rows[i].ingredient_name);
											}
											callback();
											}
										});
									},
									function(err){
										for(var i=0;i<data.dishes.length;i++){
											for(var a=0;a<data.dishes[i].ingredients.length;a++){
												console.log("CHECKINGGGGG");
												var was=false;
												for(var b=0;b<ingredients.length;b++){
													if(data.dishes[i].ingredients[a].data.name==ingredients[b].data.name){
														was=true;
														console.log(data.dishes[i].ingredients[a].data.name);
														console.log(ingredients[b].data.name);
													}
												}
												if(!was){
													 data.dishes[i].tooMuch=true;//has too much ingredients
													break;
												}
											}
										}
										res.render('searchresult',{data:data});
									});



							}
						});
					}
				}
			});
		}else{
			data.message="Fill all fields";
			res.render("simplesearch",{data:data})
		}
	});

	app.get("/addfridge",function(req,res){
		var session = req.session;
		if(session['is_logged']&&session.user_id){

			var data={
				user_id:session.user_id,
				message:''
			}
			res.render("addfridge",{data:data})
		}else{
			res.render('PleaseLogin',{message:'to add a fridge'});
		}
	});

	app.post("/addfridge",function(req,res){
		var session = req.session;
		if(session['is_logged']&&session.user_id){
			connection.query("INSERT INTO fridges(name)VALUES(?)",[req.body.fridgename],function(err,result){
				if(err){
					res.render("error",{error:err});
				}else{
					connection.query("INSERT INTO fridge_to_user(fridge_id,user_id) VALUES (?,?)",[result.insertId,session.user_id],function(err,result2){
						if(err){
							res.render("error",{error:err});
						}else{
							var data={
								user_id:session.user_id,
								message:'user '+session.user_id+' added succesfully fridge named '+ result.insertId
							}
							res.render("addfridge",{data:data})
						}
					});
				}
			});



		}else{
			res.render('PleaseLogin',{message:'to add a fridge'});
		}
	});

	app.get("/showfridge",function(req,res){

	});

	app.post("/addIngredienttofridge",function(req,res){

	});

}
