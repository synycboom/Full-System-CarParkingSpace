var spawn = require('child_process').spawn;
var setting = require('../setting.js');
var method = {

	extractFeature:function(inputPath, outputfile, slotData, callback){
			var child = spawn('./sift-test',[setting.dictionaryFile,inputPath, setting.natsortFile,outputfile]);
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
	    		callback(err,outputfile, slotData);
			});
	}

}

module.exports = method;