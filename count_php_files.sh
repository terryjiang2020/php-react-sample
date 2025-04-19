#!/bin/bash

# Count PHP files in the repository
ROOT_DIR="$(pwd)"
echo "Counting PHP files in $(basename "$ROOT_DIR")..."

# Define exclusion patterns
EXCLUDE_DIRS=(
  "node_modules" "vendor" "dist" "build" ".git" 
  "test" "tests" "spec" "mock" "example" "sample"
)

# Create exclusion arguments
EXCLUDE_ARGS=()
for dir in "${EXCLUDE_DIRS[@]}"; do
  EXCLUDE_ARGS+=(-not -path "*/$dir/*")
done

# Count PHP files
php_count=$(find "$ROOT_DIR" -type f -name "*.php" "${EXCLUDE_ARGS[@]}" | wc -l)
echo "Found $php_count PHP files"

# List PHP files with their paths relative to the repository root
echo -e "\nPHP Files:"
find "$ROOT_DIR" -type f -name "*.php" "${EXCLUDE_ARGS[@]}" | 
  sed "s|$ROOT_DIR/||" | 
  sort