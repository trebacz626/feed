var express = require('express');
var router = express.Router();
var loginActivity = require('../Model/Activity/LoginActivityModel');

var crypto = require('crypto');

function md5(string) {
	return crypto.createHash('md5').update(string).digest('hex');
}


router.get('/',function(req,res,next){
	res.send("This is API");
});

router.route('/login')
  .get(function(req,res,next){

    next();
  })
  .post(function(req,res,next){
		var data={
	    userInfo:{
	      id:null,
	      email:req.body.mail,
	      password:md5(req.body.password),
	    },
	    curactivityData:{

	    }
	  }
    loginActivity(data,function(err,id){
      console.log(err+' id '+id);
    });
		res.send("logg");
  });

router.route('/register')
  .get(function(req,res,next){
    next();
  })
  .post(function(req,res,next){
    next();
  });

router.route('/auth/google/callback')
  .get(function(req,res,next){
    next();
  })
  .post(function(req,res,next){
    next();
  });

router.route('/logout')
  .get(function(req,res,next){
    next();
  })
  .post(function(req,res,next){
    next();
  });

router.route('/profile')
  .get(function(req,res,next){
    next();
  })
  .post(function(req,res,next){
    next();
  });

router.route('/addDish')
  .get(function(req,res,next){
    next();
  })
  .post(function(req,res,next){
    next();
  });

router.route('/simplesearch')
  .get(function(req,res,next){
    next();
  })
  .post(function(req,res,next){
    next();
  });

router.route('/addfridge')
  .get(function(req,res,next){
    next();
  })
  .post(function(req,res,next){
    next();
  });

router.route('/addDish')
  .get(function(req,res,next){
    next();
  })
  .post(function(req,res,next){
    next();
  });

router.route('/addDish')
  .get(function(req,res,next){
    next();
  })
  .post(function(req,res,next){
    next();
  });

module.exports=router;
