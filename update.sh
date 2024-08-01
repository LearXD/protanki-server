#!/bin/sh

echo "Stopping the server"
pm2 stop protanki-server

echo "Updating the server"
git pull

echo "Checking dependencies"
npm install

echo "Building the server"
npm run build

echo "Starting the server"
pm2 start protanki-server