var WebUserToken = require('../app/models/web_user_token');
var DroneRegisterParking = require('../app/models/drone_register_parking');
var DroneServiceParking = require('../app/models/drone_service_parking');
var WebRegisterParking = require('../app/models/web_register_parking');
var MlServiceParking = require('../app/models/ml_service_parking');
var sizeOf = require('image-size');
var fs = require("fs");
var setting = require('../setting.js');

const crypto = require('crypto');
const hash = crypto.createHash('sha256');

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
                hash.update(data.token);
                // newUserToken.token = hash.digest('hex');
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
				    try{
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
			            catch(err) {
                                       result.push({});
                                    } 
                                   
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
    },

    getDataMap: function(callback){
        WebUserToken.find({}, function(err, userData) {
            if (err) callback(err);
            if (userData) {
                var alldata = [];
                for(var i = 0; i < userData.length; i++){
                    alldata.push({name: userData[i].parkinglotName, latitude: userData[i].latitude, longtitude: userData[i].longtitude ,token: userData[i].token});
                }
                callback(alldata);
                
            } else {
                callback('NotExist');
            }
        });
    },

    getParkingDetail: function(tokenData ,callback){
        MlServiceParking.find({token: tokenData}, function(err, result) {
            if (err) callback(err);
            if (result) {
                DroneServiceParking.findOne({ token: tokenData },null, {sort: {'_id': -1}}, function(err, data){
                     if (err) callback(err);
                     if (data) {
                        
                        WebRegisterParking.findOne({token: tokenData}, function(err, pdata){
                            if(err) callback(err);
                            if(pdata){
                                var detail = {};
                                var dimensions;
                                detail.token = result[0].token;
                                detail.parkinglotName = result[0].parkinglotName;
                                detail.captureDate = result[0].captureDate;
                                detail.parkingDetail = {};
                                var slotStatus = [];
                                for(var i = 0; i < result[0].parkingDetail.slotStatus.length; i++){
                                    slotStatus.push({
                                        slotID: i,
                                        isAvailable: result[0].parkingDetail.slotStatus[i].isAvailable,
                                        x: pdata.parkingView[i].x,
                                        y: pdata.parkingView[i].y,
                                        width: pdata.parkingView[i].width,
                                        height: pdata.parkingView[i].height
                                    });
                                }
                                detail.parkingDetail.slotStatus = slotStatus;
                                detail.parkingDetail.parkingStatus = result[0].parkingDetail.parkingStatus;
                                detail.parkingDetail.slotSize = result[0].parkingDetail.slotSize;
                                detail.parkingDetail.carCount = result[0].parkingDetail.carCount;
                                detail.parkingPicUrl = data.path;

				if(!fs.existsSync(data.path)){	
					detail.parkingWidth = -1;
					detail.parkingHeight = -1;
				}
				else{
					dimensions = sizeOf(data.path);
                                	detail.parkingWidth = dimensions.width;
                                	detail.parkingHeight = dimensions.height;
				}
                                
                                callback(detail);
                            }
                            else{
                                callback({});
                            }
                        });
                     }
                     else{
                        callback({});
                     }
                });
                
            } else {
                callback({});
            }
        });
    },

    getAllParkingDetail: function(callback){
        MlServiceParking.find({}, function(err, result) {
            if (err) callback(err);
            if (result) {
                var details = [];
                var detail = {};
                for(var i = 0; i < result.length; i++){
                    details.push({
                        token: result[i].token,
                        parkinglotName: result[i].parkinglotName,
                        captureDate: result[i].captureDate,
                        parkingStatus: result[i].parkingDetail.parkingStatus,
                        slotSize: result[i].parkingDetail.slotSize,
                        carCount: result[i].parkingDetail.carCount,

                    });
                }
                callback(details);
            } else {
                callback({});
            }
        });
    }


};

module.exports = method;
