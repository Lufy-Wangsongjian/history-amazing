#!/usr/bin/env node
/**
 * ============================================================
 * 静态布局 Lint 脚本（v2 — 精准降噪版）
 * ============================================================
 *
 * 设计原则：
 * - ERROR 必须 100% 真实（阻断提交），宁可漏报不可误报
 * - WARN 应接近 100% 真实（肉眼可验证），CSS/设计已兜底的降级为 INFO
 * - INFO 默认不输出，仅 --verbose 或 --info 时显示
 *
 * 规则：
 * 1. [ERROR] button 嵌套 button（React hydration error）
 * 2. [ERROR] a 标签嵌套 a 或 button
 * 3. [WARN]  Dialog 缺失 max-h（排除"空壳包装"模式）
 * 4. [WARN]  自身滚动容器的 flex-1 缺 min-h-0（仅 overflow-y-auto/scroll 时触发）
 * 5. [WARN]  负偏移 ≥ 4px 的绝对定位（≤ 2px 的装饰徽章跳过）
 * 6. [INFO]  text-[8px]/[9px]/[10px]（CSS 媒体查询已兜底，默认不输出）
 * 7. [INFO]  fixed 缺 z-index（默认不输出）
 *
 * 用法：
 *   node scripts/lint-layout.mjs                  # 默认：只显示 ERROR + WARN
 *   node scripts/lint-layout.mjs --warn-only      # 不因 ERROR 退出
 *   node scripts/lint-layout.mjs --verbose        # 显示所有 INFO
 *   node scripts/lint-layout.mjs --json           # JSON 输出
 *
 * 退出码：
 *   0 = 无 ERROR/WARN
 *   1 = 发现 ERROR（阻断提交）
 *   2 = 仅 WARN（不阻断）
 * ============================================================
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'app/src')

const WARN_ONLY = process.argv.includes('--warn-only')
const VERBOSE = process.argv.includes('--verbose') || process.argv.includes('--info')
const JSON_OUT = process.argv.includes('--json')

// ─── 工具：递归收集 tsx 文件 ───
function collectTsx(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === 'node_modules') continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) collectTsx(full, acc)
    else if (name.endsWith('.tsx')) acc.push(full)
  }
  return acc
}

function getLine(source, idx) {
  return source.slice(0, idx).split('\n').length
}

// 把 Tailwind 负偏移类转为实际像素（估算）
function parseOffsetPx(token) {
  // -left-[46px] / -top-[1rem] / -top-1 / -top-0.5 / -top-6
  const m1 = token.match(/-\[(-?)(\d+(?:\.\d+)?)(px|rem|em)?\]/)
  if (m1) {
    const val = parseFloat(m1[2])
    const unit = m1[3] || 'px'
    return unit === 'rem' || unit === 'em' ? val * 16 : val
  }
  const m2 = token.match(/-(\d+(?:\.\d+)?)(?!\w)/)
  if (m2) {
    // Tailwind 间距：1 = 4px, 0.5 = 2px, 6 = 24px
    return parseFloat(m2[1]) * 4
  }
  return 0
}

// ─── 规则引擎 ───
const rules = []

/** 规则 1：button 嵌套 button */
rules.push({
  id: 'no-nested-button',
  level: 'error',
  desc: '<button> 嵌套 <button> 会导致 React hydration error',
  check(source) {
    const issues = []
    const regex = /<button\b[^>]*>/g
    const matches = [...source.matchAll(regex)]
    for (let i = 0; i < matches.length; i++) {
      const openIdx = matches[i].index
      let depth = 1
      let cursor = openIdx + matches[i][0].length
      while (cursor < source.length && depth > 0) {
        const openNext = source.indexOf('<button', cursor)
        const closeNext = source.indexOf('</button>', cursor)
        if (closeNext === -1) break
        if (openNext !== -1 && openNext < closeNext) {
          const innerTagEnd = source.indexOf('>', openNext)
          if (innerTagEnd !== -1) {
            depth++
            cursor = innerTagEnd + 1
            issues.push({
              line: getLine(source, openNext),
              msg: `<button> 嵌套在另一个 <button> 内（外层 button 起始于第 ${getLine(source, openIdx)} 行）`,
            })
          } else break
        } else {
          depth--
          cursor = closeNext + '</button>'.length
        }
      }
    }
    return issues
  },
})

