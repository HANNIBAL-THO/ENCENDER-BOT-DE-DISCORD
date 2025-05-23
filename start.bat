@echo off
cls
color 0a
chcp 65001 >nul

echo.
echo    ████████╗██╗  ██╗ ██████╗ 
echo    ╚══██╔══╝██║  ██║██╔═══██╗
echo       ██║   ███████║██║   ██║
echo       ██║   ██╔══██║██║   ██║
echo       ██║   ██║  ██║╚██████╔╝
echo       ╚═╝   ╚═╝  ╚═╝ ╚═════╝ 
echo.
echo  =============================================
echo     Discord: https://discord.gg/tfRuSC52Da
echo  =============================================
echo.

echo Verificando dependencias...

REM Comprobar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js no encontrado. Instalando...
    curl -o node-installer.msi https://nodejs.org/dist/v18.16.1/node-v18.16.1-x64.msi
    start /wait node-installer.msi /quiet
    del node-installer.msi
) else (
    echo [✓] Node.js ya está instalado
)

REM Comprobar npm
call npm --version >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] npm no encontrado. Instalando...
    call npm install -g npm@latest
) else (
    echo [✓] npm ya está instalado
)

REM Comprobar node_modules
if not exist "node_modules" (
    echo [!] Dependencias del proyecto no encontradas. Instalando...
    echo [                    ] 0%%
    timeout /t 1 > nul
    echo [=====               ] 25%%
    call npm install discord.js @discordjs/voice @discordjs/opus sodium --silent
    echo [==========          ] 50%%
    timeout /t 1 > nul
    call npm install ffmpeg-static --silent
    echo [===============     ] 75%%
    timeout /t 1 > nul
    call npm install --silent
    echo [====================] 100%%
    echo [✓] Instalación completada!
) else (
    echo [✓] Dependencias del proyecto ya instaladas
)

echo.
echo Todas las comprobaciones completadas. Iniciando bot...
echo.
node index.js
pause
