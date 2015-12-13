!#/bin/bash

node xprediction_service.js &
node upload_image_watcher.js &
node cropped_image_watcher.js &
node fragmented_image_watcher.js 
