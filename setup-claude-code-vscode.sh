#!/bin/bash
#
# 配置 Claude Code for VS Code 扩展使用 claude-internal
# 适用于 Linux / macOS（通过 Remote-SSH 或本地使用）
# 支持: VS Code / VS Code Server / CodeBuddy IDE
#
set -e

echo "=== Claude Code for VS Code + claude-internal 配置脚本 ==="
echo ""

# ---- 1. 检查 Node.js ----
if ! command -v node &>/dev/null; then
    echo "[ERROR] 未检测到 Node.js，请先安装 Node.js >= 20"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash"
    echo "  source ~/.bashrc && nvm install 20"
    exit 1
fi

NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VER" -lt 20 ]; then
    echo "[ERROR] Node.js 版本过低 ($(node -v))，需要 >= 20"
    exit 1
fi
echo "[OK] Node.js $(node -v)"

# ---- 2. 安装/更新 claude-internal ----
echo ""
echo ">>> 配置 npm 全局路径 ..."
NPM_PREFIX="$HOME/.npm-global"
mkdir -p "$NPM_PREFIX"
npm config set prefix "$NPM_PREFIX"
export PATH="$NPM_PREFIX/bin:$PATH"
echo "[OK] npm 全局路径: $NPM_PREFIX"

echo ">>> 安装/更新 claude-internal ..."
npm install -g --registry=https://mirrors.tencent.com/npm @tencent/claude-code-internal
echo "[OK] claude-internal 已安装: $(claude-internal -v 2>/dev/null || echo '版本获取失败')"

# ---- 3. 获取 claude-internal 路径 ----
CLAUDE_INTERNAL_PATH=$(which claude-internal)
echo "[OK] claude-internal 路径: $CLAUDE_INTERNAL_PATH"

# ---- 4. 处理 ~/.claude 符号链接 ----
echo ""
echo ">>> 处理 ~/.claude 目录 ..."
if [ -L "$HOME/.claude" ]; then
    echo "[OK] ~/.claude 已经是符号链接 -> $(readlink "$HOME/.claude")"
elif [ -d "$HOME/.claude" ]; then
    BACKUP="$HOME/.claude.bak.$(date +%Y%m%d%H%M%S)"
    echo "[INFO] 备份现有 ~/.claude -> $BACKUP"
    mv "$HOME/.claude" "$BACKUP"
    ln -s "$HOME/.claude-internal" "$HOME/.claude"
    echo "[OK] 已创建符号链接 ~/.claude -> ~/.claude-internal"
elif [ ! -e "$HOME/.claude" ]; then
    mkdir -p "$HOME/.claude-internal"
    ln -s "$HOME/.claude-internal" "$HOME/.claude"
    echo "[OK] 已创建符号链接 ~/.claude -> ~/.claude-internal"
else
    echo "[WARN] ~/.claude 存在但不是目录，请手动处理"
fi

# ---- 5. 创建全局 claude 命令指向 claude-internal ----
echo ""
echo ">>> 创建全局 claude 命令 ..."
if [ -w /usr/local/bin ]; then
    ln -sf "$CLAUDE_INTERNAL_PATH" /usr/local/bin/claude
    echo "[OK] /usr/local/bin/claude -> $CLAUDE_INTERNAL_PATH"
fi
# 也覆盖 ~/.local/bin/claude（如果存在旧的官方 claude）
if [ -e "$HOME/.local/bin/claude" ]; then
    mv "$HOME/.local/bin/claude" "$HOME/.local/bin/claude-official-backup" 2>/dev/null || true
    ln -sf "$CLAUDE_INTERNAL_PATH" "$HOME/.local/bin/claude"
    echo "[OK] ~/.local/bin/claude -> $CLAUDE_INTERNAL_PATH (已备份原文件)"
fi

# ---- 6. 配置 settings.json ----
echo ""
echo ">>> 配置 IDE settings.json ..."

configure_settings() {
    local SETTINGS_FILE="$1"
    local LABEL="$2"

    if [ ! -f "$SETTINGS_FILE" ]; then
        echo "[INFO] $LABEL 不存在，创建新文件"
        mkdir -p "$(dirname "$SETTINGS_FILE")"
        cat > "$SETTINGS_FILE" <<EOJSON
{
    "claudeCode.claudeProcessWrapper": "$CLAUDE_INTERNAL_PATH",
    "claudeCode.disableLoginPrompt": true
}
EOJSON
        echo "[OK] $LABEL 已创建"
        return
    fi

    python3 -c "
import json
with open('$SETTINGS_FILE', 'r') as f:
    s = json.load(f)
s['claudeCode.claudeProcessWrapper'] = '$CLAUDE_INTERNAL_PATH'
s['claudeCode.disableLoginPrompt'] = True
with open('$SETTINGS_FILE', 'w') as f:
    json.dump(s, f, indent=4, ensure_ascii=False)
print('[OK] $LABEL 已更新')
"
}

