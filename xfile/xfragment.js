var spawn = require('child_process').spawn;
var setting = require('../setting.js');

var method = {
	fragment: function(inputFile, outputPath, callback){
		var child = spawn('./fragment-image',[setting.csvFile,inputFile, outputPath]);
		var err = false;
		child.stdout.on('data', 
		    function (data) {
		        console.log(data.toString('utf8'));
		    }
		);

		child.stderr.on('data',
		    function (data) {
		    	console.log(data.toString('utf8'));
		    	err = true;
		    }
		);

		child.on('close', function(code) {
    		callback(err,outputPath);
		});
	}
}


module.exports = method;
