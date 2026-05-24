@echo off
setlocal enabledelayedexpansion
:: ==========================================
:: Script de Limpieza y Mantenimiento de Windows
:: ==========================================

:: VARIABLES PARA TRACKING DE TAMAÑO
set "totalSize=0"

:: 1. Permisos de Administrador
echo Elevando permisos de administrador...
fsutil dirty query %systemdrive% >nul
if %errorlevel% neq 0 (
    echo Se requieren permisos de administrador para ejecutar este script.
    echo Cierre este mensaje y ejecute como Administrador.
    pause
    exit /b
)

echo ✓ Permisos de administrador confirmados.
echo.

:: 2. Limpieza automática de archivos basura del sistema (incluye instalaciones/actualizaciones previas)
echo Paso 2: Limpiando archivos de actualizaciones y del sistema...
for /f %%A in ('powershell -NoProfile -Command "if(Test-Path 'C:\Windows\Temp'){[int64]((Get-ChildItem -Path 'C:\Windows\Temp' -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum)}else{0}"') do set "size2=%%A"
cleanmgr /autoclean
set /a totalSize+=!size2!
echo   Tamaño liberado: !size2! bytes
echo.

:: 3. Limpieza de las carpetas Temp y Prefetch de Windows
echo Paso 3: Eliminando archivos temporales del sistema...
cd /d C:\
for /f %%A in ('powershell -NoProfile -Command "[int64]((Get-ChildItem -Path 'C:\Windows\Temp' -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum)"') do set "size3=%%A"
del /q /s /f C:\Windows\Temp\*.* 2>nul
rd /s /q C:\Windows\Temp 2>nul
mkdir C:\Windows\Temp

for /f %%A in ('powershell -NoProfile -Command "[int64]((Get-ChildItem -Path 'C:\Windows\Prefetch' -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum)"') do set "size3b=%%A"
del /q /s /f C:\Windows\Prefetch\*.* 2>nul
rd /s /q C:\Windows\Prefetch 2>nul
mkdir C:\Windows\Prefetch

set /a size3+=!size3b!
set /a totalSize+=!size3!
echo   Tamaño liberado: !size3! bytes
echo.

:: 4. Limpieza de archivos temporales del usuario actual
echo Paso 4: Eliminando archivos temporales del usuario...
for /f %%A in ('powershell -NoProfile -Command "[int64]((Get-ChildItem -Path '%USERPROFILE%\AppData\Local\Temp' -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum)"') do set "size4=%%A"
del /q /s /f "%USERPROFILE%\AppData\Local\Temp\*.*" 2>nul
rd /s /q "%USERPROFILE%\AppData\Local\Temp" 2>nul
mkdir "%USERPROFILE%\AppData\Local\Temp"
set /a totalSize+=!size4!
echo   Tamaño liberado: !size4! bytes
echo.

:: 5. Limpieza de la papelera de reciclaje
echo Paso 5: Vaciando la papelera de reciclaje...
for /f %%A in ('powershell -NoProfile -Command "[int64]((Get-ChildItem -Path 'C:\$Recycle.bin' -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum)"') do set "size5=%%A"
rd /s /q C:\$Recycle.bin 2>nul
set /a totalSize+=!size5!
echo   Tamaño liberado: !size5! bytes
echo.

:: MOSTRAR RESUMEN FINAL
cls
echo ==========================================
echo ¡Limpieza completada con éxito!
echo ==========================================
echo.
echo RESUMEN DE LIBERACIÓN DE ESPACIO:
echo Paso 2 ^(Actualizaciones del sistema^): !size2! bytes
echo Paso 3 ^(Archivos Temp del sistema^): !size3! bytes
echo Paso 4 ^(Archivos Temp del usuario^): !size4! bytes
echo Paso 5 ^(Papelera de reciclaje^): !size5! bytes
echo.
echo ==========================================
echo TAMAÑO TOTAL LIBERADO: !totalSize! bytes
echo ==========================================

:: Convertir a MB para mejor legibilidad
for /f %%A in ('powershell -NoProfile -Command "[math]::Round(!totalSize!/1048576, 2)"') do set "sizeMB=%%A"
echo Aproximadamente: !sizeMB! MB
echo.

timeout /t 10 >nul
exit /b
