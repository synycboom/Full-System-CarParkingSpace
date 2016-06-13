var absolutePath = "/home/azureuser/CarParkingNode/";
module.exports = {
	/**************************************** Absolute Path *******************************************/
	absolutePath: "/home/azureuser/CarParkingNode/",
	/******************************************* Folders **********************************************/
	fragmentFolder: absolutePath + "fragmented_images/",
	cropFolder: absolutePath + "cropped_images/",
	predictFolder: absolutePath + "predicted_output/",
	tempFolder: absolutePath + "temp/",
	configFolder: absolutePath + "config/",
	uploadFolder: absolutePath + "upload/",
	userDataFolder: absolutePath + "user_data/",
	dbFolder: absolutePath + "db/",

	trainingSetFolder: absolutePath + "traning_set/",
	carSetFolder: absolutePath +    "traning_set/car_set/",
	notCarSetFolder: absolutePath + "traning_set/not_car_set/",
	markerPatternFolder: absolutePath + "config/marker_pattern/",

	/******************************************* Files ***********************************************/
	
	dictionaryFile: absolutePath + "config/dictionary.yml",
	modelFile: absolutePath + "config/svm.model",
	csvFile: absolutePath + "config/slot_pos.csv",
	csvDispFile: absolutePath + "config/disp.csv",

	natsortFile: absolutePath + "xfile/natsort",
	cropImageFile: absolutePath + "xfile/crop-image",
	fragmentImageFile: absolutePath + "xfile/fragment-image",
	siftImageFile: absolutePath + "xfile/sift-test",
	svmImageFile: absolutePath + "xfile/svm-predict",
	
	/******************************************* other ***********************************************/
	port: 3000
}
