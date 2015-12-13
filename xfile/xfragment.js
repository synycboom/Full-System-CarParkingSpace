var spawn = require('child_process').spawn;

var method = {
	fragment: function(inputFile, outputPath, callback){
		var child = spawn('./FragmentImage',[inputFile, outputPath]);
		
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
