#!/bin/bash

# Set the base path to the current directory (dots)
base_path="./"

# Iterate over all subfolders in the base path
for color_folder in "$base_path"*/; do
  # Check if the folder contains files
  if [[ -d "$color_folder" ]]; then
    echo "Processing folder: $color_folder"
    
    # Rename "arriba" files to top.png
    for file in "$color_folder"*arriba*.png; do
      if [[ -f "$file" ]]; then
        mv "$file" "$color_folder/top.png"
        echo "Renamed $file to top.png"
      fi
    done

    # Rename "lateral" files to side.png
    for file in "$color_folder"*lateral*.png; do
      if [[ -f "$file" ]]; then
        mv "$file" "$color_folder/side.png"
        echo "Renamed $file to side.png"
      fi
    done
  fi
done

echo "Renaming complete!"