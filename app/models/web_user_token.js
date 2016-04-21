var mongoose = require('mongoose');

var user_token_Schema = mongoose.Schema({
	token: String,
	parkinglotName: String,
	username: String,
	latitude: String,
	longtitude: String
});

module.exports = mongoose.model('User-token', user_token_Schema);