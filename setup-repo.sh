#!/bin/bash
set -e

cd /home/rainyroot/VSCProjects/NekoTama

# Copy plan file from old location if it exists
if [ -f /home/rainyroot/VSCProjects/WaifuTama/archwaifu-plan.jsx ]; then
  cp /home/rainyroot/VSCProjects/WaifuTama/archwaifu-plan.jsx ./nekotama-plan.jsx
  echo "Copied plan file"
fi

# Remove placeholder
rm -f .gitkeep

# Init git
git init
git checkout -b main

# Initial commit on main
git add README.md .gitignore
git commit -m "Initial commit"

# Create GitHub repo
gh repo create NekoTama --public --description "Anime desktop pet for Linux — Tamagotchi meets system monitor" --source=. --remote=origin --push

echo "main branch pushed"

# Create and push dev branch
git checkout -b dev
git add .
git commit -m "Add project planning files"
git push origin dev

echo ""
echo "Done! Repo: https://github.com/$(gh api user --jq .login)/NekoTama"
echo "  main  → releases"
echo "  dev   → development (current)"
