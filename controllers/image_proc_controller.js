var setting  = require('../setting.js'); 
var mongoose = require('mongoose');
var fs = require("fs");
var rmdir = require( 'rmdir' );
var mkdirp = require('mkdirp');
var cropping = require('../xfile/xcropping.js');
var fragmenting = require('../xfile/xfragment.js');
var sift = require('../xfile/xsift.js');
var svm = require('../xfile/xsvm.js');

var configDB = require('../config/database.js');
var DroneRegisterParking = require('../app/models/drone_register_parking');
var DroneServiceParking = require('../app/models/drone_service_parking');
var MLServiceParking = require('../app/models/ml_service_parking');
var WebUserToken = require('../app/models/web_user_token');
var WebRegisterParking = require('../app/models/web_register_parking');

module.exports  = function(path) {
		console.log('File', path, 'has been added');
		var inputFile = path;
		patt = /(.jpg)|(.png)/gi;
		if(! patt.test(inputFile))
			return false;

		var filename = path.replace(setting.uploadFolder, "");
		var out = path.replace(setting.uploadFolder, "");
			out = out.replace(/(.jpg)||(.png)/gi, "");
			out += "_croped.jpg";
		var outputFile = setting.cropFolder + out;

		//for register image
		//check if this image has been processed
		DroneRegisterParking.findOne({ imageName: filename }, function(err, data) {
            if (err)
              return err;

            if (data) {
            	//if this image has been processed then ignore
                if(data.isProcessed){
                	console.log("processed");
                	return false;
                }
                else{
                	DroneRegisterParking.update(data, {isProcessed: true}, {multi: false}, function(err, numAffected){
                		if(err)
                			return err;
                		
						WebUserToken.findOne({token: data.token}, function(err, dat){
							if(dat){
								mkdirp(setting.userDataFolder + dat.username + "/register/");
								var outF = setting.userDataFolder + dat.username + "/register/" + out;
								cropping.crop(inputFile,outF,{},onIgnore, onStartRegisterUpdate,data);
								cropping.crop(inputFile,outputFile,{},onIgnore);

							}
						});
				    });
                }
            } else {
            	console.log(filename + " not found in register db");
                return false;
            }
        });   

		//for service image
		//check if this image has been processed
		DroneServiceParking.findOne({ imageName: filename }, function(err, data) {
            if (err)
              return err;

            if (data) {
            	//if this image has been processed then ignore
                if(data.isProcessed){
                	console.log("processed");
                	return false;
                }
                else{
                	DroneServiceParking.update(data, {isProcessed: true}, {multi: false}, function(err, numAffected){
                		if(err)
                			return err;

						WebUserToken.findOne({token: data.token}, function(err, dat){
							if(dat){
								mkdirp(setting.userDataFolder + dat.username + "/service/");
								var outF = setting.userDataFolder + dat.username + "/service/" + out;

								filename = filename.replace("drone1-", "").replace(/(.jpg)||(.png)/gi, "");
								var slotData = {token: dat.token, username: dat.username, parkinglotName: dat.parkinglotName,captureDate: filename};
								cropping.crop(inputFile,outF,{},onIgnore, onStartServiceUpdate,data);
								//continue to process
                				cropping.crop(inputFile,outputFile,slotData,onStartFragment);
							}
						});
				    });
                }
            } else {
            	console.log(filename + " not found in service db");
                return false;
            }
        });   

		
};
	


function onIgnore(){}
function onStartServiceUpdate(data, outF){
	DroneServiceParking.update({token: data.token, imageName: data.imageName}, {path: outF}, {multi: false}, function(err, numAffected){
		console.log("num affected: " + JSON.stringify(numAffected));
	});
}
function onStartRegisterUpdate(data, outF){
	DroneRegisterParking.update({token: data.token, imageName: data.imageName}, {path: outF}, {multi: false}, function(err, numAffected){
		console.log("num affected: " + JSON.stringify(numAffected));
	});
}


function onStartFragment(err, inputFile, slotData){
	console.log("crop success");
	patt = /(.jpg)|(.png)/gi;
	if(! patt.test(inputFile))
		return false;

	var out = inputFile.replace(setting.cropFolder, "");
		out = out.replace(/(.jpg)||(.png)/gi, "");

	var outputPath = setting.fragmentFolder + out + "/";
	mkdirp(outputPath, function(err) {});

	WebRegisterParking.findOne({token: slotData.token},function(err, data){
		if(err) console.log(err);
		if(data){
			var csvFormat = "";
			for(var i = 0; i < data.parkingView.length; i++){
				csvFormat += data.parkingView[i].slotID
					+ "," +  data.parkingView[i].x
					+ "," +  data.parkingView[i].y
					+ "," +  data.parkingView[i].width
					+ "," +  data.parkingView[i].height
					+ " ";
			}
			fragmenting.fragment(csvFormat,inputFile,outputPath, slotData,onStartSiftNow);
		}
		else console.log("Can't Find Slot Position");
		
	});
}

function onStartSiftNow(err,inputPath, slotData){
	
	if(err){
		var file = inputPath.replace(setting.fragmentFolder,"");
		console.log("fragment failed : " + file);
		rmdir(inputPath,function ( err, dirs, files ){
		  console.log(file + ' is removed' );
		});
		return false;
	}
	console.log("fragment success");
	var fileName = inputPath.replace(setting.fragmentFolder,"").replace("_croped/","") ;
	var outputPath = setting.tempFolder + fileName;
	sift.extractFeature(inputPath,outputPath, slotData,onStartSVNNow);
}

function onStartSVNNow(err, inputFile, slotData){	
	console.log("sift success");
	var fileName = inputFile.replace(setting.tempFolder,"");
	var outputPath = setting.tempFolder + fileName + "_result";
	svm.predict(inputFile,outputPath, slotData,onSVMSuccess);
}

function onSVMSuccess(err, outputFile, slotData){
	console.log("svm success");
	if(err)
		return false;
	fs.readFile(outputFile, 'utf8', function (err,data) {
	  if (err)
	    return err;

	  var res = data.split('\n');
	  var carCount = 0;
	  var slotSize = res.length - 1;
	  var parkingStatus = "";
	  var slotStatus = [];
	  for(var i = 0; i < slotSize; i ++){
	  	slotStatus.push({slotID: i, isAvailable: res[i] == -1 ? true: false});
	  	res[i] == -1 ? true: carCount++;
	  }

	  if(carCount == slotSize)
	  	parkingStatus = "red";
	  else if(carCount < slotSize && carCount >= (slotSize/2)){
	  	parkingStatus = "yellow";
	  }
	  else if(carCount < slotSize/2){
	  	parkingStatus = "green";
	  }
	  
	  var newRes = {};
	  newRes.token = slotData.token;
	  newRes.parkinglotName = slotData.parkinglotName;
	  newRes.captureDate = slotData.captureDate;
	  newRes.parkingDetail = {
	  	carCount: carCount,
	    slotSize: slotSize,
	    parkingStatus: parkingStatus,
	    slotStatus: slotStatus
	  };

	  MLServiceParking.update({token: slotData.token}, newRes, {upsert: true, setDefaultsOnInsert: true}, function(err) {
	    if (err)
		   throw err;
	  });

	  
	});

}
