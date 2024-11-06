#!/bin/bash
# 获取当前脚本所在目录
DIR=$(dirname "$(readlink -f "$0")")
# 进入该目录
cd "$DIR"
# 运行 hello.py
python3 proxy.py