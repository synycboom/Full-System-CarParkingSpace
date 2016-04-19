var system_controller = require("../controllers/system_controller");

module.exports = function(app){


    app.get('/add_new_parking', isLoggedIn,function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('dashboard_add_new_parking.ejs', { message: "" }); 
    });

    app.get('/view_all_parking', isLoggedIn,function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('dashboard_view_all_parking.ejs'); 
    });

    app.post('/gen_token',isLoggedIn, function(req, res){
    	var name = req.body.name;
    	var username = req.user.local.username;
    	var latitude = req.body.latitude;
    	var longtitude = req.body.longtitude;
    	var token = (S4() + "-" + S4()).toLowerCase();
    	var data = {
    		name: name,
    		username: username,
    		latitude: latitude,
    		longtitude: longtitude,
    		token: token
    	};
    	
    	system_controller.insertToken(data,function(result){
    		res.render('dashboard_add_new_parking.ejs', {message: result, token: token});
    	});
    	
    	
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