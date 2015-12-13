var setting = require('../setting.js');
var spawn = require("child_process").spawn;
var child = spawn('./Predictor' ,[ setting.descriptorFile, setting.labelFile, setting.connectionPort ]);

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