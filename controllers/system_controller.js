var WebUserToken = require('../app/models/web_user_token');
var DroneRegisterParking = require('../app/models/drone_register_parking');
var WebRegisterParking = require('../app/models/web_register_parking');
var sizeOf = require('image-size');
var setting = require('../setting.js');

var method = {
	insertToken: function(data, callback){
		console.log(data);

		WebUserToken.findOne({ 'token' :  data.token, parkinglotName: data.parkinglotName }, function(err, token) {
            if (err)
            	callback(err);

            // check to see if theres already a token with that token
            if (token) {
                callback('duplicated');
            } else {

                // if there is no user with that token
                // create the token
                var newUserToken = new WebUserToken();

                newUserToken.token = data.token;
                newUserToken.parkinglotName = data.parkinglotName;
                newUserToken.username = data.username;
                newUserToken.latitude = data.latitude;
                newUserToken.longtitude = data.longtitude;

                // save the token
                newUserToken.save(function(err) {
                    if (err)
                        throw err;
                    callback("success");
                });
             }
        });    
	},

    getAllParkingConfigDetail: function(username, callback){
        WebUserToken.find({ username: username }, function(err, userData) {
            if (err) callback(err);
            if (userData) {
                var tokens = [];
                var result = [];
                for(var i = 0; i < userData.length; i++){
                    tokens.push(userData[i].token);
                }

                DroneRegisterParking.find({token: { $in: tokens }},function(err, parkingData){
                    if(err) callback(err);
                    if(parkingData){
                        for(var i = 0; i < userData.length; i++){
                            for(var j = 0; j < parkingData.length; j++){
                                if(userData[i].token == parkingData[j].token){
                                    var path = parkingData[j].path;
                                    var dimensions = sizeOf(path);
                                    var dateTime = parkingData[j].imageName.replace("drone1-", "").replace(/(.jpg)||(.png)/gi, "");
                                    var element = {
                                        img_width: dimensions.width,
                                        img_height: dimensions.height,
                                        dateTime: dateTime,
                                        token: userData[i].token,
                                        parkinglotName: userData[i].parkinglotName,
                                        path: "../" + path.substring(path.indexOf("user_data"), path.length)
                                    };
                                    result.push(element);
                                }
                            }
                        }
                        console.log(result);
                        callback(result);
                    }
                });
            } else {
                callback('NotExist');
            }
        });
    },

    getAllUserToken: function(username, callback){
        WebUserToken.find({ username: username }, function(err, userData) {
            if (err) callback(err);
            if (userData) {
                var result = [];
                for(var i = 0; i < userData.length; i++){
                    result.push({token: userData[i].token, parkinglotName: userData[i].parkinglotName});
                }
                callback(result);
                
            } else {
                callback('NotExist');
            }
        });
    },

    saveConfigPosition: function(configData, callback){
        WebRegisterParking.findOne({ token:  configData.token, parkinglotName: configData.parkinglotName }, function(err, data) {
            if (err) callback(err);
            if(data){
                WebRegisterParking.update({token: data.token, parkinglotName: data.parkinglotName}, {parkingView: configData.parkingView},
                 {multi: false}, function(err, numAffected){});
            }else{
                var newConfig = new WebRegisterParking();
                newConfig.token = configData.token;
                newConfig.parkinglotName = configData.parkinglotName;
                newConfig.parkingView = configData.parkingView;
                console.log(configData.parkingView);
                newConfig.save(function(err){
                    if(err) throw err;
                    callback("success");
                });
            }
        });
    }
};

module.exports = method;