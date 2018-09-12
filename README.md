###Car Parking Space Detection System
  
#### * Description
  - a webserver for processing and manipulating images which are uploaded from a drone
  
#### * Structure of This System

  - CarParkingSpaceServer/
    - setting.js                  ###### a setting file in project
    - app/
      - improc_controller.js      ###### a controller for executeing all processing stages
    - config/
      - svm.model                 ###### an SVM model used by libsvm  
      - dictionary.yml            ###### a dictionary for using in Bag of Visual Words algorithm
      - slot_pos.csv              ###### a config file for car parking space positions (all positions are marked by a user)
    - upload/                     ###### a folder used for containing uploaded images
    - cropped_images/             ###### a folder used for containing cropped images from the first stage
    - fragmented_images/          ###### a folder used for containing fragmented images from the second stage
    - temp/                       ###### a folder used for containing all temp files and ressults from prediction
    - xfiles/
      - crop-image                ###### a compiled c++ file used to crop images
      - fragment-image            ###### a compiled c++ file used to fragment images
      - natsort                   ###### a compiled c++ file used to sort file names
      - sift-test                 ###### a compiled c++ file used to extract features from images
      - svm-predict               ###### a compiled c++ file used to predict a result from features extracted by sift-test
      - xcropping.js              ###### a script file used to execute the crop-image file
      - xfragment.js              ###### a script file to execute the fragment-image file
      - xsift.js                  ###### a script file to execute the sift-test file
      - xsvm.js                   ###### a script file to execute the svm-predict file

 * How it works
  1. A user uploads an image from a drone.
  2. The system do its first stage which is cropping an image. The cropped image will be stored in the cropped_images folder
  3. The second stage is fragmenting an image. The system reads slot_pos.csv, tries to find all car parking positions in the cropped image, and fragments them into several sections. After fragmentation stage is completed, all fragmented images are kept in the fragmented_images folder.
  4. The third stage is doing sift feature extraction. The System reads all images, sorts them by using natsort, extracts predictable features, and saves them into the temp folder.
  5. The final stage is predicting a result. The system reads all features from a file in the temp folder, predicts the result, saves it back to the temp folder, and stores some information in database.
