var spawn = require('child_process').spawn;
var method = {

	crop:function(inputFile, outputFile, slotData, callback, updateCallback, data){

			var child = spawn('./crop-image',[inputFile, outputFile]);
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
				if(updateCallback)
					updateCallback(data, outputFile);
	    		callback(err,outputFile,slotData);
			});
		}

}

module.exports = method;
