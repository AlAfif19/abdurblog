#!/bin/bash

echo "========================================"
echo "AbdurBlog First-Time Setup"
echo "========================================"
echo ""

echo "[1/5] Installing root dependencies..."
npm install
echo ""

echo "[2/5] Installing API dependencies..."
cd apps/api
npm install
cd ../..
echo ""

echo "[3/5] Installing Web dependencies..."
cd apps/web
npm install
cd ../..
echo ""

echo "[4/5] Generating Prisma client..."
cd apps/api
npx prisma generate
echo ""

echo "[5/5] Pushing database schema to PostgreSQL..."
npx prisma db push
cd ../..
echo ""

echo "========================================"
echo "Setup complete!"
echo "========================================"
echo ""
echo "Now you can run './start.sh' to start everything"
echo ""
