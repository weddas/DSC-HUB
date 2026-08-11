@echo off
cd /d "y:\Digital Stealth Care\Projects\DSC-HUB"
set OUT=homeassistant\data\_pw_strain_db_capture_20260809_resume2.out
set ERR=homeassistant\data\_pw_strain_db_capture_20260809_resume2.err
"C:\Program Files\Python314\python.exe" -u scripts\_pw_strain_db_capture.py --wait=240 >"%OUT%" 2>"%ERR%"
echo EXIT=%ERRORLEVEL%>>"%OUT%"
