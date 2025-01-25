#!/bin/bash

base_dir="personalized"
types=("gradient" "top_half" "brush_stroke" "line" "dots" "base")
flavors=(
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
  "Raa Rii Red"
  "Salmas Orange"
  "Sosase Silver"
)

# Helper function to slugify flavor names
slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[ _-]+/_/g' | sed 's/[^a-z0-9_]//g'
}

# Iterate over each type and flavor
for type in "${types[@]}"; do
  echo "Checking type: $type"
  type_dir="$base_dir/$type"

  # Ensure the type directory exists
  if [[ ! -d "$type_dir" ]]; then
    echo "  [Missing] Type directory: $type_dir"
    continue
  fi

  for flavor in "${flavors[@]}"; do
    flavor_slug=$(slugify "$flavor")
    flavor_dir="$type_dir/$flavor_slug"

    # Check if the flavor directory exists
    if [[ ! -d "$flavor_dir" ]]; then
      echo "  [Missing] Flavor directory: $flavor in type: $type"
      continue
    fi

    # Check for the required files in the flavor directory
    [[ ! -f "$flavor_dir/top.png" ]] && echo "  [Missing] File: $flavor_dir/top.png"
    [[ ! -f "$flavor_dir/side.png" ]] && echo "  [Missing] File: $flavor_dir/side.png"
  done
done