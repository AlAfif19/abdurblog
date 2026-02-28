@echo off
echo Starting AbdurBlog development environment...
echo.

echo [1/2] Starting API backend...
start "AbdurBlog API" cmd /k "cd apps\api && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Web frontend...
start "AbdurBlog Web" cmd /k "cd apps\web && npm run dev"

echo.
echo ========================================
echo Development servers started!
echo ========================================
echo API:    http://localhost:3001
echo Web:    http://localhost:3000
echo ========================================
echo.
echo Press any key to close this window (servers will continue running)...
pause >nul
