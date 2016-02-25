/****************** Got a problem with Full Path Specify!!!!! **********************/
var setting = require('../setting.js');
var spawn = require('child_process').spawn;

var child = spawn('./DescriptorExtracting',
	// [ setting.dictionaryFile,setting.carSetFolder, setting.carSetAmount, setting.notCarSetFolder, setting.notCarSetAmount, setting.ymlFolder]

	[
	setting.dictionaryFile, 
	"../training_set/car_set", 
	setting.carSetAmount , 
	"../training_set/not_car_set", 
	setting.notCarSetAmount , 
	setting.ymlFolder
	]
	
	// [
	// "/home/synycboom/Desktop/nodePark/yml_files/dictionary.yml",
	// "/home/synycboom/Desktop/nodePark/traning_set/car_set/",
	// "114",
	// "/home/synycboom/Desktop/nodePark/traning_set/not_car_set/",
	// "107",
	// "/home/synycboom/Desktop/nodePark/yml_files/"
	// ]

	);

child.stdout.on('data', 
    function (data) {
        console.log(data.toString('utf8'));
    }
);

child.stderr.on('data',
    function (data) {
        console.log(data.toString('utf8'));
    }
);