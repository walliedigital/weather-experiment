#!/bin/bash
aws s3 cp ./package.json s3://migest-weather/package.json
aws s3 cp ./README.md s3://migest-weather/README.md
aws s3 cp ./express-server.js s3://migest-weather/express-server.js
aws s3 cp ./site-sync.sh s3://migest-weather/site-sync.sh
aws s3 sync ./build/ s3://migest-weather/build/