/** 规则 2：a 标签嵌套 a 或 button */
rules.push({
  id: 'no-nested-anchor',
  level: 'error',
  desc: '<a> 嵌套 <a> 或 <button> 违反 HTML 规范',
  check(source) {
    const issues = []
    const regex = /<a\s[^>]*>/g
    for (const m of source.matchAll(regex)) {
      const openIdx = m.index
      const closeIdx = source.indexOf('</a>', openIdx)
      if (closeIdx === -1) continue
      const inner = source.slice(openIdx + m[0].length, closeIdx)
      if (/<(?:a\s|button\b)/i.test(inner)) {
        issues.push({
          line: getLine(source, openIdx),
          msg: `<a> 标签内嵌套了 <a> 或 <button>`,
        })
      }
    }
    return issues
  },
})

/** 规则 3：Dialog 弹窗缺 max-h
 *
 * 智能排除"空壳包装"模式：
 *   <DialogContent className="p-0 overflow-hidden gap-0 border-0">
 *     <InnerWrapper className="max-h-[88vh] flex flex-col ...">
 *       ...
 *     </InnerWrapper>
 *   </DialogContent>
 * 这种情况 DialogContent 本身不需要 max-h，内部容器已管控。
 */
rules.push({
  id: 'dialog-missing-max-height',
  level: 'warn',
  desc: 'DialogContent 建议设置 max-h 避免小屏溢出（空壳包装模式自动豁免）',
  check(source) {
    const issues = []
    const dialogRegex = /<DialogContent\s+([^>]*className=(["'`])([^"'`]*)\2[^>]*)>/g
    for (const m of source.matchAll(dialogRegex)) {
      const className = m[3]
      // 自身已有高度约束，OK
      if (/\bmax-h-/.test(className) || /\bh-screen\b/.test(className) || /\bh-full\b/.test(className)) continue

      // 判断是否为"空壳包装"：className 含 p-0 + overflow-hidden，表示内部自行管理
      const isShell = /\bp-0\b/.test(className) && /\boverflow-hidden\b/.test(className)

      if (isShell) {
        // 校验内部第一层 div 是否有 max-h / h-screen / flex-col + overflow
        const closeIdx = source.indexOf('>', m.index + m[0].length - 1)
        // 向后扫描 800 字符范围内第一个子元素的 className
        const snippet = source.slice(closeIdx, closeIdx + 1500)
        const innerMatch = snippet.match(/<div\s+[^>]*className=(["'`])([^"'`]*)\1/)
        if (innerMatch) {
          const innerCls = innerMatch[2]
          const innerHasHeight = /\bmax-h-/.test(innerCls) || /\bh-screen\b/.test(innerCls) ||
                                 /\bh-full\b/.test(innerCls) || /\bh-\[/.test(innerCls)
          if (innerHasHeight) continue // 内部已管控，跳过
        }
      }

      issues.push({
        line: getLine(source, m.index),
        msg: `DialogContent 缺 max-h（className: "${className.slice(0, 70)}..."）`,
      })
    }
    return issues
  },
})

/** 规则 4：flex-1 + 自身 overflow 缺 min-h-0
 *
 * 只对"自身即滚动容器"的 flex-1 报警。
 * 纯布局用的 flex-col + flex-1（如居中层、卡片列表）不需要 min-h-0。
 */
rules.push({
  id: 'flex-missing-min-h-0',
  level: 'warn',
  desc: '带 flex-1 的滚动容器缺 min-h-0 会导致无法收缩',
  check(source) {
    const issues = []
    const regex = /className=(["'`])([^"'`]*\bflex-1\b[^"'`]*)\1/g
    for (const m of source.matchAll(regex)) {
      const cls = m[2]
      // 必须自身是 overflow-y-auto/scroll 才触发（flex-col 单独不算）
      const isSelfScroller = /\boverflow-y-(auto|scroll)\b/.test(cls) ||
                             /\boverflow-(auto|scroll)\b/.test(cls)
      if (isSelfScroller && !/\bmin-h-0\b/.test(cls)) {
        issues.push({
          line: getLine(source, m.index),
          msg: `flex-1 + overflow 滚动容器缺 min-h-0（className: "${cls.slice(0, 70)}..."）`,
        })
      }
    }
    return issues
  },
})

/** 规则 5：绝对定位负偏移 ≥ 4px
 *
 * 排除 ≤ 2px 的装饰微偏移（徽章/圆点对齐）。
 * 仅 ≥ 4px 的负偏移才警告（因为父容器可能 overflow-hidden 裁切）。
 */
rules.push({
  id: 'negative-offset-clipping-risk',
  level: 'warn',
  desc: '≥ 4px 的负偏移可能被 overflow-hidden 父容器裁切',
  check(source) {
    const issues = []
    const regex = /className=(["'`])([^"'`]*\babsolute\b[^"'`]*)\1/g
    for (const m of source.matchAll(regex)) {
      const cls = m[2]
      const offsetMatch = cls.match(/-(left|right|top|bottom)-(\[[^\]]+\]|[\d.]+)/)
      if (!offsetMatch) continue
      const offsetPx = parseOffsetPx(offsetMatch[0])
      if (offsetPx < 4) continue // 徽章类微偏移豁免
      issues.push({
        line: getLine(source, m.index),
        msg: `绝对定位负偏移 ${offsetMatch[0]} (~${Math.round(offsetPx)}px)，请确认父容器不是 overflow-hidden`,
      })
    }
    return issues
  },
})

/** 规则 6：text-[8px]/[9px]/[10px] — 降级为 INFO
 *
 * CSS 媒体查询已自动提升到 11-12px，源码层面仅记录参考。
 */
rules.push({
  id: 'text-too-small',
  level: 'info',
  desc: 'text-[8px]/[9px]/[10px]（CSS 媒体查询已自动提升到 11-12px）',
  check(source) {
    const issues = []
    const lines = source.split('\n')
    let insideSvg = false
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (/<svg\b/.test(line)) insideSvg = true
      if (/<\/svg>/.test(line)) insideSvg = false
      if (insideSvg) continue
      const m = line.match(/text-\[([0-9]+)px\]/)
      if (m && parseInt(m[1]) < 11) {
        issues.push({ line: i + 1, msg: `${m[0]}（建议 ≥ text-[11px]）` })
      }
    }
    return issues
  },
})

/** 规则 7：fixed 无 z-index — 降级为 INFO */
rules.push({
  id: 'fixed-missing-z-index',
  level: 'info',
  desc: 'fixed 元素建议明确 z-index（无即默认 auto）',
  check(source) {
    const issues = []
    const regex = /className=(["'`])([^"'`]*\bfixed\b[^"'`]*)\1/g
    for (const m of source.matchAll(regex)) {
      const cls = m[2]
      if (/pointer-events-none/.test(cls)) continue
      if (!/\bz-/.test(cls)) {
        issues.push({
          line: getLine(source, m.index),
          msg: `fixed 缺 z-index（className: "${cls.slice(0, 60)}..."）`,
        })
      }
    }
    return issues
  },
})

// ─── 主流程 ───
const files = collectTsx(SRC_DIR)
let errorCount = 0
let warnCount = 0
let infoCount = 0
const report = []

// 解析文件中的 ignore 指令：
//   // layout-lint-ignore-next-line <rule-id>
//   {/* layout-lint-ignore-next-line <rule-id> */}  (JSX 注释)
//   // layout-lint-ignore-next-line              (忽略所有规则)
//
// 豁免范围：紧邻的下一行 + 其跨行元素内的前 10 行（JSX 多行标签常见）
function parseIgnoreMap(source) {
  const map = new Map() // lineNum -> Set<ruleId> | '*'
  const lines = source.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/(?:\/\/|\{\/\*)\s*layout-lint-ignore-next-line(?:\s+([\w\-,\s]+?))?(?:\s*\*\/\})?\s*$/)
    if (m) {
      const ids = m[1] ? m[1].split(/[,\s]+/).filter(Boolean) : '*'
      // 豁免下一行开始的 10 行窗口（覆盖多行 JSX 标签场景）
      for (let j = i + 2; j <= i + 11 && j <= lines.length; j++) {
        // 但一旦遇到空行或新的语句起点，停止窗口
        const curLine = lines[j - 1] || ''
        const prev = map.get(j)
        if (Array.isArray(ids) && Array.isArray(prev)) {
          map.set(j, [...new Set([...prev, ...ids])])
        } else {
          map.set(j, ids)
        }
        // 如果遇到闭合标签 /> 或 </ 或闭合括号，后续行不再豁免
        if (/\/>\s*$|<\/\w+>\s*$|^\s*\}\s*$/.test(curLine)) break
      }
    }
  }
  return map
}

for (const file of files) {
  const rel = relative(ROOT, file)
  const source = readFileSync(file, 'utf-8')
  const ignoreMap = parseIgnoreMap(source)
  for (const rule of rules) {
    const issues = rule.check(source, file)
    for (const iss of issues) {
      // 检查是否被 ignore 指令豁免
      const ignored = ignoreMap.get(iss.line)
      if (ignored === '*' || (Array.isArray(ignored) && ignored.includes(rule.id))) continue

      report.push({ level: rule.level, file: rel, line: iss.line, ruleId: rule.id, msg: iss.msg })
      if (rule.level === 'error') errorCount++
      else if (rule.level === 'warn') warnCount++
      else infoCount++
    }
  }
}

// ─── JSON 输出模式 ───
if (JSON_OUT) {
  console.log(JSON.stringify({
    summary: { errorCount, warnCount, infoCount, fileCount: files.length },
    issues: report,
  }, null, 2))
  process.exit(errorCount > 0 ? 1 : 0)
}

// ─── 美化输出 ───
const COLOR = {
  error: '\x1b[31m',
  warn: '\x1b[33m',
  info: '\x1b[36m',
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
}

const order = { error: 0, warn: 1, info: 2 }
report.sort((a, b) => order[a.level] - order[b.level] || a.file.localeCompare(b.file) || a.line - b.line)

console.log(`\n${COLOR.gray}═══ 静态布局 Lint 报告（v2）═══${COLOR.reset}`)
console.log(`${COLOR.gray}扫描 ${files.length} 个 .tsx 文件${COLOR.reset}\n`)

// 过滤：默认不显示 INFO
const displayed = VERBOSE ? report : report.filter(r => r.level !== 'info')

if (displayed.length === 0) {
  if (report.length === 0) {
    console.log(`${COLOR.info}✓ 未发现任何布局问题${COLOR.reset}`)
  } else {
    console.log(`${COLOR.info}✓ 无 ERROR / WARN（${infoCount} 条 INFO 已折叠，--verbose 查看详情）${COLOR.reset}`)
  }
} else {
  for (const r of displayed) {
    console.log(`${COLOR[r.level]}${r.file}:${r.line}${COLOR.reset}  ${COLOR.gray}[${r.level.toUpperCase()}]${COLOR.reset} ${COLOR.bold}${r.ruleId}${COLOR.reset} — ${r.msg}`)
  }
}

console.log()
console.log(
  `${COLOR.error}ERROR: ${errorCount}${COLOR.reset}  ` +
  `${COLOR.warn}WARN: ${warnCount}${COLOR.reset}  ` +
  `${COLOR.info}INFO: ${infoCount}${COLOR.reset}` +
  (VERBOSE || infoCount === 0 ? '' : `${COLOR.gray}  (INFO 已折叠，--verbose 查看)${COLOR.reset}`)
)
console.log()

if (errorCount > 0 && !WARN_ONLY) process.exit(1)
if (warnCount > 0 && !WARN_ONLY) process.exit(2)
process.exit(0)
