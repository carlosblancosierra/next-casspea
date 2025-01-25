#!/bin/bash

# Check if the folder name is provided as an argument
if [[ -z "$1" ]]; then
  echo "Usage: ./list_structure.sh <folder>"
  exit 1
fi

# Set the target folder based on the provided argument
target_folder="$1"

# Check if the target folder exists
if [[ ! -d "$target_folder" ]]; then
  echo "Error: The folder '$target_folder' does not exist."
  exit 1
fi

# Print the folder and file structure
echo "Listing structure for folder: $target_folder"
echo "------------------------------------------"
find "$target_folder" -type d -exec echo "Directory: {}" \; -o -type f -exec echo "  File: {}" \;
echo "------------------------------------------"
echo "Structure listing complete."