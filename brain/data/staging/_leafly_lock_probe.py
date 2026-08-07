import sqlite3,sys
p=r'y:/Digital Stealth Care/Projects/DSC-HUB/brain/data/dsc_brain.sqlite3'
c=sqlite3.connect(p, timeout=1.0)
c.execute('PRAGMA busy_timeout=1000')
c.execute('BEGIN IMMEDIATE')
c.execute('SELECT 1')
c.execute('COMMIT')
c.close()
print('OK')
