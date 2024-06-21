#!/bin/sh

echo "Closing existing frontend and backend processes..."
pkill -f "npm run dev"

echo "Starting frontend..."
(cd frontend && npm run dev &)

echo "Starting backend..."
(cd backend && npm run dev &)

wait

echo "Opening http://localhost:5173/ in the default browser..."
case "$OSTYPE" in
  darwin*)  open http://localhost:5173/ ;;  # macOS
  linux*)   xdg-open http://localhost:5173/ ;;  # Linux
  msys*)    start http://localhost:5173/ ;;  # Windows
  *)        echo "Unsupported OS: $OSTYPE" ;;
esac
