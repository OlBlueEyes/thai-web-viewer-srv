#!/usr/bin/env bash
set -e

echo "Deploy started..."

echo "Fetch latest code"
git pull origin main

echo "Install dependencies"
yarn install --frozen-lockfile

echo "Build project"
yarn build

echo "Start or reload application"
pm2 startOrReload ecosystem.config.js --env production

echo "Deploy finished successfully"
