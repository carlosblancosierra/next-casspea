#!/bin/bash

# Function to rename directories recursively
rename_dirs() {
    local dir="$1"
    
    echo "Searching for directories in: $dir"
    
    # Find all directories containing underscores and rename them
    find "$dir" -type d | while read -r path; do
        dirname=$(basename "$path")
        if [[ "$dirname" == *"_"* ]]; then
            newname=$(echo "$dirname" | tr '_' '-')
            newpath="${path%/*}/$newname"
            echo "Found directory with underscore: $path"
            mv "$path" "$newpath"
            echo "Renamed: $path -> $newpath"
        fi
    done
}

# Path to personalized directory
base_path="./personalized"

# Confirm before proceeding
echo "This will rename all folders containing underscores to use dashes in: $base_path"
read -p "Do you want to proceed? (y/n): " confirm

if [[ $confirm == [yY] ]]; then
    rename_dirs "$base_path"
    echo "Folder renaming complete!"
else
    echo "Operation cancelled."
fi