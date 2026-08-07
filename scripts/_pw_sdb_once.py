
import os, sys
from pathlib import Path
os.environ['DSC_SDB_UD'] = r"C:\Users\cmgwe\AppData\Local\Temp\dsc-chrome-sdb-r1"
sys.path.insert(0, str(Path(__file__).resolve().parent))
# monkeypatch before import of main module constants — import script as module
import importlib.util
spec = importlib.util.spec_from_file_location('pw', Path(__file__).resolve().parent / '_pw_scrape_strain_database.py')
mod = importlib.util.module_from_spec(spec)
# set USER_DATA before exec
import types
# Load source and replace USER_DATA line
src = (Path(__file__).resolve().parent / '_pw_scrape_strain_database.py').read_text(encoding='utf-8')
ud = os.environ['DSC_SDB_UD']
src2 = []
for line in src.splitlines(True):
    if line.startswith('USER_DATA = '):
        src2.append(f'USER_DATA = Path(r"{ud}")\n')
    else:
        src2.append(line)
code = compile(''.join(src2), '_pw_scrape_strain_database.py', 'exec')
g = {'__name__': '__main__', '__file__': str(Path(__file__).resolve().parent / '_pw_scrape_strain_database.py')}
exec(code, g)
