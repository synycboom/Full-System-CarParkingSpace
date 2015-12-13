var spawn = require('child_process').spawn;
var method = {

	crop:function(inputFile, outputfile, callback){
			var child = spawn('./CroppingImage',[inputFile, outputfile]);
			
			child.stdout.on('data', 
			    function (data) {
			        console.log(data.toString('utf8'),"");
			    }
			);

			child.stderr.on('data',
			    function (data) {
			    	console.log(data.toString('utf8'),"err");
			    }
			);
		}

}

module.exports = method;
