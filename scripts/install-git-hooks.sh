#!/bin/bash
# 一次性脚本：把 .githooks/ 安装到 .git/hooks/
# 用法：bash scripts/install-git-hooks.sh

set -e
cd "$(dirname "$0")/.."

chmod +x .githooks/*
git config core.hooksPath .githooks
echo "✅ Git hooks 已安装到 .githooks/"
echo ""
echo "测试：bash .githooks/pre-commit"
echo "卸载：git config --unset core.hooksPath"
