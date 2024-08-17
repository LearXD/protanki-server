#!/bin/bash

directory="./src"
lines_count=0

lines_count() {
    for file in "$1"/*; do
        if [ -f "$file" ]; then
            lines=$(awk 'END {print NR}' "$file")
            echo "$file: $lines lines"
            lines_count=$((lines_count + lines))
        elif [ -d "$file" ]; then
            lines_count "$file"
        fi
    done
}

lines_count "$directory"
echo "Total of lines: $lines_count"