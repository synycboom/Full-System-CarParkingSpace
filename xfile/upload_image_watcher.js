var setting  = require('../setting.js'); 
var fs = require("fs");
var rmdir = require( 'rmdir' );
var chokidar = require('chokidar');
var mkdirp = require('mkdirp');
var cropping = require('./xcropping.js');
var fragmenting = require('./xfragment.js');
var sift = require('./xsift.js');
var svm = require('./xsvm.js');

var folderToWatch = setting.uploadFolder;

//awaitWriteFinish is important option: to wait for entire file has been written
var watcher = chokidar.watch(folderToWatch, {ignored: /^\./, persistent: true, usePolling: true, awaitWriteFinish: true});

console.log("watching '"+ folderToWatch +"' folder ...");

watcher
	.on('add', function(path) {
		console.log('File', path, 'has been added');
		var inputFile = path;
		patt = /(.jpg)|(.png)/gi;
		if(! patt.test(inputFile))
			return false;

		var out = path.replace(setting.uploadFolder, "");
			out = out.replace(/(.jpg)||(.png)/gi, "");
			out += "_croped.jpg";
		var outputFile = setting.cropFolder + out;

		cropping.crop(inputFile,outputFile,onStartFragment);
	})
	.on('change', function(path) {})
	.on('unlink', function(path) {})
	.on('error', function(error) {console.error('Error happened', error);})
function onDel(){
	
}



function onStartFragment(err, inputFile){
	console.log("crop success");
	patt = /(.jpg)|(.png)/gi;
	if(! patt.test(inputFile))
		return false;

	var out = inputFile.replace(setting.cropFolder, "");
		out = out.replace(/(.jpg)||(.png)/gi, "");

	var outputPath = setting.fragmentFolder + out + "/";
	mkdirp(outputPath, function(err) {});
	fragmenting.fragment(inputFile,outputPath,onStartSiftNow);
}

function onStartSiftNow(err,inputPath){
	
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
	sift.extractFeature(inputPath,outputPath,onStartSVNNow);
}

function onStartSVNNow(err, inputFile){	
	console.log("sift success");
	var fileName = inputFile.replace(setting.tempFolder,"");
	var outputPath = setting.tempFolder + fileName + "_result";
	svm.predict(inputFile,outputPath,onSVMSuccess);
}

function onSVMSuccess(err, outputFile){
	console.log("svm success");
	if(err)
		return false;

	// console.log(outputFile);
}