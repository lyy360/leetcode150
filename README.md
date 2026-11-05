# leetcode150 — 代码随想录刷题工具

一个基于 **Taro 4 + React + TypeScript** 的刷题小程序（同时支持 H5），收录代码随想录 165 题（原「150 题」清单，含卡码网补充题），支持刷题状态标记、本地题解查看、刷题笔记与进度统计。

## 功能一览

| 页面 | 说明 |
| --- | --- |
| 题库（`pages/index`） | 全部题目按分类分组展示，支持按题号/名称搜索、按刷题状态（未刷/已刷/重刷）筛选，顶部显示总进度条 |
| 题目详情（`pages/detail`） | 标记刷题状态、查看相关链接（力扣/卡码网原题、网页版题解）、记录刷题笔记 |
| 本地题解（`packages/solution` 分包） | 应用内直接查看题目描述、思路解析与 TypeScript 参考实现，代码一键复制；无需跳转外部网页 |
| 统计（`pages/stats`） | 按分类、难度维度统计刷题进度（已刷 / 重刷 / 总数） |

进度与笔记通过 `Taro.getStorageSync / setStorageSync` 存储在本地（小程序为 Storage，H5 为 localStorage）。

## 运行环境

- Node.js（建议 ≥ 18）
- npm

## 快速开始

```bash
# 安装依赖
npm install

# 微信小程序：开发模式（watch，产物输出到 dist/）
npm run dev:weapp
# 然后用微信开发者工具「导入项目」，目录选择项目根目录下的 dist/

# 微信小程序：生产构建
npm run build:weapp

# H5：开发模式（webpack-dev-server，默认 http://localhost:10086）
npm run dev:h5

# H5：生产构建
npm run build:h5
```

## 项目结构

```
leetcode150/
├── config/                    # Taro 构建配置
│   ├── index.ts               # 基础配置（含小程序端 ProvidePlugin 修复，见下文）
│   ├── dev.ts / prod.ts       # 开发 / 生产差异化配置
├── src/
│   ├── app.ts / app.config.ts # 应用入口与全局配置（页面注册、tabBar、分包）
│   ├── types.ts               # Question / Status 等类型与常量
│   ├── store.ts               # 刷题进度、笔记的本地存取封装
│   ├── data/
│   │   └── questions.json     # 165 题元数据（题号、标题、分类、难度、原题/题解链接）
│   ├── pages/
│   │   ├── index/             # 题库列表页
│   │   ├── detail/            # 题目详情页
│   │   └── stats/             # 统计页
│   ├── packages/solution/     # 本地题解分包（不占主包体积）
│   │   ├── pages/view/        # 题解展示页（题目描述 / 思路解析 / TS 代码）
│   │   ├── components/Md.tsx  # 轻量 markdown 渲染器（小程序兼容，支持标题/列表/引用/加粗/代码块）
│   │   └── data/              # 题解数据：14 个分类文件，每题含 desc/analysis/code 三个字段
│   └── assets/                # tabBar 图标等静态资源
└── dist/                      # 构建产物（weapp 与 h5 共用输出目录）
```

### 题解数据格式

`src/packages/solution/data/` 下每个分类文件（如 `hash.ts`、`dp-1.ts`）导出一个 `Record<string, Solution>`，key 为 `questions.json` 中的题目 `id`：

```ts
import type { Solution } from './types'

const solutions: Record<string, Solution> = {
  'lc-two-sum': {
    desc: `题目描述…`,      // 题意概述 + 示例 + 提示
    analysis: `思路解析…`,   // 核心思路 / 算法步骤 / 易错点 / 复杂度
    code: `TypeScript 实现…`
  }
}

export default solutions
```

语法约定（由 `Md.tsx` 渲染器决定）：`##` / `###` 标题、`-` 与 `1.` 列表、`>` 引用、`**加粗**`；代码块围栏使用 `~~~`（因为字段值是 TS 模板字符串，内容中不能出现反引号与 `${`）。

新增题目时：先在 `src/data/questions.json` 添加题目元数据，再在对应分类文件中补充同 `id` 的题解即可，题解页会自动渲染。

## 技术要点

- **双端适配**：Taro 4.3.1 + React 18，一套代码同时编译微信小程序与 H5；设计稿宽度 750px，`pxtransform` 自动做 rpx 换算。
- **分包加载**：题解数据约 480KB 源码，全部放在 `packages/solution` 分包中（构建后约 784KB），主包仅约 450KB，远低于微信 2MB 主包限制；详情页通过 `Taro.navigateTo` 跳转分包页面。
- **状态持久化**：无后端、无登录，全部数据（进度、笔记）落在本地 Storage。

## 已知问题与修复记录

- **小程序生产构建启动报 `Cannot access 'c' before initialization`**：Taro 的 ProvidePlugin 会把代码中裸引用的 `requestAnimationFrame` / `cancelAnimationFrame` 改写为 `require('@tarojs/runtime')`，与 runtime 内部 raf polyfill 形成循环引用，压缩后触发 TDZ 错误。小程序端不存在原生 rAF，该分支为死代码，已在 [config/index.ts](config/index.ts) 的 `mini.webpackChain` 中删除这两条 provide 规则修复。

## 其他脚本

```bash
npm run new        # taro new，创建新的 Taro 页面/项目脚手架
```

仓库配置了 husky + commitlint + lint-staged，提交信息遵循 Conventional Commits 规范。
