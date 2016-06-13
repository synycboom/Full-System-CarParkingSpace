var setting = require('../setting.js');
var WebUserToken = require('../app/models/web_user_token');
var DroneRegisterParking = require('../app/models/drone_register_parking');
var DroneServiceParking = require('../app/models/drone_service_parking');
var image_proc = require('./image_proc_controller');

var express = require('express')
  , router = express.Router()
  , multer = require('multer')

var filename = "";
// full option control destination filename
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, setting.uploadFolder);
  },
  filename: function (req, file, cb) {
    filename = file.fieldname + '-' + Date.now() + '.jpg';
    cb(null, filename);
  }
})


var uploading = multer({

	storage: storage

	//default below code
	//dest: __dirname + '../public/uploads',
	// can set limit with below
	// limits: {fileSize: 1000000, files:1},
})

//router.use(bodyParserHelper());  

router.post('/register',uploading.single('drone1'), function(req, res) {
  var token = req.body.token.replaceAll(/"/gi,"");
  
  res.setHeader('Content-Type', 'application/json');

  WebUserToken.findOne({ 'token' : token }, function(err, data) {
            if (err){
              throw err;
            }

            // check to see if theres already a token with that token
            if (data) {
                var newPic = new DroneRegisterParking();
                newPic.token = data.token;
                newPic.path = setting.uploadFolder + filename;
                newPic.imageName = filename;
                newPic.isProcessed = false;

                newPic.save(function(err) {
                    if (err)
                        throw err;
                    res.send({ uploadstatus: "ok" });
                    console.log("Uploaded Sucess");
		    image_proc(setting.uploadFolder + filename);
                });
                
            } else {
                res.send({ uploadstatus: "There is no token" });
		console.log("Upload Failed");
             }
        });   
});

router.post('/service',uploading.single('drone1'), function(req, res) {
  var token = req.body.token.replaceAll(/"/gi,"");
  res.setHeader('Content-Type', 'application/json');

  WebUserToken.findOne({ 'token' : token }, function(err, data) {
            if (err){
              throw err;
            }

            // check to see if theres already a token with that token
            if (data) {
                var newPic = new DroneServiceParking();
                newPic.token = data.token;
                newPic.path = setting.uploadFolder + filename;
                newPic.imageName = filename;
                newPic.isProcessed = false;

                newPic.save(function(err) {
                    if (err)
                        throw err;
                    res.send(JSON.stringify({ uploadstatus: "ok" }));
		    image_proc(setting.uploadFolder + filename);
                });
                
            } else {
                res.send(JSON.stringify({ uploadstatus: "There is no token" }));
             }
        });   
});

String.prototype.replaceAll = function(search, replacement){
	var target = this;
	return target.split(search).join(replacement);
}
module.exports = router
