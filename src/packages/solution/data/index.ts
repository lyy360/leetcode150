import type { SolutionMap } from './types'
import array from './array'
import linkedList from './linked-list'
import hash from './hash'
import monotonicStack from './monotonic-stack'
import str from './string'
import stackQueue from './stack-queue'
import tree1 from './tree-1'
import tree2 from './tree-2'
import backtracking from './backtracking'
import greedy from './greedy'
import dp1 from './dp-1'
import dp2 from './dp-2'
import graph1 from './graph-1'
import graph2 from './graph-2'

const all: SolutionMap = {
  ...array,
  ...linkedList,
  ...hash,
  ...monotonicStack,
  ...str,
  ...stackQueue,
  ...tree1,
  ...tree2,
  ...backtracking,
  ...greedy,
  ...dp1,
  ...dp2,
  ...graph1,
  ...graph2
}

export function getSolution(id: string) {
  return all[id] ?? null
}

export type { Solution } from './types'
