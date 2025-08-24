#!/usr/bin/env python3

import os
import shutil
import stat
import sys
import re

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


def copy_uninstall_files():
    uninstall_file = 'winUninstall.exe'
    proxy_file = os.path.join(PKG_PATH, 'proxy.exe')
    startup_dir = os.path.join(os.environ['APPDATA'], r'Microsoft\Windows\Start Menu\Programs\Startup')
    source_path = os.path.join(PKG_PATH, uninstall_file)
    target_path = os.path.join(ADDON_PATH, uninstall_file)

    if not os.path.exists(source_path):
        print(f'Uninstall file {source_path} does not exist.')
        return

    print(f'Copying {uninstall_file} to {target_path}')
    try:
        shutil.copy(source_path, target_path)
        print(f'Successfully copied {uninstall_file}')
        shutil.copy(proxy_file, startup_dir)
        print(f'Successfully copied proxy.exe')
    except Exception as e:
        print(f'Failed to copy uninstall files: {e}')

# 修改后的register函数，添加了编码处理
def register(fp, tagname, record):
    try:
        # 尝试使用UTF-8编码读取
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        # 如果UTF-8失败，尝试使用GBK编码
        try:
            with open(fp, 'r', encoding='gbk') as f:
                content = f.read()
        except UnicodeDecodeError:
            # 如果两种编码都失败，尝试使用Latin-1（不会抛出解码错误）
            with open(fp, 'r', encoding='latin-1') as f:
                content = f.read()
    
    pos = [m.end() for m in re.finditer(r'<' + tagname + r'>\s*', content)]
    if len(pos) == 0:
        content += f'<{tagname}></{tagname}>'
        pos = [content.index(f'</{tagname}>')]
    i = pos[0]
    
    # 使用UTF-8编码写入文件
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content[:i] + record + os.linesep + content[i:])

# Main execution
print('Uninstalling previous installations...')
if len(sys.argv) > 1 and sys.argv[1] == '-u':
    sys.exit()

print('Installing')
os.makedirs(ADDON_PATH, exist_ok=True)

if not os.path.exists(XML_PATHS['publish']):
    # 创建文件时明确指定UTF-8编码
    with open(XML_PATHS['publish'], 'w', encoding='utf-8') as f:
        f.write('''<?xml version="1.0" encoding="UTF-8"?>
<jsplugins>
</jsplugins>
''')

copy_uninstall_files()
target_dir = os.path.join(ADDON_PATH, APPNAME)
# 如果目标目录已存在，则先删除它
if os.path.exists(target_dir):
    print(f'Target directory {target_dir} already exists. Removing it first...')
    shutil.rmtree(target_dir) # 递归删除整个目录
shutil.copytree(PKG_PATH, target_dir)

rec = '<jsplugin url="http://127.0.0.1:3889/" type="wps" enable="enable_dev" install="null" version="1.0.0" name="wps-zotero"/>'
register(XML_PATHS['publish'], 'jsplugins', rec)

# Windows specific configurations
print('Change zotero preference to alleviate problem of Zotero window not showing in front.')
print('All done, enjoy!')
if sys.platform.startswith('win'):  # 检查是否为Windows系统
    import msvcrt
    print("\n安装完成！请按任意键或关闭此窗口。Installation is complete. Please press any key to exit.")
    msvcrt.getch()