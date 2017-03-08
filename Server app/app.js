var express = require('express');
var Session= require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');

var googleDATA=require('./config/google');
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
app.use(Session({
    secret: 'your-random-secret-19890913007',
    resave: true,
    saveUninitialized: true
}));

function getOAuthClient () {
    return new OAuth2(googleDATA.ClientId ,  googleDATA.ClientSecret, googleDATA.RedirectionUrl);
}
 
function getAuthUrl () {
    var oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
      'https://www.googleapis.com/auth/plus.me'
    ];
 
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes // If you only need one scope you can pass it as string
    });
 
    return url;
}

app.use("/auth/google/callback", function (req, res) {
    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code;
    oauth2Client.getToken(code, function(err, tokens) {
      // Now tokens contains an access_token and an optional refresh_token. Save them.
      if(!err) {
        oauth2Client.setCredentials(tokens);
        session["tokens"]=tokens;
        res.render('loginSuccess',{url:'/details'});
      }
      else{
        res.render('loginFailed',{error:err});
      }
    });
});
 
app.use("/details", function (req, res) {
    var oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(req.session["tokens"]);
 
    var p = new Promise(function (resolve, reject) {
        plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
            resolve(response || err);
        });
    }).then(function (data) {
	console.log(data);
        res.render('details',{datas:data});
    })
});
 
app.use("/", function (req, res) {
    var url = getAuthUrl();
console.log(url);
    res.render("index",{url:url})
});

//app.use('/', index);
//app.use('/users', users);
//require('./routes/routes')(app,connection);
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

module.exports = app;
