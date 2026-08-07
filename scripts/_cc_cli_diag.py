import faulthandler, sys
faulthandler.enable()
sys.path.insert(0, "brain")
print("about to exec merge CLI", flush=True)
import runpy
try:
    sys.argv = ["merge_staging_to_master.py", "--only", "cannaconnection", "--no-search", "--no-link"]
    runpy.run_path("scripts/merge_staging_to_master.py", run_name="__main__")
except BaseException as e:
    print("caught", type(e), e, flush=True)
    raise
