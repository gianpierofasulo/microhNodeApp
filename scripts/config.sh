#!/bin/bash

# Specify the file path and name
source_file="/etc/ddxtouch/ddxtouch.conf"

# Specify the destination directory
destination_dir="/public/private/periferiche/"

# Specify the new file name
new_file_name="test.json"

# Copy the file to the destination directory and rename it
cp $source_file $destination_dir$new_file_name
