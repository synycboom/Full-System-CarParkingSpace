var setting = require('../setting.js');
var spawn = require("child_process").spawn;

var method = {
	predict: function(inputFile, outputFile, slotData, callback){
		var child = spawn('./svm-predict',[inputFile, setting.modelFile, outputFile]);
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
    		callback(err,outputFile, slotData);
		});
	}
}


module.exports = method;
