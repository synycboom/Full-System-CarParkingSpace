var bodyParser = require('body-parser')

var bodyParserModule = function() {
	bodyParser.json();
	bodyParser.urlencoded({ extended: true});
}

module.exports = bodyParserModule;