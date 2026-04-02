#!/bin/bash

# ==============================
# CONFIG
# ==============================
DRY_RUN=true          # Set to false to actually delete duplicates and commit
COMMIT_MESSAGE="Remove duplicate tracked files"

# ==============================
# CHECK GIT REPO
# ==============================
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "❌ Not inside a Git repository."
    exit 1
fi

# ==============================
# GET TRACKED FILES
# ==============================
FILES=$(git ls-files)

# ==============================
# COMPUTE HASHES
# ==============================
declare -A hash_map

for f in $FILES; do
    if [ -f "$f" ]; then
        hash=$(sha256sum "$f" | awk '{print $1}')
        hash_map["$hash"]+="$f"$'\n'
    fi
done

# ==============================
# FIND DUPLICATES AND DELETE
# ==============================
duplicates_found=false

for hash in "${!hash_map[@]}"; do
    IFS=$'\n' read -r -d '' -a files <<< "${hash_map[$hash]}"$'\0'

    if [ "${#files[@]}" -gt 1 ]; then
        duplicates_found=true
        echo "Duplicate files (hash: $hash):"
        for f in "${files[@]}"; do
            echo "  $f"
        done
        echo

        if [ "$DRY_RUN" = false ]; then
            # Keep first file, delete the rest
            for f in "${files[@]:1}"; do
                rm -v "$f"
            done
        fi
    fi
done

# ==============================
# COMMIT CHANGES
# ==============================
if [ "$duplicates_found" = true ] && [ "$DRY_RUN" = false ]; then
    git add -u
    git commit -m "$COMMIT_MESSAGE"
    echo "✅ Duplicate files removed and changes committed."
elif [ "$duplicates_found" = false ]; then
    echo "✅ No duplicate tracked files found."
else
    echo "Dry-run mode: no files deleted or committed."
fi
