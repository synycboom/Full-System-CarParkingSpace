var express = require("express");
var setting = require("./setting.js");
var path = require('path');
var app = express();

var upload_api = require( __dirname + "/controllers/upload");
var slot_config_api = require( __dirname + "/controllers/slot_config_api");
var slot_config = require(__dirname + "/controllers/slot_config");

var cropFolder = "/" + setting.cropFolder.replace(setting.absolutePath, "").replace("/", "");

//static file serving
app.use("/public/css",express.static(__dirname + '/public/css'));
app.use("/public/images",express.static(__dirname + '/public/images'));
app.use("/public/js",express.static(__dirname + '/public/js'));
app.use("/user_data/",express.static(__dirname + '/user_data/'));
app.use("/public/cropped_images",express.static(__dirname + cropFolder));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use("/api/upload", upload_api);
app.use("/api/config",slot_config_api);
app.use("/slot_config", slot_config);



var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'parkingspacedetection' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/authentication_routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/system_routes.js')(app);

//app.set('port', process.env.PORT || 3000);
app.listen(setting.port, function(){
     console.log("listen *: " + setting.port);
});
