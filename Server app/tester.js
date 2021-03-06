
var google = require("./services/googleVB");
console.log(google.getOAuthClient());
var User = require("./Model/Helpers/UserModel");

var express = require('express');
var Session= require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
/*var mysql = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
  user     : 'simple-cookingdbadmin',
  password : 'simple-cookingdbadmin626',
  database : 'simple-cookingdb'

});*/

var busboy = require('connect-busboy');
//var index = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy());
app.use(Session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));



app.use('/coode',function(req,res,next){
	if(req.query.code){
		google.exchangeCode(req.query.code,function(err,data){
			console.log("logowanie :( :( ");
			console.log(err);
			console.log(data);
			res.send(err+"<br> \n"+data);
		});
	}else{
		res.send("<a href='"+google.getAuthUrl() +"'>Loguj </a>");
	}
});


app.use("/credentials",function(req,res,next){
	var client = google.getOAuthClient();
	client.setCredentials({access_token:"123",refresh_token:"1222222"});
	res.json(client.credentials);
});
app.use('/user',function(req,res,next){
	if(req.query.code){
		var user = new User({code:req.query.code});
		user.googleSignUp(function(err,result){
			res.send(result.toString());
		});
	}else{
		res.send("<a href='"+google.getAuthUrl() +"'>Loguj </a>");
	}
});

app.use("/getbygid",function(res,res,next){
	User.getByGoogleId(117866508282124806716,function(err,user){
		if(err){res.send(err.toString());return;}
		res.send(user.toResponse());
	});
});

app.use("/getbyid",function(res,res,next){
	User.getById(15,function(err,user){
		if(err){res.send(err.toString());return;}
		res.send(user.toResponse());
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var debug = require('debug')('sql:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log("ready");
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


module.exports = app;
