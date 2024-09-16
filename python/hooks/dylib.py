import os
import sys

def get_lib_path():
    if getattr(sys, 'frozen', False):
        # If the application is frozen, libraries are relative to the executable
        return os.path.join(sys._MEIPASS, 'lib')
    return ''

lib_path = get_lib_path()
if lib_path:
    os.environ['DYLD_LIBRARY_PATH'] = lib_path + ':' + os.environ.get('DYLD_LIBRARY_PATH', '')
