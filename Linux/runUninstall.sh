#!/bin/bash
# 获取当前脚本所在目录
DIR=$(dirname "$(readlink -f "$0")")
# 进入该目录
cd "$DIR"
# 卸载脚本执行
python3 uninstall.py
