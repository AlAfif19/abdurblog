#!/bin/bash

echo "Starting AbdurBlog development environment..."
echo ""

echo "[0/2] Starting Docker Compose (PostgreSQL + MinIO)..."
docker compose up -d

echo ""
echo "[1/2] Starting API backend..."
cd apps/api && npm run dev &
API_PID=$!
cd ../..

sleep 2

echo "[2/2] Starting Web frontend..."
cd apps/web && npm run dev &
WEB_PID=$!
cd ../..

echo ""
echo "========================================"
echo "Full development environment started!"
echo "========================================"
echo "API:       http://localhost:3001"
echo "Web:       http://localhost:3000"
echo "DB:        postgresql://localhost:5432/abdurblog"
echo "MinIO:     http://localhost:9001"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for processes
wait $API_PID $WEB_PID
