@echo off
cd /d "y:\Digital Stealth Care\Projects\DSC-HUB"
REM Prefer resume (skip OK + --no-link + end-link). For NAS hangs use _n087_local_ssd_merge.py instead.
"C:\Program Files\Python314\python.exe" -u "brain\data\_n087_exclusive_merge_resume.py" >> "brain\data\_n087_exclusive_merge_stdout.txt" 2>> "brain\data\_n087_exclusive_merge_stderr.txt"
