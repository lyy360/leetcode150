import type { Solution } from './types'

const solutions: Record<string, Solution> = {
  'kama-1181': {
    desc: `有一棵由 n 个节点组成的树（节点编号 1 到 n，含 n - 1 条边），现在向树中加入了一条额外的边，使图中出现了一个环。请找出这条多余的边并输出它的两个端点；若删除多条不同边都能让图恢复成树，则输出在输入中出现最靠后的那条边。

输入：第一行一个整数 n（3 <= n <= 1000）；接下来 n 行，每行两个整数 u 和 v，表示节点 u 与 v 之间有一条无向边。

输出：一行，两个整数，用空格分隔，即多余边的两个端点。

**示例 1：**
- 输入：
~~~
3
1 2
1 3
2 3
~~~
- 输出：
~~~
2 3
~~~
- 解释：原树由边 1-2、1-3 构成，加入边 2-3 后形成环，删除 2-3 即恢复为树。`,
    analysis: `### 核心思路
树有 n - 1 条边且无环，加入一条边后共有 n 条边，恰好构成一个环。判断一条边是否会带来环，用**并查集**再合适不过：依次把每条边的两个端点合并进集合，如果一条边的两端点在加入之前就已经在同一个集合里，说明这条边让图中出现了环，它就是多余的边。

> 为什么遇到的第一条成环边恰好就是「输入中出现最靠后」的可删边？因为环上任何一条边都可以作为删除对象，而按输入顺序逐条加入时，排在最后的环上边在加入之前，环上其余边已经全部入集合，它必然是第一条触发成环的边；排在它之前的非环边在加入时永远不可能成环。

### 算法步骤
1. 初始化并查集，father[i] = i。
2. 按输入顺序逐条读入边 (u, v)，分别求出 u、v 的根。
3. 若两根不同，说明加入这条边不会成环，执行合并。
4. 若两根相同，这条边就是多余的边，记录答案（继续读完剩余输入）。
5. 输出记录的答案。

### 易错点
- 判断成环的依据是「合并之前两端点同根」，不是合并之后。
- find 函数要做路径压缩，否则最坏情况下退化成链，效率骤降。
- 节点编号从 1 开始，father 数组要开 n + 1 的长度，避免下标越界。
- 即使已经找到答案，也要把剩余的边读完，ACM 模式下输入解析必须完整。

### 复杂度分析
- 时间复杂度：O(n * α(n))，α 为阿克曼反函数，近似线性。
- 空间复杂度：O(n)，并查集数组。`,
    code: `function solve(lines: string[]): string {
  const n = parseInt(lines[0])
  const father: number[] = new Array(n + 1)
  for (let i = 1; i <= n; i++) father[i] = i

  const find = (u: number): number => {
    if (father[u] !== u) {
      father[u] = find(father[u]) // 路径压缩
    }
    return father[u]
  }

  let ans = ''
  for (let i = 1; i <= n; i++) {
    const parts = lines[i].split(' ')
    const u = parseInt(parts[0])
    const v = parseInt(parts[1])
    const ru = find(u)
    const rv = find(v)
    if (ru === rv) {
      // 两端点已连通，这条边造成环，即多余的边
      ans = u + ' ' + v
    } else {
      father[ru] = rv
    }
  }
  return ans
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },
  'kama-1182': {
    desc: `一棵有向树由 n 个节点（编号 1 到 n）和 n - 1 条有向边构成，从根节点出发可以到达所有节点。现在向树中加入了一条额外的有向边，请你找出这条多余的边并输出；删除它之后，剩余的边应当仍构成一棵合法的有向树。

输入：第一行一个整数 n（3 <= n <= 1000）；接下来 n 行，每行两个整数 u 和 v，表示一条从 u 指向 v 的有向边。

输出：一行，两个整数，用空格分隔，即应删除的多余边。

**示例 1：**
- 输入：
~~~
3
1 2
1 3
2 3
~~~
- 输出：
~~~
2 3
~~~
- 解释：节点 3 的入度为 2，指向它的边是 1->3 与 2->3，删除 2->3 后剩下 1->2、1->3，仍是以 1 为根的有向树。`,
    analysis: `### 核心思路
有向树加入一条多余边，只有三类情况，必须分类讨论：

- **情况一：多余边形成环，但没有节点入度变为 2**。此时直接复用上一题的做法，把边看作无向边，用并查集按输入顺序逐条加入，第一条成环的边就是答案。
- **情况二：某节点入度变为 2，但没有形成环**。必须删掉指向该节点的两条边之一，优先尝试删除输入中靠后的那条 edge2：删除后若剩余边构成合法树就删它，否则删 edge1。
- **情况三：既有环，又有节点入度为 2**。这时不能盲目删 edge2——如果 edge2 恰好是环上唯一连接外部的关键边，删它会让环保留、树断裂。判断方法与情况二相同：试删 edge2 后用并查集检查剩余边，无环则删 edge2，否则删 edge1。

> 「剩余 n - 1 条边在无向意义上无环」就足以判定合法有向树：n 个节点、n - 1 条边、无环，图必连通且成树，边的方向自然满足有向树性质，无需再做可达性检查。

### 算法步骤
1. 读入所有边，统计每个节点入度，并记录指向入度为 2 节点的两条边 edge1（先出现）与 edge2（后出现）的下标。
2. 若存在入度为 2 的节点：跳过 edge2，把其余边加入无向并查集，若全程无环则答案为 edge2，否则答案为 edge1。
3. 若不存在入度为 2 的节点：把所有边加入无向并查集，按输入顺序找到第一条成环的边作为答案。

### 易错点
- 情况三最容易被漏掉：见到入度为 2 就直接删 edge2 是常见错误，环与入度 2 同时出现时必须先验证试删结果。
- 找环时必须按输入顺序逐条加入并查集，才能保证第一条成环边就是正确答案。
- 统计入度时只给边的终点加 1，起点不变，方向不要搞反。

### 复杂度分析
- 时间复杂度：O(n * α(n))，每条边最多做常数次并查集操作。
- 空间复杂度：O(n)，并查集与入度数组。`,
    code: `function solve(lines: string[]): string {
  const n = parseInt(lines[0])
  const edges: number[][] = []
  const inDegree: number[] = new Array(n + 1).fill(0)
  for (let i = 1; i <= n; i++) {
    const parts = lines[i].split(' ')
    const u = parseInt(parts[0])
    const v = parseInt(parts[1])
    edges.push([u, v])
    inDegree[v]++
  }

  const father: number[] = new Array(n + 1)
  for (let i = 1; i <= n; i++) father[i] = i
  const find = (u: number): number => {
    if (father[u] !== u) father[u] = find(father[u])
    return father[u]
  }

  // 检查跳过下标 skip 的边后，其余边在无向意义上是否无环
  const isTreeWithout = (skip: number): boolean => {
    for (let i = 1; i <= n; i++) father[i] = i
    for (let i = 0; i < edges.length; i++) {
      if (i === skip) continue
      const ru = find(edges[i][0])
      const rv = find(edges[i][1])
      if (ru === rv) return false
      father[ru] = rv
    }
    return true
  }

  // 找指向入度为 2 节点的两条边（先出现 edge1，后出现 edge2）
  let edge1 = -1
  let edge2 = -1
  for (let i = 0; i < edges.length; i++) {
    if (inDegree[edges[i][1]] === 2) {
      if (edge1 === -1) {
        edge1 = i
      } else {
        edge2 = i
      }
    }
  }

  if (edge1 !== -1) {
    // 存在入度为 2 的节点：优先尝试删除靠后的 edge2
    if (isTreeWithout(edge2)) {
      return edges[edge2][0] + ' ' + edges[edge2][1]
    }
    return edges[edge1][0] + ' ' + edges[edge1][1]
  }

  // 无入度 2 节点：多余边形成环，按输入顺序找第一条成环边
  for (let i = 1; i <= n; i++) father[i] = i
  for (let i = 0; i < edges.length; i++) {
    const ru = find(edges[i][0])
    const rv = find(edges[i][1])
    if (ru === rv) {
      return edges[i][0] + ' ' + edges[i][1]
    }
    father[ru] = rv
  }
  return ''
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },
  'kama-1053': {
    desc: `地球上有 n 座城市（编号 1 到 n），城市之间规划了 m 条候选道路，修建每条道路都需要一定时间。作为总指挥，你希望修建若干条道路，使 n 座城市全部直接或间接连通，并且总修建时间最短，这正是最小生成树问题。请输出最小生成树的所有边的权值之和。

输入：第一行两个整数 n, m（1 <= n <= 1000，1 <= m <= 100000）；接下来 m 行，每行三个整数 x, y, k，表示城市 x 与城市 y 之间修建道路需要时间 k。

输出：一行一个整数，最小生成树的总权值。

**示例 1：**
- 输入：
~~~
3 3
1 2 2
2 3 3
1 3 4
~~~
- 输出：
~~~
5
~~~
- 解释：选择道路 1-2（时间 2）与 2-3（时间 3），三座城市连通，总时间 2 + 3 = 5；任何包含 1-3 的方案总时间都不小于 6。`,
    analysis: `### 核心思路
最小生成树要在带权无向图中选出 n - 1 条边，把所有节点连通且总权值最小。**Prim 算法**从「点的角度」扩张生成树：维护一个已入树的节点集合，以及数组 minDist，minDist[i] 表示「未入树节点 i 到已生成树整体」的最短距离。每一轮从未入树的节点中挑 minDist 最小的节点加入树，累加它入树时的边权，再用它的出边更新其他未入树节点的 minDist。n 轮之后所有节点入树，累加值即总权值。

> Prim 的 minDist 与 Dijkstra 的 minDist 含义完全不同：Prim 是「到生成树」的距离，更新公式是 min(minDist[v], w)；Dijkstra 是「到源点」的累计距离，更新公式是 min(minDist[v], minDist[cur] + w)。两套代码长得像，但松弛逻辑不能混写。

本题也可以用 **Kruskal**：把边按权值从小到大排序，借助并查集依次挑选不构成环的边，选够 n - 1 条即得最小生成树。Prim 适合稠密图（O(n^2)），Kruskal 适合稀疏图（O(m log m)），本题数据范围下两者都能通过。

### 算法步骤
1. 用邻接矩阵建无向图，重边取较小权值。
2. 初始化 minDist 为无穷大，minDist[1] = 0，让节点 1 最先入树。
3. 循环 n 轮：每轮从未入树节点中找 minDist 最小的节点 cur，标记入树，把 minDist[cur] 累加进答案。
4. 遍历 cur 的所有邻接节点 v，若 v 未入树且 grid[cur][v] < minDist[v]，更新 minDist[v]。
5. 输出累加的总权值。

### 易错点
- 累加的是「节点入树那一刻的 minDist 值」，即连接它与生成树的边权；在更新阶段累加会把同一条边重复计算。
- 起点入树时 minDist 为 0，不贡献权值，这是刻意的初始化技巧。
- 无向图要双向建边；多条重边只保留最小的一条即可。

### 复杂度分析
- 时间复杂度：O(n^2)，朴素 Prim 每轮找最小值加更新。
- 空间复杂度：O(n^2)，邻接矩阵。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const header = lines[idx++].split(' ')
  const n = parseInt(header[0])
  const m = parseInt(header[1])
  const MAX = Infinity
  const grid: number[][] = []
  for (let i = 0; i <= n; i++) {
    grid.push(new Array(n + 1).fill(MAX))
  }
  for (let i = 0; i < m; i++) {
    const parts = lines[idx++].split(' ')
    const x = parseInt(parts[0])
    const y = parseInt(parts[1])
    const k = parseInt(parts[2])
    // 无向图双向建边，重边取最小
    grid[x][y] = Math.min(grid[x][y], k)
    grid[y][x] = Math.min(grid[y][x], k)
  }

  const minDist: number[] = new Array(n + 1).fill(MAX)
  const inTree: boolean[] = new Array(n + 1).fill(false)
  minDist[1] = 0
  let result = 0
  for (let round = 1; round <= n; round++) {
    // 选出距生成树最近的未入树节点
    let cur = -1
    let minVal = MAX
    for (let v = 1; v <= n; v++) {
      if (!inTree[v] && minDist[v] < minVal) {
        minVal = minDist[v]
        cur = v
      }
    }
    if (cur === -1) break // 图不连通，提前结束
    inTree[cur] = true
    result += minDist[cur] // 入树边权计入答案
    // 用 cur 的出边更新其他节点到生成树的距离
    for (let v = 1; v <= n; v++) {
      if (!inTree[v] && grid[cur][v] !== MAX && grid[cur][v] < minDist[v]) {
        minDist[v] = grid[cur][v]
      }
    }
  }
  return String(result)
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },
  'kama-1191': {
    desc: `一个大型软件项目包含 n 个文件，编号 0 到 n - 1，文件之间存在依赖关系：若文件 s 依赖文件 t，则必须先处理 t 才能处理 s。请给出一个合法的文件处理顺序；若依赖关系中存在循环依赖导致无法完成构建，输出 -1。

输入：第一行两个整数 n, m，表示文件数量与依赖关系数量；接下来 m 行，每行两个整数 s, t，表示文件 s 依赖文件 t。

输出：一行 n 个整数，用空格分隔，表示一个合法的处理顺序；若存在循环依赖则输出 -1。

**示例 1：**
- 输入：
~~~
4 3
0 1
0 2
3 1
~~~
- 输出：
~~~
1 2 3 0
~~~
- 解释：文件 0 依赖 1 和 2，文件 3 依赖 1。先处理无依赖的 1 和 2，1 处理完后 3 的依赖满足，最后处理 0。`,
    analysis: `### 核心思路
把依赖关系建成有向图：s 依赖 t 就加一条边 t -> s，表示 t 完成后 s 才解锁。求一个满足所有先后约束的线性顺序，就是**拓扑排序**。经典做法是 Kahn 算法（BFS）：统计每个节点的入度，入度为 0 意味着没有任何前置依赖，先入队；每处理一个节点，就把它指向的所有节点入度减 1，某个节点入度减到 0 就入队。如果最终出队的节点数不足 n，说明剩下的节点互相等待、形成了环。

> 拓扑序一般不唯一，本题输出任意一种合法顺序即可。按编号从小到大扫描入度数组来初始化队列，输出顺序稳定且自然，也方便对照示例。

### 算法步骤
1. 建邻接表：每条依赖 s 依赖 t，加入边 t -> s，并让 inDegree[s] 加 1。
2. 扫描所有节点，把入度为 0 的节点依次加入队列。
3. 用指针逐个取出队首节点 cur，追加到结果序列；遍历 cur 的每条出边，将邻接节点入度减 1，减到 0 就加入队列。
4. 队列处理完毕后，若结果序列长度等于 n，输出该序列；否则存在循环依赖，输出 -1。

### 易错点
- 边的方向：s 依赖 t 应建 t -> s。方向建反了，输出的顺序就不满足依赖约束。
- 判断无解的标准是「出队节点数小于 n」：有环时环上节点的入度永远减不到 0，它们不会入队。
- 队列用头指针取元素比 shift 更直观，也能避免重复移动数组元素。
- 输出是空格分隔的一行，直接用 join 拼接即可，注意 -1 的输出没有空格问题。

### 复杂度分析
- 时间复杂度：O(n + m)，每个节点进出队各一次，每条边只被遍历一次。
- 空间复杂度：O(n + m)，邻接表、入度数组与队列。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const header = lines[idx++].split(' ')
  const n = parseInt(header[0])
  const m = parseInt(header[1])
  const adj: number[][] = []
  for (let i = 0; i < n; i++) adj.push([])
  const inDegree: number[] = new Array(n).fill(0)
  for (let i = 0; i < m; i++) {
    const parts = lines[idx++].split(' ')
    const s = parseInt(parts[0])
    const t = parseInt(parts[1])
    adj[t].push(s) // s 依赖 t，建边 t -> s
    inDegree[s]++
  }

  // 所有入度为 0 的节点先入队
  const queue: number[] = []
  for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) queue.push(i)
  }

  const order: number[] = []
  let head = 0
  while (head < queue.length) {
    const cur = queue[head++]
    order.push(cur)
    for (const next of adj[cur]) {
      inDegree[next]--
      if (inDegree[next] === 0) queue.push(next)
    }
  }

  if (order.length !== n) return '-1' // 存在循环依赖
  return order.join(' ')
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },
  'kama-1047': {
    desc: `科学大会在城市 n 举办，你从城市 1 出发前往参会。地图上有 n 座城市和 m 条单向公路，经过每条公路需要一定时间（时间均为正数）。请计算从城市 1 到城市 n 的最短时间；若无法到达，输出 -1。

输入：第一行两个整数 n, m（2 <= n <= 100，1 <= m <= 2000）；接下来 m 行，每行三个整数 s, e, v，表示一条从城市 s 到城市 e 的单向公路，耗时 v。

输出：一行一个整数，从城市 1 到城市 n 的最短时间；不可达输出 -1。

**示例 1：**
- 输入：
~~~
4 4
1 2 1
2 3 2
3 4 3
1 4 10
~~~
- 输出：
~~~
6
~~~
- 解释：路径 1 -> 2 -> 3 -> 4 的总耗时为 1 + 2 + 3 = 6，比直达公路的 10 更短。`,
    analysis: `### 核心思路
这是经典的**非负权单源最短路**问题，标准解法是 Dijkstra 算法。朴素版的思想：把节点分成「已确定最短路」和「未确定」两组，用 minDist[i] 记录当前源点到 i 的最短距离。每一轮从未确定组中挑出 minDist 最小的节点 cur——由于所有边权非负，任何经过其他未确定节点绕到 cur 的路径都不可能更短，所以 cur 的距离就此敲定；随后用 cur 松弛它的所有出边。重复 n 轮，全部节点距离确定。

> Dijkstra 的贪心前提依赖「边权非负」。一旦出现负权边，被绕路的路径可能更短，贪心就失效了，需要改用 Bellman_ford 系列（见城市间货物运输三题）。

### 算法步骤
1. 用邻接矩阵建有向图，重边取最小权值。
2. minDist 全部初始化为无穷大，minDist[1] = 0；visited 数组标记已确定节点。
3. 重复 n 轮：在未确定节点中选出 minDist 最小的节点 cur，标记 visited。
4. 用 cur 松弛出边：若 minDist[cur] + grid[cur][v] < minDist[v]，更新 minDist[v]。
5. 结束后若 minDist[n] 仍为无穷大输出 -1，否则输出 minDist[n]。

### 易错点
- 「先选最小、再松弛」的顺序不能颠倒；松弛时跳过已确定节点不影响正确性，因为它们的距离不会再变小。
- 判断不可达要用 minDist[n] 是否等于无穷大，不能拿它与 0 比较。
- 本题是单向公路，只建一条有向边；若题意改为双向，需要正反两条边都建。
- 朴素版复杂度 O(n^2) 适合 n 在几千以内；n 更大时应改用堆优化的 Dijkstra。

### 复杂度分析
- 时间复杂度：O(n^2)，n 轮选择最小值，每轮松弛一行邻接矩阵。
- 空间复杂度：O(n^2)，邻接矩阵；若改邻接表为 O(n + m)。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const header = lines[idx++].split(' ')
  const n = parseInt(header[0])
  const m = parseInt(header[1])
  const MAX = Infinity
  const grid: number[][] = []
  for (let i = 0; i <= n; i++) {
    grid.push(new Array(n + 1).fill(MAX))
  }
  for (let i = 0; i < m; i++) {
    const parts = lines[idx++].split(' ')
    const s = parseInt(parts[0])
    const e = parseInt(parts[1])
    const v = parseInt(parts[2])
    grid[s][e] = Math.min(grid[s][e], v) // 单向公路
  }

  const minDist: number[] = new Array(n + 1).fill(MAX)
  const visited: boolean[] = new Array(n + 1).fill(false)
  minDist[1] = 0
  for (let round = 1; round <= n; round++) {
    // 选出未确定节点中 minDist 最小者
    let cur = -1
    let minVal = MAX
    for (let v = 1; v <= n; v++) {
      if (!visited[v] && minDist[v] < minVal) {
        minVal = minDist[v]
        cur = v
      }
    }
    if (cur === -1) break
    visited[cur] = true
    // 用 cur 松弛其所有出边
    for (let v = 1; v <= n; v++) {
      if (grid[cur][v] !== MAX && minDist[cur] + grid[cur][v] < minDist[v]) {
        minDist[v] = minDist[cur] + grid[cur][v]
      }
    }
  }
  return minDist[n] === MAX ? '-1' : String(minDist[n])
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },
  'kama-1152': {
    desc: `某物流公司要在城市间运输货物。地图上有 n 座城市（编号 1 到 n）和 m 条单向航线，每条航线有运输费用，费用可能为负（例如有补贴的线路）。请计算从城市 1 把货物运到城市 n 的最小费用。题目保证图中不存在负权回路。

输入：第一行两个整数 n, m；接下来 m 行，每行三个整数 s, t, v，表示一条从城市 s 到城市 t 的单向航线，费用为 v（v 可能为负）。

输出：一行，最小运输费用；若城市 n 不可达，输出 unconnected。

**示例 1：**
- 输入：
~~~
5 5
1 2 -1
2 5 2
1 3 4
3 5 3
2 4 2
~~~
- 输出：
~~~
1
~~~
- 解释：路线 1 -> 2 -> 5 的费用为 -1 + 2 = 1，优于 1 -> 3 -> 5 的 4 + 3 = 7。`,
    analysis: `### 核心思路
带负权边的单源最短路，Dijkstra 的贪心不再成立，标准武器是 **Bellman_ford 算法**。它的理论基础是：无负环时，最短路最多包含 n - 1 条边（路径不会重复经过节点）。因此对所有边执行 n - 1 轮松弛即可：第 i 轮结束后，minDist[t] 表示「从源点最多经过 i 条边」到 t 的最短路。每一轮遍历全部 m 条边 (s, t, v)，若 minDist[s] + v < minDist[t] 就更新 minDist[t]，这个操作叫「松弛」。

> Bellman_ford 不挑节点、不依赖贪心，老老实实把每条边都松弛 n - 1 轮，负权边自然被处理。它的时间复杂度 O(n * m) 比 Dijkstra 高，但换来的是对负权的完全兼容。

### 算法步骤
1. 把所有边存入边集数组；minDist 初始化为无穷大，minDist[1] = 0。
2. 外层循环 n - 1 轮，每轮遍历所有边 (s, t, v)，若 minDist[s] 已确定且 minDist[s] + v < minDist[t]，更新 minDist[t]。
3. 全部轮次结束后，若 minDist[n] 仍为无穷大，输出 unconnected；否则输出 minDist[n]。

### 易错点
- 判断不可达用 minDist[n] 是否仍为无穷大，不能用「小于 0」或「等于 0」之类的判断，负权下距离可以是任意负数。
- 松弛前要确认 minDist[s] 不是无穷大，否则无穷大加负权虽然数值上无害，但语义上是从「不可达」节点出发的无效松弛，显式判断更清晰。
- n - 1 轮是理论上界，若某一轮没有任何边被更新，可以提前结束，这是一个不影响正确性的小优化。
- 本题保证无负环，所以不需要判环；一旦允许负环，就要像下一题那样多跑一轮检测。

### 复杂度分析
- 时间复杂度：O(n * m)，n - 1 轮全量松弛。
- 空间复杂度：O(n + m)，minDist 数组与边集。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const header = lines[idx++].split(' ')
  const n = parseInt(header[0])
  const m = parseInt(header[1])
  const edges: number[][] = []
  for (let i = 0; i < m; i++) {
    const parts = lines[idx++].split(' ')
    edges.push([parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])])
  }

  const minDist: number[] = new Array(n + 1).fill(Infinity)
  minDist[1] = 0
  // 无负环时最短路最多 n - 1 条边，松弛 n - 1 轮
  for (let round = 1; round < n; round++) {
    for (const e of edges) {
      const s = e[0]
      const t = e[1]
      const v = e[2]
      if (minDist[s] !== Infinity && minDist[s] + v < minDist[t]) {
        minDist[t] = minDist[s] + v
      }
    }
  }
  return minDist[n] === Infinity ? 'unconnected' : String(minDist[n])
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },
  'kama-1153': {
    desc: `在城市间货物运输 I 的基础上，公路网中可能出现**负权回路**（沿回路绕行一圈费用之和为负）。若存在从城市 1 出发可达的负权回路，运费可以被无限降低，此时输出 circle；否则输出从城市 1 到城市 n 的最小费用；若城市 n 不可达，输出 unconnected。

输入：第一行两个整数 n, m；接下来 m 行，每行三个整数 s, t, v，表示一条从城市 s 到城市 t 的单向航线，费用为 v（v 可能为负）。

输出：一行，circle、unconnected 或最小费用，三者之一。

**示例 1：**
- 输入：
~~~
4 4
1 2 1
2 3 -3
3 2 -2
2 4 5
~~~
- 输出：
~~~
circle
~~~
- 解释：回路 2 -> 3 -> 2 的费用为 -3 + (-2) = -5，且从城市 1 可达，绕行次数越多费用越低，最小费用不存在。`,
    analysis: `### 核心思路
Bellman_ford 不仅能求最短路，还能**检测负环**。核心观察：无负环时，最短路最多 n - 1 条边，因此 n - 1 轮松弛后所有距离都不再变化；如果第 n 轮仍存在能被松弛的边，说明最短路还在被「继续绕圈缩短」，即存在**从源点可达**的负环。检测方法非常简单：在 n - 1 轮常规松弛之后，再多做一轮全量松弛，若仍有边被更新，输出 circle。

> 多出来的这一轮天然过滤了「与源点不连通的负环」：那些环上的节点 minDist 始终是无穷大，无穷大不会被有效松弛，所以只有从城市 1 可达的负环才会触发第 n 轮的更新，恰好符合题意。

### 算法步骤
1. 读入边集，minDist 初始化为无穷大，minDist[1] = 0。
2. 执行 n - 1 轮全量松弛，得到（可能的）最短路。
3. 追加第 n 轮松弛：若仍存在边 (s, t, v) 使 minDist[s] 已确定且 minDist[s] + v < minDist[t]，说明存在源点可达的负环，输出 circle。
4. 否则按普通情况处理：minDist[n] 为无穷大输出 unconnected，否则输出最小费用。

### 易错点
- 第 n 轮检测时必须要求 minDist[s] 已确定（非无穷大），把「不可达节点的无效松弛」排除在负环判定之外。
- 输出判断有优先级：先判 circle，再判 unconnected，最后输出数值，顺序不能乱。
- 松弛是「所有边、整轮整轮」进行的，只检查一条边更新与否不能下结论。
- 本题负环不一定出现在 1 到 n 的路径上，题目只要求判断「源点可达的负环是否存在」，不要画蛇添足去验证环与终点的位置关系。

### 复杂度分析
- 时间复杂度：O(n * m)，n - 1 轮松弛加 1 轮检测。
- 空间复杂度：O(n + m)，minDist 数组与边集。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const header = lines[idx++].split(' ')
  const n = parseInt(header[0])
  const m = parseInt(header[1])
  const edges: number[][] = []
  for (let i = 0; i < m; i++) {
    const parts = lines[idx++].split(' ')
    edges.push([parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])])
  }

  const minDist: number[] = new Array(n + 1).fill(Infinity)
  minDist[1] = 0
  // 常规 n - 1 轮松弛
  for (let round = 1; round < n; round++) {
    for (const e of edges) {
      const s = e[0]
      const t = e[1]
      const v = e[2]
      if (minDist[s] !== Infinity && minDist[s] + v < minDist[t]) {
        minDist[t] = minDist[s] + v
      }
    }
  }

  // 第 n 轮仍能松弛，说明存在从源点 1 可达的负环
  for (const e of edges) {
    const s = e[0]
    const t = e[1]
    const v = e[2]
    if (minDist[s] !== Infinity && minDist[s] + v < minDist[t]) {
      return 'circle'
    }
  }

  return minDist[n] === Infinity ? 'unconnected' : String(minDist[n])
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },
  'kama-1154': {
    desc: `在城市间货物运输的升级版中，货车从城市 1 出发前往城市 n，但合同规定**途中最多中转 k 个城市**（即路径最多包含 k + 1 条边）。公路网由 m 条单向航线组成，费用可能为负，但保证不存在负权回路。求满足中转限制的最小费用；若在该限制下无法到达城市 n，输出 unreachable。

输入：第一行两个整数 n, m；接下来 m 行，每行三个整数 s, t, v，表示一条从城市 s 到城市 t 的单向航线，费用为 v；最后一行一个整数 k，表示最多中转的城市数。

输出：一行，满足限制的最小费用；限制内不可达输出 unreachable。

**示例 1：**
- 输入：
~~~
4 4
1 2 1
2 3 1
3 4 1
1 4 10
1
~~~
- 输出：
~~~
10
~~~
- 解释：不受限制时最短费用为 3（路径 1 -> 2 -> 3 -> 4），但该路径中转了 2 个城市，超出限制；最多中转 1 个城市时只能走直达航线 1 -> 4，费用 10。`,
    analysis: `### 核心思路
这是 Bellman_ford 的经典变形：**限制路径边数的最短路**。回忆 Bellman_ford 的不变量——第 i 轮松弛结束后，minDist 表示「最多经过 i 条边」的最短路。最多中转 k 个城市等价于路径最多 k + 1 条边，所以只需要松弛 min(k + 1, n - 1) 轮，答案自然满足中转限制。

> 本题最关键的陷阱：每轮松弛必须基于**上一轮的 minDist 快照**（先复制再读旧值）。如果直接在原数组上边遍历边更新，同一轮里连续松弛会把 k + 1 条边的效果「串」到一轮之内，输出比真实答案更小的值，悄悄突破中转限制。上一题之所以能省略快照，是因为 n - 1 轮全量松弛后多串几步也不影响最短路边数上限；本题边数被严格限制，快照不可省略。

### 算法步骤
1. 读入边集与 k；minDist 初始化为无穷大，minDist[1] = 0。
2. 令 rounds = min(k + 1, n - 1)：超过 n - 1 条边的路径必然重复经过节点，无需多跑。
3. 每轮先把 minDist 复制为 snapshot，然后遍历所有边 (s, t, v)，若 snapshot[s] 已确定且 snapshot[s] + v < minDist[t]，更新 minDist[t]。
4. 结束后 minDist[n] 为无穷大输出 unreachable，否则输出最小费用。

### 易错点
- 忘记用上一轮快照是本题最典型的错误，且输出偏小不容易肉眼发现，务必养成「限制边数必用快照」的意识。
- 轮数是 k + 1 而不是 k：中转 k 个城市对应最多 k + 1 条边，同时与 n - 1 取较小值，避免 k 很大时做无用功。
- 不可达判断仍是 minDist[n] 是否为无穷大，负权费用不影响这个判断。
- 读入时注意最后一行才是 k，别把边和 k 的读取顺序搞混。

### 复杂度分析
- 时间复杂度：O(k * m)，轮数由中转限制决定，k 较小时远优于 O(n * m)。
- 空间复杂度：O(n + m)，minDist 及其快照与边集。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const header = lines[idx++].split(' ')
  const n = parseInt(header[0])
  const m = parseInt(header[1])
  const edges: number[][] = []
  for (let i = 0; i < m; i++) {
    const parts = lines[idx++].split(' ')
    edges.push([parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])])
  }
  const k = parseInt(lines[idx++]) // 最多中转 k 个城市

  const minDist: number[] = new Array(n + 1).fill(Infinity)
  minDist[1] = 0
  // 最多中转 k 个城市 => 最多 k + 1 条边，超过 n - 1 条边无意义
  const rounds = Math.min(k + 1, n - 1)
  for (let round = 0; round < rounds; round++) {
    // 基于上一轮快照松弛，保证本轮结果只用到最多 round + 1 条边
    const snapshot = minDist.slice()
    for (const e of edges) {
      const s = e[0]
      const t = e[1]
      const v = e[2]
      if (snapshot[s] !== Infinity && snapshot[s] + v < minDist[t]) {
        minDist[t] = snapshot[s] + v
      }
    }
  }
  return minDist[n] === Infinity ? 'unreachable' : String(minDist[n])
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },
  'kama-1155': {
    desc: `公园里有 n 个景点（编号 1 到 n），景点之间由 m 条单向道路连接，走每条道路需要消耗一定体力，消耗可能为负（比如下坡省力），题目保证图中不存在负权回路。小明提前规划了 q 条游览路线，每条路线想知道从景点 x 走到景点 y 的最小体力消耗。请对每个查询分别输出答案；若 x 无法走到 y，输出 -1。

输入：第一行三个整数 n, m, q（2 <= n <= 100）；接下来 m 行，每行三个整数 u, v, w，表示一条从景点 u 到景点 v 的单向道路，消耗 w；接下来 q 行，每行两个整数 x, y，表示一次查询。

输出：共 q 行，每行一个整数，对应查询的最小消耗；不可达输出 -1。

**示例 1：**
- 输入：
~~~
4 4 2
1 2 1
2 3 2
1 3 5
3 4 1
1 4
2 4
~~~
- 输出：
~~~
4
3
~~~
- 解释：1 -> 2 -> 3 -> 4 消耗 1 + 2 + 1 = 4，优于 1 -> 3 -> 4 的 5 + 1 = 6；2 到 4 的消耗为 2 + 1 = 3。`,
    analysis: `### 核心思路
一次计算就能回答「任意两点间的最短路」，这正是 **Floyd 算法**的舞台。Floyd 是多源最短路的动态规划：设 dp[k][i][j] 表示「只允许经过编号不超过 k 的节点中转」时 i 到 j 的最短路。转移只有两种选择：不经过 k，继承 dp[k - 1][i][j]；经过 k，则 dp[k - 1][i][k] + dp[k - 1][k][j]。第一维可以滚动压缩掉，于是得到经典三重循环：**最外层枚举中转点 k**，内两层枚举起点 i 与终点 j，做松弛 dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])。

> Floyd 天然支持负权边（只要无负环），一次 O(n^3) 的计算换来 O(1) 的任意查询。查询次数多、规模不大时，它比「每个源点跑一遍 Dijkstra」划算得多。

若把本题推广到可能有负环的场景，可以用 Floyd 顺带检测：算法结束后若 dist[i][i] < 0，说明节点 i 位于某个负环上，凡是以它为中转可缩短的路径，答案都趋于负无穷。本题保证无负环，因此直接输出矩阵值即可。

### 算法步骤
1. 初始化 dist：dist[i][i] = 0，其余为无穷大；每条边用 dist[u][v] = min(dist[u][v], w) 写入，自动处理重边。
2. 三重循环：k 从 1 到 n、i 从 1 到 n、j 从 1 到 n，若 dist[i][k] 与 dist[k][j] 均已确定且 dist[i][k] + dist[k][j] < dist[i][j]，更新 dist[i][j]。
3. 对每个查询 (x, y)，dist[x][y] 为无穷大则输出 -1，否则输出该值，多行结果最后统一拼接输出。

### 易错点
- **k 必须放最外层循环**：dp 的语义是「只允许不超过 k 的点中转」，k 放内层会让同一层的更新结果被同层复用，破坏递推的正确性，这是 Floyd 最著名的坑。
- 松弛前判断 dist[i][k] 与 dist[k][j] 不是无穷大，避免「无穷大加负数仍小于无穷大」造成的虚假更新。
- 有向图只建单向边；重边取最小；初始化 dist[i][i] = 0 别遗漏。
- q 个查询结果拼成一个字符串一次输出，比逐个打印更稳。

### 复杂度分析
- 时间复杂度：O(n^3) 建表，每次查询 O(1)，总计 O(n^3 + q)。
- 空间复杂度：O(n^2)，距离矩阵。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const header = lines[idx++].split(' ')
  const n = parseInt(header[0])
  const m = parseInt(header[1])
  const q = parseInt(header[2])
  const INF = 1000000000
  const dist: number[][] = []
  for (let i = 0; i <= n; i++) {
    const row: number[] = new Array(n + 1).fill(INF)
    row[i] = 0
    dist.push(row)
  }
  for (let i = 0; i < m; i++) {
    const parts = lines[idx++].split(' ')
    const u = parseInt(parts[0])
    const v = parseInt(parts[1])
    const w = parseInt(parts[2])
    if (w < dist[u][v]) dist[u][v] = w // 重边取最小
  }

  // 中转点 k 必须放最外层
  for (let k = 1; k <= n; k++) {
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= n; j++) {
        if (dist[i][k] !== INF && dist[k][j] !== INF && dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j]
        }
      }
    }
  }

  const res: string[] = []
  for (let i = 0; i < q; i++) {
    const parts = lines[idx++].split(' ')
    const x = parseInt(parts[0])
    const y = parseInt(parts[1])
    res.push(dist[x][y] === INF ? '-1' : String(dist[x][y]))
  }
  return res.join('\\n')
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },
  'kama-1203': {
    desc: `在 n * n 的国际象棋棋盘上，一个骑士从起点 (startx, starty) 出发，要走到终点 (endx, endy)。骑士每一步按「日」字跳跃，共 8 个方向，棋盘坐标从 1 开始。请输出骑士从起点走到终点所需的最少步数。

输入：第一行一个整数 n（1 <= n <= 1000），表示棋盘大小；第二行四个整数 startx, starty, endx, endy，分别表示起点与终点的坐标。

输出：一行一个整数，最少步数。

**示例 1：**
- 输入：
~~~
100
1 1
5 5
~~~
- 输出：
~~~
4
~~~
- 解释：一条 4 步路径为 (1,1) -> (3,2) -> (4,4) -> (6,3) -> (5,5)，可以证明不存在步数更少的走法。`,
    analysis: `### 核心思路
求棋盘上骑士的最少步数，本质是无权图最短路，普通 BFS 就能做，但棋盘最大 1000 * 1000，BFS 会向四周无差别扩散大量节点。**A\* 算法**在 BFS 上加了一个启发函数：为每个状态维护 g（起点到当前的实际步数）和 h（当前到终点的估计步数），以 f = g + h 作为优先级，每次从优先队列取出 f 最小的节点扩展。h 越贴近真实剩余步数，搜索越有方向性，扩展节点数越少。

> 启发函数的选择：骑士跳跃方向多变，常用欧氏距离的平方 h = (x - endx)^2 + (y - endy)^2，纯整数运算避免开根号。理想情况下 h 应「不高估」真实剩余步数（可采纳性），才能严格保证首次弹出终点即最优；本题棋盘无障碍、边权全为 1，实践中该启发函数能正确得到最短步数。

### 算法步骤
1. 定义 8 个马步偏移量：(正负 1, 正负 2) 与 (正负 2, 正负 1) 的全部组合。
2. 启发函数 h(x, y) = (x - endx)^2 + (y - endy)^2。
3. 用手写小顶堆作优先队列，元素为 [f, g, x, y]；起点以 f = h(start) 入堆并标记 visited。
4. 出队节点，若是终点直接返回其 g；否则枚举 8 个方向，界内且未访问的格子计算 f = g + 1 + h 入堆，并入堆时标记 visited。
5. 队列空仍未到达终点，输出 -1。

### 易错点
- visited 要在**入堆时**标记而不是出堆时，否则同一格子会被反复入堆，队列规模爆炸。
- 坐标从 1 开始，越界判断是 nx 在 [1, n] 且 ny 在 [1, n]，写 0 会漏掉第一行或第一列。
- 马步 8 个方向一个都不能少，负方向偏移最容易被漏写。
- 起点与终点重合时应输出 0，A* 首次出队即命中，代码自然覆盖，无需特判。

### 复杂度分析
- 时间复杂度：O(k log k)，k 为实际扩展节点数，远小于 n^2；最坏情况 O(n^2 log n)。
- 空间复杂度：O(n^2)，visited 数组与优先队列。`,
    code: `function solve(lines: string[]): string {
  const n = parseInt(lines[0])
  const parts = lines[1].split(' ')
  const startX = parseInt(parts[0])
  const startY = parseInt(parts[1])
  const endX = parseInt(parts[2])
  const endY = parseInt(parts[3])

  const dirs: number[][] = [
    [1, 2], [2, 1], [-1, 2], [-2, 1],
    [1, -2], [2, -1], [-1, -2], [-2, -1]
  ]
  // 启发函数：欧氏距离的平方，整数运算
  const h = (x: number, y: number): number => {
    const dx = x - endX
    const dy = y - endY
    return dx * dx + dy * dy
  }

  // 手写小顶堆，元素为 [f, g, x, y]，按 f 排序
  const heap: number[][] = []
  const push = (node: number[]): void => {
    heap.push(node)
    let i = heap.length - 1
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (heap[parent][0] <= heap[i][0]) break
      const tmp = heap[parent]
      heap[parent] = heap[i]
      heap[i] = tmp
      i = parent
    }
  }
  const pop = (): number[] => {
    const top = heap[0]
    const last = heap.pop() as number[]
    if (heap.length > 0) {
      heap[0] = last
      let i = 0
      for (;;) {
        const l = 2 * i + 1
        const r = 2 * i + 2
        let smallest = i
        if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l
        if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r
        if (smallest === i) break
        const tmp = heap[i]
        heap[i] = heap[smallest]
        heap[smallest] = tmp
        i = smallest
      }
    }
    return top
  }

  const visited: boolean[][] = []
  for (let i = 0; i <= n; i++) visited.push(new Array(n + 1).fill(false))

  push([h(startX, startY), 0, startX, startY])
  visited[startX][startY] = true
  while (heap.length > 0) {
    const cur = pop()
    const g = cur[1]
    const x = cur[2]
    const y = cur[3]
    if (x === endX && y === endY) return String(g)
    for (const d of dirs) {
      const nx = x + d[0]
      const ny = y + d[1]
      if (nx < 1 || nx > n || ny < 1 || ny > n || visited[nx][ny]) continue
      visited[nx][ny] = true // 入堆时标记，防止重复入堆
      push([g + 1 + h(nx, ny), g + 1, nx, ny])
    }
  }
  return '-1'
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  }
}

export default solutions
