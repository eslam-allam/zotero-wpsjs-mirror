#!/usr/bin/env python3

import os
import platform
import shutil
import sys
import re
import stat
import subprocess 
from proxy import stop_proxy


# Prevent running as root on Linux
if platform.system() == 'Linux' and os.environ['USER'] == 'root':
    print("This addon cannot be installed as root!", file=sys.stderr)
    sys.exit(1)


# Check whether Python 3 is in PATH
def checkpy():
    def runcmd(cmd):
        p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
        code = p.wait()
        res = [line.decode() for line in p.stdout.readlines()]
        return code, res

    if platform.system() == 'Windows':
        cmd = 'where python'
    else:
        cmd = 'which python'
    _, pyexes = runcmd(cmd)
    ver = None
    if len(pyexes) > 0:
        _, res = runcmd('{} --version'.format(pyexes[0].strip()))
        if len(res) > 0 and res[0].startswith('Python 3'):
            ver = res[0]
    if ver is None:
        print('Please add Python 3 to the PATH environment variable!')
    else:
        print('Python in PATH:', ver)
    return ver
        
if platform.system() == 'Windows':
    checkpy()


# File & directory paths
# 检测操作系统并设置相应的插件路径
if getattr(sys, 'frozen', False):
    # 如果是打包后的exe文件
    PKG_PATH = os.path.dirname(sys.executable)
else:
    # 如果是普通Python脚本
    PKG_PATH = os.path.dirname(os.path.abspath(__file__))

APPNAME = 'wps-zotero_1.0.0'
if platform.system() == 'Darwin':  # macOS
    ADDON_PATH = os.path.expanduser('~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons')
elif platform.system() == 'Linux':  # Linux
    ADDON_PATH = os.path.join(os.environ['HOME'], '.local/share/Kingsoft/wps/jsaddons')
else:  # Windows
    ADDON_PATH = os.path.join(os.environ['APPDATA'], 'kingsoft', 'wps', 'jsaddons')

# 定义 XML 文件路径
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
        if os.path.isdir(ADDON_PATH + os.path.sep + x) and 'wps-zotero' in x:
            print('Removing {}'.format(ADDON_PATH + os.path.sep + x))
            shutil.rmtree(ADDON_PATH + os.path.sep + x, onerror=del_rw)

    for fp in XML_PATHS.values():
        if not os.path.isfile(fp):
            continue
        with open(fp) as f:
            xmlStr = f.read()
        records = [(m.start(),m.end()) for m in re.finditer(r'[\ \t]*<.*wps-zotero.*/>\s*', xmlStr)]
        for r in records:
            print('Removing record from {}'.format(fp))
            with open(fp, 'w') as f:
                f.write(xmlStr[:r[0]] + xmlStr[r[1]:])


# Uninstall existing installation
print('Uninstalling previous installations if there is any ...')
uninstall()
if len(sys.argv) > 1 and sys.argv[1] == '-u':
    sys.exit()


# Begin installation
print('Installing')


# Create necessary directory and files
if not os.path.exists(ADDON_PATH):
    os.makedirs(ADDON_PATH, exist_ok=True)
if not os.path.exists(XML_PATHS['publish']):
    with open(XML_PATHS['publish'], 'w') as f:
        f.write('''<?xml version="1.0" encoding="UTF-8"?>
<jsplugins>
</jsplugins>
''')



# Copy to jsaddons
shutil.copytree(PKG_PATH, ADDON_PATH + os.path.sep + APPNAME)


# Write records to XML files
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


# Alleviate the "Zotero window not brought to front" problem.
# https://www.zotero.org/support/kb/addcitationdialog_raised
if os.name == 'nt':
    print('Change zotero preference to alleviate the problem of Zotero window not showing in front.')
    tmp = os.environ['APPDATA'] + '\\Zotero\\Zotero\\Profiles\\'
    for fn in os.listdir(tmp):
        if os.path.isdir(fn) and tmp.endswith('.default') and os.path.isfile(fn + '\\prefs.js'):
            pref_fn = fn + '\\prefs.js'
            with open(pref_fn) as f:
                content = f.read()
            if 'extensions.zotero.integration.keepAddCitationDialogRaised' in content:
                content = content.replace('user_pref("extensions.zotero.integration.keepAddCitationDialogRaised", false)', 'user_pref("extensions.zotero.integration.keepAddCitationDialogRaised", true);')
            else:
                content += '\nuser_pref("extensions.zotero.integration.keepAddCitationDialogRaised", true);\n'
            with open(pref_fn, 'w') as f:
                f.write(content)



print('All done, enjoy!')
print('(run ./install.py -u to uninstall  or  python3 install.py -u to uninstall)\n卸载请执行 run ./install.py -u to uninstall  或  python3 install.py -u to uninstall')
# 在macOS上，安装完成后打开Zotero和WPS
if platform.system() == 'Darwin':  # macOS
    try:
        
        # 授权proxy
        app_path = '~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons/wps-zotero_1.0.0/proxy.app'

        # 使用 os.path.expanduser 展开 '~' 到完整路径
        expanded_app_path = os.path.expanduser(app_path)

        # 使用 subprocess.run 打开应用程序
        subprocess.run(['open', expanded_app_path])

        # 打开Zotero
        subprocess.run(['open', '-a', 'Zotero'])
        

        # 打开WPS
        subprocess.run(['open', '-a', 'wpsoffice'])
        


        
    except Exception as e:
        print(f"无法打开应用程序: {e}")