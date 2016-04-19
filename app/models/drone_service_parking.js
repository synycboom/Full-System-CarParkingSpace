var mongoose = require('mongoose');

var drone_service_parking_Schema = mongoose.Schema({
	token: String,
	imageName: String,
	path: String,
	isProcessed: Boolean
});

module.exports = mongoose.model('Drone-service-parking', drone_service_parking_Schema);