@echo off
chcp 65001 >nul
echo ============================
echo   RCX论坛 一键启动
echo ============================
echo.

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装: https://nodejs.org
    pause
    exit /b 1
)

echo [1/3] 安装依赖...
cd /d "%~dp0"
if not exist node_modules (
    npm install express cors nodemailer
) else (
    echo       依赖已存在，跳过安装
)

echo.
echo [2/3] 启动后端邮件服务 (端口 3000)...
start "RCX邮件服务" cmd /k "node server.js"

echo.
echo [3/3] 启动前端 HTTP 服务 (端口 8080)...
start "RCX前端服务" cmd /k "npx http-server -p 8080 -c-1"

echo.
echo ============================
echo   启动完成！
echo   前端: http://localhost:8080
echo   后端: http://localhost:3000
echo ============================
echo.
echo 浏览器将自动打开前端页面...
timeout /t 3 /nobreak >nul
start http://localhost:8080
