// var absolutePath = "/home/CarParkingNode/";
var absolutePath = "/Users/synycboom/Desktop/CarParkingNode/";
module.exports = {
	/**************************************** Absolute Path *******************************************/
	// absolutePath: "/home/CarParkingNode/",
	absolutePath: "/Users/synycboom/Desktop/CarParkingNode/",
	/******************************************* Folders **********************************************/
	fragmentFolder: absolutePath + "fragmented_images/",
	cropFolder: absolutePath + "cropped_images/",
	predictFolder: absolutePath + "predicted_output/",
	tempFolder: absolutePath + "temp/",
	configFolder: absolutePath + "config/",
	uploadFolder: absolutePath + "upload/",

	trainingSetFolder: absolutePath + "traning_set/",
	carSetFolder: absolutePath +    "traning_set/car_set/",
	notCarSetFolder: absolutePath + "traning_set/not_car_set/",

	/******************************************* Files ***********************************************/
	
	dictionaryFile: absolutePath + "config/dictionary.yml",
	modelFile: absolutePath + "config/descriptor.model",
	csvFile: absolutePath + "config/slot_pos.csv",
	csvDispFile: absolutePath + "config/disp.csv",

	natsortFile: "./natsort",
	
	/******************************************* other ***********************************************/
	port: 3000
}
