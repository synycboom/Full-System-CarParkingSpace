var chokidar = require('chokidar');
var setting = require('../setting.js');
var mkdirp = require('mkdirp');
var fragmenting = require('./xfragment.js');
var sift = require('./xsift.js');
var svm = require('./xsvm.js');

var folderToWatch = setting.cropFolder;

var watcher = chokidar.watch(folderToWatch, {ignored: /^\./, persistent: true});

console.log("watching '"+ folderToWatch +"' folder ...");

watcher
	.on('add', function(path) {
		console.log('File', path, 'has been added');
		var inputFile = path;

		patt = /(.jpg)|(.png)/gi;
		if(! patt.test(inputFile))
			return false;

		var out = path.replace(folderToWatch, "");
			out = out.replace(/(.jpg)||(.png)/gi, "");

		//output path is like fragmented_images/filname/slotx.jpg
		var outputPath = setting.fragmentFolder + out + "/";
		mkdirp(outputPath, function(err) { 
			//error occurs
		});

		// console.log(inputFile);
		// console.log(outputPath);
		fragmenting.fragment(inputFile,outputPath,onStartSiftNow);
	})
	.on('change', function(path) {})
	.on('unlink', function(path) {})
	.on('error', function(error) {console.error('Error happened', error);})


function onStartSiftNow(err,inputPath){
	if(err)
		return false;
	
	var outputPath = setting.tempFolder + "sift.des";
	console.log(inputPath);
	sift.extractFeature(inputPath,outputPath,onStartSVNNow);
}

function onStartSVNNow(err, inputFile){	
	var outputPath = setting.tempFolder + "/output";
	svm.predict(inputFile,outputPath,onSVMSuccess);
}

function onSVMSuccess(err, outputFile){
	if(err)
		return false;

	console.log("success");
}