var system_controller = require("../controllers/system_controller");
var sizeOf = require('image-size');
var setting = require('../setting.js');
module.exports = function(app){


    app.get('/add_new_parking', isLoggedIn,function(req, res) {
        res.render('dashboard_add_new_parking.ejs', { message: "" }); 
    });

    app.get('/view_all_parking', isLoggedIn,function(req, res) {
        res.render('dashboard_view_all_parking.ejs'); 
    });

    app.post('/api/mobile/datamap',function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var dataMap = {
            MapDataRes: {
                AllData: []
            }
        };
        system_controller.getDataMap(function(result){
            if(result != "NotExist"){
                dataMap.MapDataRes.AllData = result;
            }
            console.log(JSON.stringify(dataMap));
            res.send(dataMap);
        });
    });

    app.post('/api/mobile/allparkingdetail',function(req, res) {
        res.setHeader('Content-Type', 'application/json');console.log("AllParking");
        system_controller.getAllParkingDetail(function(result){
            console.log(result);
            res.send(result);
        });
    });

    app.post('/api/mobile/parkingdetail',function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var token = req.body.token;

        if(typeof token === "undefined"){
            console.log("Token not exist");
            res.send({});
            return;
        }
        system_controller.getParkingDetail(token, function(result){
            console.log(result);
            res.send(result);
        });
    });

    app.get('/get_all_parking', isLoggedIn,function(req, res) {
        //TODO response token, parkingName, path for a specific username
        var username = req.user.local.username;
        system_controller.getAllParkingConfigDetail(username, function(result){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        });
    });

    app.get('/get_all_token', isLoggedIn,function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var username = req.user.local.username;
	console.log(username);
        system_controller.getAllUserToken(username, function(result){
            res.send(JSON.stringify(result));
        });
    });

    app.post('/gen_token',isLoggedIn, function(req, res){
    	var name = req.body.name;
    	var username = req.user.local.username;
    	var latitude = req.body.latitude;
    	var longtitude = req.body.longtitude;
    	var token = (S4() + "-" + S4()).toLowerCase();
    	var data = {
    		parkinglotName: name,
    		username: username,
    		latitude: latitude,
    		longtitude: longtitude,
    		token: token
    	};
    	system_controller.insertToken(data,function(result){
    		res.render('dashboard_add_new_parking.ejs', {message: result, token: token});
    	});
    });

    app.post('/save', function(req, res) {
        var dataObj = req.body;

        system_controller.saveConfigPosition(dataObj, function(result){
            console.log(result);
            res.send(dataObj);
        });
        console.log(dataObj);

        
        // _csv.from.array(dataArr).to.path(setting.csvFile);
    });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
