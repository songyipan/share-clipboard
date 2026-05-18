# AGENT.md

Electron 划词悬浮球应用的技术指导文档。

## 项目概述

系统级划词翻译工具。用户在任意应用划选文本后按快捷键，悬浮球出现在鼠标位置显示选中内容。

## 技术栈

- **Electron 39** + **Vite 7** + **React 19** + **TypeScript 5**
- **@nut-tree-fork/nut-js** - 模拟键盘操作
- **react-router-dom** - 多窗口路由

## 架构

```text
src/
├── main/           # Electron 主进程
│   ├── index.ts            # 入口，IPC 注册，窗口生命周期
│   ├── floatingWindow.ts   # 悬浮球窗口管理
│   ├── mouseListener.ts    # 全局快捷键监听
│   ├── selection.ts        # 划词核心：剪贴板 + 模拟复制
│   └── utils/
│       ├── platform.ts     # 平台检测、IPC 常量
│       └── async.ts        # delay 工具
├── preload/        # 预加载脚本，暴露 API 给渲染进程
│   ├── index.ts
│   └ index.d.ts
└── renderer/       # React 渲染进程
    └── src/
        ├── App.tsx                 # 路由配置
        ├── components/floating/FloatingBall.tsx  # 悬浮球组件
        └── pages/MainApp.tsx       # 主界面
```

## 工作流程

### 1. 编码前：检查 Skills

写代码前先查看是否有合适的 skills：

```text
可用 skills:
- simplify     → 代码审查，检查复用、质量、效率
- skill-creator → 创建新 skill
- find-skills  → 查找适合当前任务的 skill
```

**流程**：

1. 查看项目 `.claude/skills/` 目录下是否有适用的 skill
2. 使用 `/simplify` skill 进行代码变更审查
3. 参考 skill 中的最佳实践和规范

### 2. 编码中：遵循规范

- 函数不超过 70 行
- 使用 `utils/platform.ts` 进行平台检测
- 使用 `IPC_CHANNELS` 常量而非硬编码字符串
- 只保留解释 WHY 的注释

### 3. 编码后：质量检查

完成代码后必须运行检查：

```bash
pnpm typecheck    # TypeScript 类型检查
pnpm lint         # ESLint 代码规范检查
pnpm format       # Prettier 格式化
```

**检查清单**：

- [ ] TypeScript 无错误
- [ ] ESLint 无 warning/error
- [ ] 函数行数 ≤ 70
- [ ] 无重复的平台检测代码
- [ ] IPC 通道使用常量
- [ ] 文件末尾有换行符

## 代码规范

### 函数长度

- 单个函数不超过 **70 行**
- 拆分复杂逻辑为多个小函数

### 模块化

- 平台检测使用 `utils/platform.ts`，不要重复 `process.platform === 'darwin'`
- IPC 通道使用 `IPC_CHANNELS` 常量，不要硬编码字符串
- 异步延迟使用 `utils/async.ts` 的 `delay()` 函数

### 状态管理

- 主进程模块级变量需检查 `isDestroyed()` 防止引用已销毁窗口
- React 组件使用 `removeListener` 而非 `removeAllListeners` 清理事件

### 注释

- 只保留解释 **WHY** 的注释（隐藏约束、特殊原因）
- 删除解释 **WHAT** 的注释（函数名已表达）

## IPC 通道

| 通道                | 方向            | 用途             |
| ------------------- | --------------- | ---------------- |
| `selection:result`  | main → renderer | 传递选中文本     |
| `floating:show`     | renderer → main | 显示悬浮球       |
| `floating:hide`     | renderer → main | 隐藏悬浮球       |
| `selection:get`     | renderer → main | 手动获取选中文本 |
| `listener:status`   | renderer → main | 查询监听状态     |
| `listener:shortcut` | renderer → main | 获取当前快捷键   |

## 快捷键

- macOS: `Command+Shift+C`
- Windows/Linux: `Ctrl+Shift+C`

## 权限提醒

macOS 首次运行需授权：

- 系统设置 → 隐私与安全性 → 辅助功能 → 添加应用
- 模拟键盘操作需要此权限

## 开发命令

```bash
pnpm dev        # 启动开发模式
pnpm build      # 类型检查 + 构建
pnpm typecheck  # 仅类型检查
pnpm lint       # ESLint 检查
pnpm format     # Prettier 格式化
```
