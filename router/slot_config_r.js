var setting = require('../setting.js');
var selectPhoto = require('../view/config/image_selection');
var express = require('express')
  , router = express.Router()
  , multer = require('multer');

router.get('/show', function(req, res) {
	res.setHeader('content-type', 'text/html');
	// console.log(selectPhoto.getHtml());
	res.send(selectPhoto.getHtml());
});

module.exports = router;
