var setting = require('../setting.js');
var express = require('express')
  , router = express.Router()
  , multer = require('multer')
var bodyParserHelper = require(__dirname + "/../helpers/body_parser_helper");


// full option control destination filename
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, setting.uploadFolder)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
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

router.post('/',uploading.single('drone1'), function(req, res) {


	//send back response
	res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ uploadstatus: "ok" }));
})


module.exports = router
