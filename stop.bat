@echo off
echo Stopping AbdurBlog development servers...
echo.

taskkill /FI "WINDOWTITLE eq AbdurBlog API*" 2>nul
taskkill /FI "WINDOWTITLE eq AbdurBlog Web*" 2>nul
taskkill /FI "WINDOWTITLE eq Docker Compose*" 2>nul

timeout /t 1 /nobreak >nul

echo.
echo All development servers stopped.
echo.
echo Tip: Run 'docker compose down' to stop PostgreSQL and MinIO containers.
pause
