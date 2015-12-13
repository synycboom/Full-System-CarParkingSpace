var setting  = require('../setting.js'); 
var chokidar = require('chokidar');
var cropping = require('./xcropping.js');

var folderToWatch = setting.uploadFolder;

var watcher = chokidar.watch(folderToWatch, {ignored: /^\./, persistent: true});

console.log("watching '"+ folderToWatch +"' folder ...");

watcher
	.on('add', function(path) {
		console.log('File', path, 'has been added');
		var inputFile = path;
		var out = path.replace(setting.uploadFolder, "");
			out = out.replace(/(.jpg)||(.png)/gi, "");
			out += "_croped.jpg";
		var outputFile = setting.cropFolder + out;

		// console.log(inputFile);
		// console.log(outputFile);
		cropping.crop(inputFile,outputFile,onCropSucces);
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