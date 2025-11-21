#!/usr/bin/env python3

import os
import platform
import shutil
import sys
import re
import stat
import subprocess
import shutil


# Prevent running as root on Linux
if platform.system() == 'Linux' and os.environ['USER'] == 'root':
    print("This addon cannot be installed as root!", file=sys.stderr)
    sys.exit(1)

def main():
    # Step 1: 检查并打开 macUninstall.app
    if platform.system() == 'Darwin':  # macOS
        script_dir = os.path.dirname(os.path.abspath(__file__))
        mac_uninstall_app_path = os.path.join(script_dir, 'macUninstall.app')

        if os.path.isdir(mac_uninstall_app_path):  # 确保路径是一个目录
            print(f"Found {mac_uninstall_app_path}. Granting execute permission...")

            # 获取当前权限并添加执行权限
            try:
                current_mode = os.stat(mac_uninstall_app_path).st_mode
                os.chmod(mac_uninstall_app_path, current_mode | stat.S_IEXEC)
                print(f"Execute permission granted to {mac_uninstall_app_path}.")
            except Exception as e:
                print(f"Failed to grant execute permission: {e}")

            # 打开 macUninstall.app
            print(f"Opening {mac_uninstall_app_path}...")
            try:
                subprocess.run(['open', mac_uninstall_app_path], check=True)
            except subprocess.CalledProcessError as e:
                print(f"Failed to open {mac_uninstall_app_path}: {e}")
        else:
            print("macUninstall.app not found in the script directory.")

# File & directory paths
# 检测操作系统并设置相应的插件路径
if getattr(sys, 'frozen', False):
    # 如果是打包后的exe文件
    PKG_PATH = os.path.dirname(sys.executable)
else:
    # 如果是普通Python脚本
    PKG_PATH = os.path.dirname(os.path.abspath(__file__))

APPNAME = 'Zotero-Jsa_1.0.0'
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



def uninstall():
    print("Trying to quit proxy server if it's currently listening...")
   
    
    def del_rw(action, name, exc):
        os.chmod(name, stat.S_IWRITE)
        os.remove(name)

    if not os.path.isdir(ADDON_PATH):
        return

    for x in os.listdir(ADDON_PATH):
        if os.path.isdir(ADDON_PATH + os.path.sep + x) and 'Zotero-Jsa' in x:
            print('Removing {}'.format(ADDON_PATH + os.path.sep + x))
            shutil.rmtree(ADDON_PATH + os.path.sep + x, onerror=del_rw)

    for fp in XML_PATHS.values():
        if not os.path.isfile(fp):
            continue
        with open(fp) as f:
            xmlStr = f.read()
        records = [(m.start(),m.end()) for m in re.finditer(r'[\ \t]*<.*Zotero-Jsa.*/>\s*', xmlStr)]
        for r in records:
            print('Removing record from {}'.format(fp))
            with open(fp, 'w') as f:
                f.write(xmlStr[:r[0]] + xmlStr[r[1]:])

# Copy uninstall files to ADDON_PATH
def copy_uninstall_files():
    uninstall_files = {
        'Windows': 'winUninstall.exe',
        'Darwin': 'macUninstallJsa.app',  # macOS 卸载文件
        'Linux': 'linuxUninstall.py'
    }
    system = platform.system()
    uninstall_file = uninstall_files.get(system)

    if not uninstall_file:
        print(f'No uninstall file defined for {system}')
        return

    source_path = os.path.join(PKG_PATH, uninstall_file)
    target_path = os.path.join(ADDON_PATH, uninstall_file)

    if not os.path.exists(source_path):
        print(f'Uninstall file {source_path} does not exist.')
        return

    print(f'Copying {uninstall_file} to {target_path}')

    try:
        if system == 'Darwin':  # macOS 处理逻辑
            # 如果目标路径已存在，则删除它
            if os.path.exists(target_path):
                shutil.rmtree(target_path)  # 删除已有目录以避免冲突
            
            # 使用 copytree 复制整个目录
            shutil.copytree(source_path, target_path)
        else:  # 其他系统（如 Windows 和 Linux）
            shutil.copy(source_path, target_path)

        print(f'Successfully copied {uninstall_file} to {target_path}')
    except Exception as e:
        print(f'Failed to copy uninstall files: {e}')
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

# Copy uninstall files
copy_uninstall_files()

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


rec = '<jsplugin url="http://127.0.0.1:3889/" type="wps" enable="enable_dev" install="null" version="1.0.0" name="Zotero-Jsa"/>'
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
