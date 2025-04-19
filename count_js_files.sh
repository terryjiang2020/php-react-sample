#!/bin/sh

# Count JavaScript files in the repository
ROOT_DIR="$(pwd)"
echo "Counting JavaScript files in $(basename "$ROOT_DIR")..."

# Define exclusion patterns
EXCLUDE_DIRS="node_modules vendor dist build .git test tests spec mock example sample"

# Build the find command with exclusions
find_cmd="find \"$ROOT_DIR\" -type f \( -name \"*.js\" -o -name \"*.jsx\" \)"

# Add exclusion patterns
for dir in $EXCLUDE_DIRS; do
  find_cmd="$find_cmd -not -path \"*/$dir/*\""
done

# Count JS files (*.js and *.jsx)
js_files=$(eval "$find_cmd")
js_count=$(echo "$js_files" | grep -v "^$" | wc -l)
echo "Found $js_count JavaScript files"

# Show breakdown by file extension
js_only=$(echo "$js_files" | grep "\.js$" | wc -l)
jsx_only=$(echo "$js_files" | grep "\.jsx$" | wc -l)
echo "  *.js:  $js_only files"
echo "  *.jsx: $jsx_only files"

# List JS files with their paths relative to the repository root
echo -e "\nJavaScript Files:"
echo "$js_files" | sed "s|$ROOT_DIR/||" | sort