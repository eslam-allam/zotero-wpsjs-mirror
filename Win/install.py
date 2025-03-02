#!/usr/bin/env python3

import os
import shutil
import stat
import sys
import re
from proxy import stop_proxy

# File & directory paths
if getattr(sys, 'frozen', False):
    PKG_PATH = os.path.dirname(sys.executable)
else:
    PKG_PATH = os.path.dirname(os.path.abspath(__file__))

APPNAME = 'wps-zotero_1.0.0'
ADDON_PATH = os.path.join(os.environ['APPDATA'], 'kingsoft', 'wps', 'jsaddons')
XML_PATHS = {
    'publish': os.path.join(ADDON_PATH, 'publish.xml'),
}
PROXY_PATH = ADDON_PATH + os.path.sep + 'proxy.py'

def uninstall():
    print("Trying to quit proxy server if it's currently listening...")
    stop_proxy()
    
    def del_rw(action, name, exc):
        os.chmod(name, stat.S_IWRITE)
        os.remove(name)

    if not os.path.isdir(ADDON_PATH):
        return

    for x in os.listdir(ADDON_PATH):
        if os.path.isdir(os.path.join(ADDON_PATH, x)) and 'wps-zotero' in x:
            print(f'Removing {os.path.join(ADDON_PATH, x)}')
            shutil.rmtree(os.path.join(ADDON_PATH, x), onerror=del_rw)

    for fp in XML_PATHS.values():
        if not os.path.isfile(fp):
            continue
        with open(fp) as f:
            xmlStr = f.read()
        records = [(m.start(), m.end()) for m in re.finditer(r'[\ \t]*<.*wps-zotero.*/>\s*', xmlStr)]
        for r in records:
            print(f'Removing record from {fp}')
            with open(fp, 'w') as f:
                f.write(xmlStr[:r[0]] + xmlStr[r[1]:])

def copy_uninstall_files():
    uninstall_file = 'winUninstall.exe'
    source_path = os.path.join(PKG_PATH, uninstall_file)
    target_path = os.path.join(ADDON_PATH, uninstall_file)

    if not os.path.exists(source_path):
        print(f'Uninstall file {source_path} does not exist.')
        return

    print(f'Copying {uninstall_file} to {target_path}')
    try:
        shutil.copy(source_path, target_path)
        print(f'Successfully copied {uninstall_file}')
    except Exception as e:
        print(f'Failed to copy uninstall files: {e}')

# Main execution
print('Uninstalling previous installations...')
uninstall()
if len(sys.argv) > 1 and sys.argv[1] == '-u':
    sys.exit()

print('Installing')
os.makedirs(ADDON_PATH, exist_ok=True)

if not os.path.exists(XML_PATHS['publish']):
    with open(XML_PATHS['publish'], 'w') as f:
        f.write('''<?xml version="1.0" encoding="UTF-8"?>
<jsplugins>
</jsplugins>
''')

copy_uninstall_files()
shutil.copytree(PKG_PATH, os.path.join(ADDON_PATH, APPNAME))

def register(fp, tagname, record):
    with open(fp) as f:
        content = f.read()
    pos = [m.end() for m in re.finditer(r'<' + tagname + r'>\s*', content)]
    if len(pos) == 0:
        content += f'<{tagname}></{tagname}>'
        pos = [content.index(f'</{tagname}>')]
    i = pos[0]
    with open(fp, 'w') as f:
        f.write(content[:i] + record + os.linesep + content[i:])

rec = '<jsplugin url="http://127.0.0.1:3889/" type="wps" enable="enable_dev" install="null" version="1.0.0" name="wps-zotero"/>'
register(XML_PATHS['publish'], 'jsplugins', rec)

# Windows specific configurations
print('Change zotero preference to alleviate problem of Zotero window not showing in front.')
tmp = os.environ['APPDATA'] + '\\Zotero\\Zotero\\Profiles\\'
for fn in os.listdir(tmp):
    profile_path = os.path.join(tmp, fn)
    if os.path.isdir(profile_path) and fn.endswith('.default'):
        pref_fn = os.path.join(profile_path, 'prefs.js')
        if os.path.isfile(pref_fn):
            with open(pref_fn) as f:
                content = f.read()
            if 'extensions.zotero.integration.keepAddCitationDialogRaised' in content:
                content = content.replace(
                    'user_pref("extensions.zotero.integration.keepAddCitationDialogRaised", false)',
                    'user_pref("extensions.zotero.integration.keepAddCitationDialogRaised", true);'
                )
            else:
                content += '\nuser_pref("extensions.zotero.integration.keepAddCitationDialogRaised", true);\n'
            with open(pref_fn, 'w') as f:
                f.write(content)

print('All done, enjoy!')
print('(run ./install.py -u to uninstall  or  python3 install.py -u to uninstall)\n卸载请执行 run ./install.py -u to uninstall  或  python3 install.py -u to uninstall')
if sys.platform.startswith('win'):  # 检查是否为Windows系统
    print("\n安装完成！请按回车键或关闭此窗口。Installation is complete. Please close this terminal window manually when you are ready.")
    input("Press Enter to exit...")  # 等待用户按下Enter键