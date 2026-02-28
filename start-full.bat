@echo off
echo Starting AbdurBlog full environment...
echo.

echo [0/3] Starting Docker Compose (PostgreSQL + MinIO)...
start "Docker Compose" docker compose up

timeout /t 5 /nobreak >nul

echo [1/3] Starting API backend...
start "AbdurBlog API" cmd /k "cd apps\api && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Web frontend...
start "AbdurBlog Web" cmd /k "cd apps\web && npm run dev"

echo.
echo ========================================
echo Full development environment started!
echo ========================================
echo API:       http://localhost:3001
echo Web:       http://localhost:3000
echo DB:        postgresql://localhost:5432/abdurblog
echo MinIO:     http://localhost:9001
echo ========================================
echo.
echo Press any key to close this window (servers will continue running)...
pause >nul
