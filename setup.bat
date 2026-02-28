@echo off
echo ========================================
echo AbdurBlog First-Time Setup
echo ========================================
echo.

echo [1/5] Installing root dependencies...
call npm install
echo.

echo [2/5] Installing API dependencies...
cd apps/api
call npm install
cd ../..
echo.

echo [3/5] Installing Web dependencies...
cd apps/web
call npm install
cd ../..
echo.

echo [4/5] Generating Prisma client...
cd apps/api
call npx prisma generate
echo.

echo [5/5] Pushing database schema to PostgreSQL...
call npx prisma db push
cd ../..
echo.

echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Now you can run 'start-full.bat' to start everything
echo.
pause
