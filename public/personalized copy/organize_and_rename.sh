#!/bin/bash

# Script Name: organize_and_rename.sh
# Description: Organizes and renames image files based on predefined color names.
# Usage: ./organize_and_rename.sh <target_folder> [--dry-run]

# Exit immediately if a command exits with a non-zero status, treat unset variables as an error, and fail pipelines on the first failing command
set -euo pipefail

# ----------------------------
# Function Definitions
# ----------------------------

# Function to display usage information
usage() {
    echo "Usage: $0 <target_folder> [--dry-run]"
    exit 1
}

# Enhanced slugify function
# Converts "Apple Crunch" -> "apple_crunch"
# Handles multiple spaces, hyphens, and removes special characters
slugify() {
    echo "$1" | \
    tr '[:upper:]' '[:lower:]' | \
    sed -E 's/[ _-]+/_/g; s/[^a-z0-9_]+//g'
}

# Function to generate a unique filename to prevent overwriting
generate_unique_filename() {
    local directory="$1"
    local base_name="$2"
    local extension="$3"
    local counter=1
    local new_name="${base_name}${extension}"
    
    while [[ -e "${directory}/${new_name}" ]]; do
        new_name="${base_name}_${counter}${extension}"
        ((counter++))
    done
    
    echo "$new_name"
}

# ----------------------------
# Argument Parsing
# ----------------------------

# Check if at least one argument is provided
if [[ -z "${1:-}" ]]; then
    usage
fi

# Set the target folder based on the provided argument
target_folder="$1"
dry_run=false
log_file="organize_and_rename.log"

# Check for the --dry-run flag
if [[ "${2:-}" == "--dry-run" ]]; then
    dry_run=true
    echo "Performing a DRY RUN. No files will be moved or renamed."
fi

# ----------------------------
# Validation
# ----------------------------

# Ensure the target folder exists
if [[ ! -d "$target_folder" ]]; then
    echo "Error: The folder '$target_folder' does not exist."
    exit 1
fi

# Define the origin subfolders
origin_top="$target_folder/origin/0 vista arriba"
origin_side="$target_folder/origin/1 vista lateral"

# Ensure origin subfolders exist
if [[ ! -d "$origin_top" || ! -d "$origin_side" ]]; then
    echo "Error: Origin subfolders not found in '$target_folder/origin'."
    exit 1
fi

# ----------------------------
# Define Colors Array
# ----------------------------

# Flavors (your colors)
COLORS=(
  "Apple Crunch"
  "Aqua Lagoon"
  "Blue Pearl"
  "Caramelita"
  "Copper King"
  "Deep purple shimmer"
  "Fool Gold"
  "Forest Green"
  "Green Jade Pearl"
  "Gun Metal Grey"
  "Hello Yellow"
  "Lilac"
  "Lime shine"
  "Maroon Machine"
  "Midnight Blue"
  "Midnight Galaxy"
  "Mighty Mint"
  "Nancys Green Pearl"
  "Oh That Blue"
  "Pink"
  "Purple Rain"
  "Raa Ril Red"
  "Salmas Orange"
  "Sosase Silver"
)

# ----------------------------
# Main Processing Loop
# ----------------------------

# Initialize or clear the log file
if [[ "$dry_run" == false ]]; then
    : > "$target_folder/$log_file"
fi

# Iterate over each color
for color in "${COLORS[@]}"; do
    color_slug=$(slugify "$color") # Convert color to slug format
    
    # Prepare the color folder path
    color_folder="$target_folder/$color_slug"
    
    # Create the color folder if it doesn't exist
    if [[ "$dry_run" == false ]]; then
        mkdir -p "$color_folder"
    fi
    
    # Replace spaces with hyphens for search pattern
    color_search=$(echo "$color" | tr ' ' '-')
    
    # Process "vista arriba" files -> top.png
    find "$origin_top" -type f -iname "*${color_search}*" -print0 | while IFS= read -r -d '' file; do
        if [[ -f "$file" ]]; then
            target_file="${color_folder}/top.png"
            # Check if target_file already exists
            if [[ "$dry_run" == true ]]; then
                echo "DRY RUN: Move '$file' to '$target_file'"
            else
                if [[ -e "$target_file" ]]; then
                    unique_name=$(generate_unique_filename "$color_folder" "top" ".png")
                    mv "$file" "$color_folder/$unique_name"
                    echo "$(date '+%Y-%m-%d %H:%M:%S') - Moved and renamed '$file' to '$color_folder/$unique_name'" | tee -a "$target_folder/$log_file"
                else
                    mv "$file" "$target_file"
                    echo "$(date '+%Y-%m-%d %H:%M:%S') - Moved and renamed '$file' to '$target_file'" | tee -a "$target_folder/$log_file"
                fi
            fi
        fi
    done
    
    # Process "vista lateral" files -> side.png
    find "$origin_side" -type f -iname "*${color_search}*" -print0 | while IFS= read -r -d '' file; do
        if [[ -f "$file" ]]; then
            target_file="${color_folder}/side.png"
            # Check if target_file already exists
            if [[ "$dry_run" == true ]]; then
                echo "DRY RUN: Move '$file' to '$target_file'"
            else
                if [[ -e "$target_file" ]]; then
                    unique_name=$(generate_unique_filename "$color_folder" "side" ".png")
                    mv "$file" "$color_folder/$unique_name"
                    echo "$(date '+%Y-%m-%d %H:%M:%S') - Moved and renamed '$file' to '$color_folder/$unique_name'" | tee -a "$target_folder/$log_file"
                else
                    mv "$file" "$target_file"
                    echo "$(date '+%Y-%m-%d %H:%M:%S') - Moved and renamed '$file' to '$target_file'" | tee -a "$target_folder/$log_file"
                fi
            fi
        fi
    done
done

# ----------------------------
# Completion Message
# ----------------------------

if [[ "$dry_run" == true ]]; then
    echo "------------------------------------------"
    echo "DRY RUN complete. No files were moved or renamed."
else
    echo "------------------------------------------"
    echo "Organization and renaming complete for folder: $target_folder"
    echo "Details logged in '$target_folder/$log_file'."
fi