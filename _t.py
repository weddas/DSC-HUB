print('a', flush=True)
from pathlib import Path
print('b', Path('.').resolve(), flush=True)
