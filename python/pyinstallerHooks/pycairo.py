from PyInstaller.utils.hooks import collect_dynamic_libs

# Collect all dynamic libraries for cairo
binaries = collect_dynamic_libs('cairocffi')
