var mongoose = require('mongoose');

var web_register_parking_Schema = mongoose.Schema({
	token: String,
	parkinglotName: String,
	parkingView: [
		{
			slotID: String,
			x: String,
			y: String,
			width: String,
			height: String
		}
	]
});

module.exports = mongoose.model('Web-register-parking', web_register_parking_Schema);