# macOS 本地
if [ "$(uname)" = "Darwin" ]; then
    VSCODE_SETTINGS="$HOME/Library/Application Support/Code/User/settings.json"
    if [ -f "$VSCODE_SETTINGS" ]; then
        configure_settings "$VSCODE_SETTINGS" "macOS VS Code settings.json"
    fi
fi

# Linux 本地
VSCODE_SETTINGS_LINUX="$HOME/.config/Code/User/settings.json"
if [ -f "$VSCODE_SETTINGS_LINUX" ]; then
    configure_settings "$VSCODE_SETTINGS_LINUX" "Linux VS Code settings.json"
fi

# VS Code Server (Remote-SSH)
if [ -d "$HOME/.vscode-server" ]; then
    configure_settings "$HOME/.vscode-server/data/User/settings.json" "VS Code Server settings.json"
fi

# CodeBuddy IDE (关键！Remote-SSH 场景下可能用的是 CodeBuddy)
if [ -d "$HOME/.codebuddy-server-cn" ]; then
    configure_settings "$HOME/.codebuddy-server-cn/data/User/settings.json" "CodeBuddy IDE settings.json"
fi

# ---- 7. 替换扩展自带的 native-binary/claude ----
# Claude Code 扩展自带官方 claude 二进制文件，会绕过 claudeProcessWrapper 配置
# 需要将其替换为指向 claude-internal 的 wrapper 脚本
echo ""
echo ">>> 替换扩展内置 claude 二进制 ..."

replace_native_binary() {
    local NATIVE_BIN="$1"
    local LABEL="$2"

    if [ ! -f "$NATIVE_BIN" ]; then
        return
    fi

    # 检查是否已经是 wrapper 脚本
    if head -1 "$NATIVE_BIN" 2>/dev/null | grep -q "^#!/bin/bash"; then
        echo "[OK] $LABEL 已是 wrapper 脚本"
        return
    fi

    # 备份原始二进制
    if [ ! -f "${NATIVE_BIN}.official-backup" ]; then
        mv "$NATIVE_BIN" "${NATIVE_BIN}.official-backup"
        echo "[INFO] $LABEL 原始二进制已备份"
    fi

    # 创建 wrapper 脚本
    cat > "$NATIVE_BIN" <<'WRAPPER'
#!/bin/bash
exec CLAUDE_INTERNAL_PLACEHOLDER "$@"
WRAPPER
    sed -i "s|CLAUDE_INTERNAL_PLACEHOLDER|$CLAUDE_INTERNAL_PATH|g" "$NATIVE_BIN"
    chmod +x "$NATIVE_BIN"
    echo "[OK] $LABEL 已替换为 claude-internal wrapper"
}

# 搜索所有 IDE 扩展目录中的 native-binary/claude
for ext_dir in \
    "$HOME/.vscode-server/extensions" \
    "$HOME/.codebuddy-server-cn/extensions" \
    "$HOME/.vscode/extensions" \
    "$HOME/Library/Application Support/Code/User/extensions" \
; do
    if [ -d "$ext_dir" ]; then
        find "$ext_dir" -path "*/anthropic.claude-code*/resources/native-binary/claude" -type f 2>/dev/null | while read native_bin; do
            replace_native_binary "$native_bin" "$native_bin"
        done
    fi
done

# ---- 8. 安装扩展（如果有 code 命令） ----
echo ""
if command -v code &>/dev/null; then
    echo ">>> 安装 Claude Code VS Code 扩展 ..."
    code --install-extension anthropic.claude-code --force 2>/dev/null && \
        echo "[OK] Claude Code 扩展已安装" || \
        echo "[WARN] 扩展安装失败，请在 IDE 中手动搜索安装 'anthropic.claude-code'"
else
    echo "[INFO] 未检测到 code 命令（Remote-SSH 场景正常）"
    echo "  请在本地 IDE 中手动安装扩展: anthropic.claude-code"
fi

# ---- 完成 ----
echo ""
echo "=========================================="
echo "  配置完成！"
echo "=========================================="
echo ""
echo "  claude-internal: $CLAUDE_INTERNAL_PATH"
echo "  ~/.claude -> ~/.claude-internal"
echo ""
echo "  使用方式："
echo "  1. 在 IDE 中打开 Claude Code 面板"
echo "  2. 插件会自动调用 claude-internal"
echo ""
echo "  注意："
echo "  - 首次使用需先在终端运行 claude-internal 完成登录认证"
echo "  - Reload Window 后生效 (Ctrl+Shift+P -> Developer: Reload Window)"
echo "  - 详细文档：https://iwiki.woa.com/p/4015845000"
echo "=========================================="
