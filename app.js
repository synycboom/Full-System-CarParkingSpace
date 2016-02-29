var express = require("express");
var setting = require("./setting.js");
var path = require('path');
var app = express();

var upload_api = require( __dirname + "/controllers/pictures");
var slot_config_api = require( __dirname + "/controllers/slot_config_api");
var slot_config = require(__dirname + "/controllers/slot_config");

var cropFolder = "/" + setting.cropFolder.replace(setting.absolutePath, "").replace("/", "");

//static file serving
app.use("/public/css",express.static(__dirname + '/public/css'));
app.use("/public/images",express.static(__dirname + '/public/images'));
app.use("/public/js",express.static(__dirname + '/public/js'));
app.use("/public/cropped_images",express.static(__dirname + cropFolder));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use("/api/upload", upload_api);
app.use("/api/config",slot_config_api);
app.use("/slot_config", slot_config);

var http = require('http').Server(app);
var io = require('socket.io')(http);



app.get('/', function(req, res){ 

});
 
//app.set('port', process.env.PORT || 3000);
http.listen(setting.port, function(){
     console.log("listen *: " + setting.port);
});
