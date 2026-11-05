export interface Question {
  id: string
  num: string
  title: string
  slug: string
  source: 'lc' | 'kama'
  difficulty: 1 | 2 | 3
  category: string
  sub: string | null
  leetcodeUrl: string | null
  articleUrl: string | null
  order: number
}

/** 0 未刷 1 已刷 2 重刷 */
export type Status = 0 | 1 | 2

export const STATUS_TEXT: Record<Status, string> = {
  0: '未刷',
  1: '已刷',
  2: '重刷'
}

export const DIFF_TEXT: Record<number, string> = {
  1: '简单',
  2: '中等',
  3: '困难'
}

export const DIFF_CLASS: Record<number, string> = {
  1: 'easy',
  2: 'medium',
  3: 'hard'
}
