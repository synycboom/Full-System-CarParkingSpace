var express = require("express");
var setting = require("./setting.js");
var showInfo = require( __dirname + "/view/show.js");
var app = express();
var upload_router = require( __dirname + "/controllers/pictures");
var slot_config_api = require( __dirname + "/controllers/slot_config");
var slot_config_r = require(__dirname + "/router/slot_config_r");

var cropFolder = "/" + setting.cropFolder.replace(setting.absolutePath, "").replace("/", "");

//static file serving
app.use("/public/css",express.static(__dirname + '/public/css'));
app.use("/public/images",express.static(__dirname + '/public/images'));
app.use("/public/js",express.static(__dirname + '/public/js'));
// app.use("/public/cropped_images",express.static(__dirname + '/cropped_images'));
app.use("/public/cropped_images",express.static(__dirname + cropFolder));

app.use("/api/upload", upload_router);
app.use("/api/config",slot_config_api);
app.use("/slot_config", slot_config_r);

var http = require('http').Server(app);
var io = require('socket.io')(http);


//check server status
app.get('/', function(req, res){ 
 	//res.sendFile(__dirname + "/view/index.html"); 
});

io.on('connection', function(socket){
    console.log('connected');
    io.emit('refresh', showInfo.show());
});



 

//app.set('port', process.env.PORT || 3000);
http.listen(3000, function(){
     console.log("listen *:3000");
});
