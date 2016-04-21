var mongoose = require('mongoose');

var ml_service_parking_Schema = mongoose.Schema({
	token: String,
	parkinglotName: String,
	captureDate: String,
	parkingDetail: {
		carCount: String,
		slotSize: String,
		parkingStatus: String,
		slotStatus: [
			{
				slotID: String,
				isAvailable: Boolean
			}
		]
	}
});

module.exports = mongoose.model('Ml-service-parking', ml_service_parking_Schema);