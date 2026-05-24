@echo off
title Descargador con aria2c
cls

echo ========================================
echo      DESCARGADOR DE ARCHIVOS (aria2c)
echo ========================================
echo.

REM Solicitar la URL al usuario
set /p "url=1. Ingrese la URL del archivo a descargar: "
echo.

REM Mostrar opciones de ubicacion
echo 2. Seleccione la ubicacion de descarga:
echo    [1] Escritorio
echo    [2] Descargas
echo    [3] Documentos
echo.

set /p "opcion=Opcion (1, 2 o 3): "

REM Determinar la carpeta segun la opcion
if "%opcion%"=="1" (
    set "destino=%USERPROFILE%\Desktop"
) else if "%opcion%"=="2" (
    set "destino=%USERPROFILE%\Downloads"
) else if "%opcion%"=="3" (
    set "destino=%USERPROFILE%\Documents"
) else (
    echo Opcion no valida. Usando Escritorio por defecto.
    set "destino=%USERPROFILE%\Desktop"
)

echo.
echo Descargando...
echo URL: %url%
echo Destino: %destino%
echo.

REM Verificar si aria2c.exe existe
if not exist "aria2c.exe" (
    echo ERROR: No se encuentra aria2c.exe en la misma carpeta que el .bat
    echo Presione cualquier tecla para salir...
    pause > nul
    exit /b 1
)

REM Ejecutar aria2c para descargar
aria2c.exe -x 16 -s 16 -d "%destino%" "%url%"

echo.
echo Descarga finalizada.
echo.
pause