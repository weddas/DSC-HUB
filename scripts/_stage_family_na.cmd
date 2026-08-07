@echo off
setlocal
cd /d "%~dp0\.."
set PYTHONUNBUFFERED=1
for /L %%i in (1,1,3) do (
  echo RELAUNCH %%i>> brain\data\_na_direct_merge.log
  python -u scripts\_stage_family_na.py >> brain\data\_na_direct_stdout.txt 2>&1
  if not errorlevel 1 goto ok
  echo EXIT %%i errorlevel %ERRORLEVEL%>> brain\data\_na_direct_merge.log
  timeout /t 20 /nobreak >nul
)
exit /b 1
:ok
exit /b 0
