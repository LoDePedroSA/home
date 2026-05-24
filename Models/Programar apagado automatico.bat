@echo off
setlocal enabledelayedexpansion

:: =============================
:: 1 y 2 - Pedir tiempo válido
:: =============================
:pedirTiempo
set "tiempo="
set /p tiempo=¿En cuanto se apaga el equipo?: 

echo %tiempo%| findstr /r "^[0-9][0-9]*$" >nul
if errorlevel 1 (
    echo Entrada invalida. Solo numeros.
    goto pedirTiempo
)

:: =============================
:: 3 - Elegir unidad
:: =============================
:pedirUnidad
echo ==============================
echo Seleccione una opcion dependiendo de tiempo que ingreso:
echo 1. Minutos.
echo 2. Horas.
echo 3. Dias.
echo ==============================
set "opcion="
set /p opcion=Ingrese la opcion final: 

if "%opcion%" neq "1" if "%opcion%" neq "2" if "%opcion%" neq "3" (
    echo Opcion invalida.
    goto pedirUnidad
)

:: Convertir a segundos
if "%opcion%"=="1" set /a totalSegundos=tiempo*60
if "%opcion%"=="2" set /a totalSegundos=tiempo*3600
if "%opcion%"=="3" set /a totalSegundos=tiempo*86400

echo --------------- DATOS COMPLETADOS EXITOSAMENTE ---------------

:: Programar apagado
shutdown /s /t %totalSegundos%

echo.
echo Presiona C en cualquier momento para cancelar el apagado.
echo.

:: =============================
:: Barra fluida + tiempo real
:: =============================
set /a inicio=%time:~0,2%*3600 + %time:~3,2%*60 + %time:~6,2%

:loop
:: Tiempo actual en segundos
set /a ahora=%time:~0,2%*3600 + %time:~3,2%*60 + %time:~6,2%

:: Manejo de cambio de día
if %ahora% lss %inicio% set /a ahora+=86400

set /a transcurrido=ahora-inicio
set /a restante=totalSegundos-transcurrido

if %restante% lss 0 set restante=0

:: Porcentaje
set /a progreso=(transcurrido*100)/totalSegundos
if %progreso% gtr 100 set progreso=100

:: Construir barra (100 caracteres)
set "barra="
for /l %%i in (1,1,%progreso%) do set "barra=!barra!="
for /l %%i in (%progreso%,1,99) do set "barra=!barra!-"

:: Convertir tiempo restante a h:m:s
set /a h=restante/3600
set /a m=(restante%%3600)/60
set /a s=restante%%60

cls
echo [!barra!] %progreso%%%/100%%
echo Tiempo restante: !h!h !m!m !s!s

:: Detectar tecla C sin bloquear
choice /c SC /n /t 1 /d S >nul
if errorlevel 2 (
    shutdown /a
    echo Apagado cancelado.
    pause
    exit
)

if %progreso% geq 100 goto fin
goto loop

:fin
echo Apagando...