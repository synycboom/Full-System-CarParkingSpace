# CarParkingSpaceServer
Car Parking Space Detection System
  
* Description
  - The system uses nodejs to be a webserver and uses compiled c++ code to process and manipulate image which is uploaded
  from drone.
  - please note that all files and compiled c++ are on osx enviroment, so it can't be run on the other os now
    untill we'll have done in (maybe) next 2 months 
  
* Structure of Processing in The System

  -CarParkingSpaceServer/
    -setting.js            -- The setting file in project
    -config/
      -descriptor.model    -- SVM's model used in libsvm  
      -dictionary.yml      -- Dictionary for Bag of Visual Words
      -slot_pos.csv        -- Position of car parking slot marked by user
    -upload/               -- Containing all uploaded image
    -cropped_images/       -- Containing cropped image from the first stage
    -fragmented_images/    -- Containing fragmented image (by slot position) from the second stage
    -temp/                 -- Containing all temp file and ressult from prediction
    -xfiles/
      -crop-image          -- Compiled c++ file which is used for cropping an image
      -fragment-image      -- Compiled c++ file which is used for fragmenting an image
      -natsort             -- Compiled c++ file which is used for sorting file name
      -sift-test           -- Compiled c++ file which is used for extracting feature from image
      -svm-predict         -- Compiled c++ file which is used for predicting result from feature
      -xcropping.js        -- Nodejs file to execute crop-image
      -xfragment.js        -- Nodejs file to execute fragment-image
      -xsift.js            -- Nodejs file to execute sift-test
      -xsvm.js             -- Nodejs file to execute svm-predict
      -upload_image_watcher.js  -- Nodejs file to watch upload folder and process all stage

* How it works
  1. When user uploads an image from drone. An uploaded image will catched by upload_image_watcher.js
  2. Inside an upload_image_watcher.js file. The first stage (cropping an image) will be executed. A cropped image
     will be in a cropped_image folder
  3. The second stage (fragmenting an image) reads slot_pos.csv to specify position in an image to fragment.
     After fragmentation process, all fragmented images are kept in fragmented_images folder.
  4. The third stage (sift feature extracting) reads all images and sort them by using natsort then extracts feature
     and keeps them in temp folder.
  5. The fourth stage (prediction) reads all features from the output of the third stage then predicts the result
     and saves the result to temp folder
