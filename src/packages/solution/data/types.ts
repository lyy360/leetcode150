/** 本地题解数据结构：题目描述 + 思路解析 + TypeScript 代码 */
export interface Solution {
  /** 题目描述（markdown-lite：## / ### / - 列表 / 1. 列表 / **加粗** / `行内代码` / > 引用 / ``` 代码块） */
  desc: string
  /** 思路解析，同上 markdown-lite 语法 */
  analysis: string
  /** TypeScript 参考实现 */
  code: string
}

export type SolutionMap = Record<string, Solution>
