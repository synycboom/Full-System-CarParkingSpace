var mongoose = require('mongoose');

var drone_register_parking_Schema = mongoose.Schema({
	token: String,
	imageName: String,
	path: String,
	isProcessed: Boolean
});

module.exports = mongoose.model('Drone-register-parking', drone_register_parking_Schema);