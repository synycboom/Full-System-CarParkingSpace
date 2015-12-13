var chokidar = require('chokidar');
var mkdirp = require('mkdirp');
var tryparse = require('tryparse');
var fs = require('fs');
var setting = require('../setting.js');
var spawn = require('child_process').spawn;
var folderToWatch = setting.fragmentFolder;
var watcher = chokidar.watch(folderToWatch, {ignored: /^\./, persistent: true});


console.log("watching '"+ folderToWatch +"' folder ...");


watcher
	.on('add', function(path) {
		console.log('File', path, 'has been added');
		var inputFile = path;
		// console.log(inputFile);
		// console.log(outputPath);
		var child = spawn('./Asking',[setting.dictionaryFile, inputFile, setting.tempFolder ,setting.connectionPort]);
		child.stdout.on('data', 
		    function (data) {
		    	var value = data.toString('utf8');
		        var jsonStringResult;
		        if(value.indexOf("Predict") > -1) {
		        	var indexOfBracket = value.indexOf("{");
		        	jsonStringResult = value.substring(indexOfBracket, value.indexOf("}") + 1 );
		        	var resultObject = JSON.parse(jsonStringResult);

					fs.writeFile(
						setting.predictFolder + resultObject.file.substring(0,resultObject.file.indexOf(".")) + ".json",
						jsonStringResult, 
						function(err) {
						    if(err) {
						        console.log(err);
						    }
						    console.log("The file was saved!");
						}
					); 
				}
		    }
		);

		child.stderr.on('data',
		    function (data) {
		        console.log(data.toString('utf8'));
		    }
		);

	})
	.on('change', function(path) {})
	.on('unlink', function(path) {})
	.on('error', function(error) {console.error('Error happened', error);})
