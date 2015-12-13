var chokidar = require('chokidar');
var setting = require('../setting.js');
var mkdirp = require('mkdirp');
var fragmenting = require('./xfragment.js');

var folderToWatch = setting.cropFolder;

var watcher = chokidar.watch(folderToWatch, {ignored: /^\./, persistent: true});

console.log("watching '"+ folderToWatch +"' folder ...");

watcher
	.on('add', function(path) {
		console.log('File', path, 'has been added');
		var inputFile = path;
		var out = path.replace(folderToWatch, "");
			out = out.replace(/(.jpg)||(.png)/gi, "");

		//output path is like fragmented_images/filname/slotx.jpg
		var outputPath = setting.fragmentFolder + out + "/";
		mkdirp(outputPath, function(err) { 
			//error occurs
		});

		// console.log(inputFile);
		// console.log(outputPath);
		fragmenting.fragment(inputFile,outputPath,onCropSucces);
	})
	.on('change', function(path) {})
	.on('unlink', function(path) {})
	.on('error', function(error) {console.error('Error happened', error);})


function onCropSucces(message){
	if(err === "err")
		console.log(message);
	else
		console.log("watching 'upload' folder ...");
}