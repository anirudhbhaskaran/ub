#!/bin/sh

# Start PocketBase in background
./pocketbase serve &

# Wait a moment to ensure PocketBase is up
sleep 1

# Start your orchestrator
node index.js
