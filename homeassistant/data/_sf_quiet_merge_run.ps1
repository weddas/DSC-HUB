$ErrorActionPreference='Stop'
Write-Host 'copying seedfinder staging to local SSD...'
Copy-Item 'y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\staging\seedfinder.sqlite3' 'C:\DSC\collation\staging\seedfinder.sqlite3' -Force
Write-Host 'copy done; merging --only seedfinder --no-link --no-search'
& python -u 'y:\Digital Stealth Care\Projects\DSC-HUB\scripts\merge_staging_to_master.py' --master 'C:\DSC\collation\dsc_brain.sqlite3' --staging-dir 'C:\DSC\collation\staging' --only seedfinder --no-link --no-search
Write-Host ('merge exit ' + $LASTEXITCODE)
