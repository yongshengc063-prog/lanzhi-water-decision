@echo off
chcp 65001 >nul
title 澜知 · 水域生态修复智能决策系统
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo [错误] 未检测到 Node.js。
  echo 请先安装 Node.js：https://nodejs.org/  （建议 LTS 版本）
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo.
  echo 首次运行，正在安装依赖，请稍候...
  call npm install
  if errorlevel 1 (
    echo.
    echo [错误] 依赖安装失败，请检查网络后重试。
    pause
    exit /b 1
  )
)

rem 已经有了正在运行的生产服务，直接打开浏览器
netstat -ano | findstr 8787 | findstr LISTENING >nul
if not errorlevel 1 (
  echo.
  echo 服务已经在运行，正在打开浏览器：
  echo http://localhost:8787
  echo.
  start "" "http://localhost:8787"
  pause
  exit /b 0
)

if exist "dist\index.html" goto production
goto development

:production
echo.
echo  ================================================
echo   澜知 · 水域生态修复智能决策系统
echo   生产模式（已构建），正在启动...
echo   地址：http://localhost:8787
echo   关闭本窗口即可停止服务。
echo  ================================================
echo.
start "" cmd /c "timeout /t 3 >nul & start http://localhost:8787"
node server\index.mjs
pause
exit /b 0

:development
echo.
echo  ================================================
echo   澜知 · 水域生态修复智能决策系统
echo   开发模式，正在启动...
echo   地址：http://localhost:5173
echo   关闭本窗口即可停止服务。
echo  ================================================
echo.
start "" cmd /c "timeout /t 3 >nul & start http://localhost:5173"
call npm run dev
pause
