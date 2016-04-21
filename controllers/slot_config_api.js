var setting = require('../setting.js');
var csv = require('csv');
var express = require('express')
  , router = express.Router()
  , multer = require('multer');

// router.get('/save', function(req, res) {
// 	var _csv = csv();
// 	var dataObj = req.query;
// 	var dataArr = [];

// 	for(key in dataObj){
// 		dataArr.push(dataObj[key].split(","));
// 	}

// 	 res.setHeader('Content-Type', 'application/json');
// 	 res.send(dataArr);
// 	// _csv.from.array(dataArr).to.path(setting.csvFile);
// });

router.get('/save_display', function(req, res) {
	
	var _csv = csv();
	var dataObj = req.query;
	var dataArr = [];
	console.log(dataObj);
	for(key in dataObj){
		dataArr.push(dataObj[key].split(","));
	}

	_csv.from.array(dataArr).to.path(setting.csvDispFile);
});

// router.get('/:uid/files', function(req, res){
//     var uid = req.params.uid,
//         path = req.params[0] ? req.params[0] : 'index.html';
//     // res.sendfile(path, {root: './public'});
//     console.log(path);
// });

// router.get('/:name/*', function(req, res) {
//     var name = req.params.name;
//     console.log(name);
//     res.send("asdasd");
//     // res.render(name);
// });

router.get('/load', function(req,res){
	var _csv = csv();

	res.header('Access-Control-Allow-Origin', "*");
	_csv.from.path(setting.csvDispFile).to.array(function(data){
	    res.send(data);
	});
});




module.exports = router;
