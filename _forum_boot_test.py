open('_forum_boot.txt','w').write('alive')
print('alive', flush=True)
import pathlib
open('_forum_boot.txt','a').write('\\n'+str(pathlib.Path(__file__).resolve()))
print('resolved', flush=True)
