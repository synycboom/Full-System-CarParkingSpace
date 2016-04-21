var setting = require('../setting.js');
var selectPhoto = require('../views/slot_config/image_selection');
var express = require('express')
  , router = express.Router()
  , multer = require('multer');

var sizeOf = require('image-size');
router.get('/show', function(req, res) {
	res.setHeader('content-type', 'text/html');
	res.send(selectPhoto.getHtml());
});

router.get('/edit/:img_name', function(req, res) {
	var imgName = req.params.img_name;
	var dimensions = sizeOf(setting.cropFolder + imgName);
	res.render('slot_config/slot_selection', {
	    img_width: dimensions.width,
	    img_height: dimensions.height,
	    port: setting.port
  	});

});

module.exports = router;
