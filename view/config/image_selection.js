var fs = require('fs');
var setting = require('../../setting.js');

var method = {
	getHtml: function(){
		var data = fs.readdirSync(setting.cropFolder);
			
		var allFiles = [], allFilesPath = [];
		for(var i = 0;i < data.length; i++){

			var patt = /(.jpg)|(.png)/gi;
			if(! patt.test(data[i])){
				console.log(data[i]);
				continue;
			}
			allFilesPath.push("../../public/cropped_images/" + data[i]);
			allFiles.push(data[i]);
			// console.log(data[i]);
			// console.log(data);
		}
		// console.log(allFiles);
		
		var html_head = 
			"<html>\n"+
				"<head>\n"+
				  "<link rel='stylesheet' type='text/css' href='../../public/css/image_selection.css'>\n"+
				"</head>\n"+
				"<body>\n"+
					"<div>\n";

		var html_body = "";
		for(var i = 0; i < allFiles.length; i++){
			html_body += "<figure> \n";
			html_body += 	"<img src='" + allFilesPath[i] + "' alt='" + allFiles[i] + "'>\n";
			html_body +=		"<figcaption> \n";
			html_body +=			"File: " + allFiles[i] + "\n";
			html_body +=		"</figcaption> \n";
			html_body += "</figure> </br></br>\n";
		}

		var html_foot = 
					"</div>\n"+
				"</body>\n"+
			"</html>\n";
		
		return html_head + html_body + html_foot;


	}
}

module.exports = method;
	