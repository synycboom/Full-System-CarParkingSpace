var setting = require('../setting.js');


var method = {
	show: function(){
                var val = "";
		for (var i = 1; i <= 16; i++) {
			var targetFile = setting.predictFolder + 'slot' + i + ".json";
			var result = require(targetFile).predict;

			if(i == 8 ){
				if(result == "1")
					val += "<div  style=' text-align: center; float: left; height: 48%; width: 11.5%; margin: 0.5%; background-color: green;'>slot"+i+"</div>";
				else
					val += "<div style='text-align: center; float: left; height: 48%; width: 11.5%; margin: 0.5%; background-color: red;'>slot"+i+"</div>";

				continue;
			}

                        if(i == 9 ){
				if(result == "1")
					val += "<div  style='clear:left; text-align: center; float: left; height:48%; width:11.5%; margin:0.5%; background- color: green;'>slot"+i+"</div>";
				else
					val += "<div style='clear:left; text-align: center; float: left; height:48%; width:11.5%; margin:0.5%; background-color: red;'>slot"+i+"</div>";

				continue;
			}

			if(result == "1")
				val += "<div style='text-align: center; float: left; height:48%; width:11.5%; margin:0.5%; background-color:green;'>slot"+i+"</div>";
			else
				val += "<div  style='text-align: center; float: left; height:48%; width:11.5%; margin:0.5%; background-color:red;'>slot"+i+"</div>";

		};
		return val;
	}
}

module.exports = method;
