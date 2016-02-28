var setting = require('../setting.js');
var selectPhoto = require('../views/slot_config/image_selection');
var express = require('express')
  , router = express.Router()
  , multer = require('multer');

router.get('/show', function(req, res) {
	res.setHeader('content-type', 'text/html');
	res.send(selectPhoto.getHtml());
});

router.get('/edit/:img_name', function(req, res) {
	// res.sendFile(setting.absolutePath + "views/slot_config/slot_selection.html");
	var imgName = req.params.img_name;
	res.render('slot_config/slot_selection', {
	    selected_img: imgName,
	    port: setting.port
  	});

});

module.exports = router;
