#!#/bin/bash

node ./xfile/xprediction_service.js &
node ./xfile/upload_image_watcher.js &
node ./xfile/cropped_image_watcher.js &
node ./xfile/fragmented_image_watcher.js 