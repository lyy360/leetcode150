import type { Solution } from './types'

const solutions: Record<string, Solution> = {
  'kama-1170': {
    desc: `给定一个有 n 个节点的有向无环图，节点编号从 1 到 n，请找出并返回**所有**从节点 1 到节点 n 的路径。每条路径以节点编号列表的形式表示，节点之间用空格隔开，每条路径独占一行，多条路径的输出顺序任意；如果不存在任何一条路径，则输出 -1。

**输入格式：**第一行包含两个整数 N 和 M，表示图中拥有 N 个节点、M 条边；后续 M 行，每行包含两个整数 s 和 t，表示节点 s 有一条有向边指向节点 t。

**示例 1：**

- 输入：
~~~
5 5
1 3
3 5
1 2
2 4
4 5
~~~
- 输出：
~~~
1 3 5
1 2 4 5
~~~
- 解释：从节点 1 到节点 5 的路径有两条，分别是 1 -> 3 -> 5 和 1 -> 2 -> 4 -> 5，两种输出顺序均算正确。`,
    analysis: `### 核心思路
这是图论深搜的第一道题，本质上是在搜索树上找从根到目标的所有叶子路径。把图存成邻接表，从节点 1 出发做 DFS，用 path 记录当前走过的节点，一旦走到节点 n 就把 path 收进结果集，然后**回溯**继续探索其他分支。

### 算法步骤
1. 建图：把 M 条边加入邻接表，节点编号从 1 开始，数组要开 n + 1 的大小。
2. path 先放入起点 1，从节点 1 开始调用 dfs。
3. dfs(x) 中：若 x 恰好是 n，说明找到一条完整路径，把 path 拷贝一份存进结果集并返回。
4. 否则遍历 x 的所有邻接点 v：把 v 加入 path，递归 dfs(v)，递归返回后把 v 弹出，完成回溯。
5. 结果集为空输出 -1，否则逐行输出每条路径。

### 易错点
- 必须回溯：进入邻接点前 push，递归结束后 pop，否则 path 会一直累积，后续路径全部错误。
- 本题要求输出**所有**路径，且图是有向无环图，所以不需要 visited 数组；若题目换成有环图，就必须加 visited 防止绕环死循环。
> 记住深搜三部曲：确认递归函数与参数、确认终止条件、确认单层搜索逻辑，本题就是这套流程的最小样例。
- 输出格式：每条路径最后一个节点后面**没有空格**，用 join 拼接而不是循环打印，避免行尾多出空格被判错。

### 复杂度分析
- 时间复杂度：建图 O(M)；搜索过程与路径总数成正比，最坏是指数级，但本题 n <= 100、M <= 500 且无环，实际规模很小，可以放心搜索。
- 空间复杂度：O(n + M)，邻接表与递归栈、path 的开销。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const n = parseInt(lines[idx++])
  const m = parseInt(lines[idx++])
  const graph: number[][] = []
  for (let i = 0; i <= n; i++) graph.push([])
  for (let i = 0; i < m; i++) {
    const s = parseInt(lines[idx++])
    const t = parseInt(lines[idx++])
    graph[s].push(t)
  }
  const path: number[] = [1]
  const results: string[] = []
  const dfs = (x: number): void => {
    if (x === n) {
      results.push(path.join(' '))
      return
    }
    for (const v of graph[x]) {
      path.push(v)
      dfs(v)
      path.pop()
    }
  }
  dfs(1)
  return results.length === 0 ? '-1' : results.join('\\n')
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },

  'kama-1171': {
    desc: `给定一个由 1（陆地）和 0（水）组成的矩阵，计算岛屿的数量。岛屿由水平方向或垂直方向上相邻的陆地连接而成，并且四周都是水，矩阵外均被水包围。输出一个整数表示岛屿的数量，不存在岛屿时输出 0。

**输入格式：**第一行包含两个整数 N 和 M，表示矩阵的行数和列数；后续 N 行，每行包含 M 个数字（1 或 0）。

**示例 1：**

- 输入：
~~~
4 5
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1
~~~
- 输出：
~~~
3
~~~
- 解释：左上角的 2 * 2 陆地是一块岛屿，中心单独的 1 是一块岛屿，右下角相连的两个 1 是一块岛屿，共 3 个岛屿。`,
    analysis: `### 核心思路
求连通块个数：把每个陆地格子看作图中的节点，上下左右相邻的陆地之间有边。遍历矩阵的每个格子，遇到一块**还没被访问过**的陆地，就从它出发做一次 DFS（或 BFS），把整个连通块标记为已访问，同时计数器加一。一个岛只会被「发现」一次，所以发现次数就是岛屿数量。

### 算法步骤
1. 读入 N、M 与矩阵 grid，准备同尺寸的 visited 数组，count 置 0。
2. 双重循环扫描所有格子。
3. 当 grid[i][j] 为 1 且 visited[i][j] 为 false 时，count 加一，并从 (i, j) 出发 DFS。
4. dfs(x, y)：先把当前格子标记 visited，再用方向数组向四个方向扩展，凡是界内、是陆地且未访问的格子继续递归。
5. 扫描结束后输出 count。

### 易错点
- 标记时机：进入格子时立刻标记 visited（或直接把 grid 置 0），一定要放在递归扩展**之前**，否则同一个格子会被反复访问导致死循环。
- 用方向数组统一处理上下左右四个方向，避免写四遍重复代码。
- 写 BFS 的同学注意：入队时就标记，不要等出队才标记，否则同一格子可能重复入队。
> 岛屿系列的每道题都建立在这个「发现新岛就整体标记」的框架上，务必把本题写熟。
- 数据范围 n、m 均不超过 50，递归 DFS 不会爆栈，可以放心使用递归写法。

### 复杂度分析
- 时间复杂度：O(n * m)，每个格子最多被访问常数次。
- 空间复杂度：O(n * m)，来自 visited 数组与最坏情况下的递归栈。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const n = parseInt(lines[idx++])
  const m = parseInt(lines[idx++])
  const grid: number[][] = []
  for (let i = 0; i < n; i++) {
    grid.push(lines[idx++].trim().split(/\\s+/).map(Number))
  }
  const visited: boolean[][] = Array.from({ length: n }, () => new Array(m).fill(false))
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
  const dfs = (x: number, y: number): void => {
    visited[x][y] = true
    for (const d of dirs) {
      const nx = x + d[0]
      const ny = y + d[1]
      if (nx >= 0 && nx < n && ny >= 0 && ny < m && !visited[nx][ny] && grid[nx][ny] === 1) {
        dfs(nx, ny)
      }
    }
  }
  let count = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        count++
        dfs(i, j)
      }
    }
  }
  return String(count)
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },

  'kama-1172': {
    desc: `给定一个由 1（陆地）和 0（水）组成的矩阵，计算岛屿的最大面积。岛屿面积等于组成岛屿的陆地格子总数，岛屿由水平或垂直方向上相邻的陆地连接而成，四周都是水，矩阵外均被水包围。输出最大岛屿的面积，不存在岛屿时输出 0。

**输入格式：**第一行包含两个整数 N 和 M，表示矩阵的行数和列数；后续 N 行，每行包含 M 个数字（1 或 0）。

**示例 1：**

- 输入：
~~~
4 5
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1
~~~
- 输出：
~~~
4
~~~
- 解释：矩阵中的岛屿面积分别为 4、1、2，最大岛屿面积为 4。`,
    analysis: `### 核心思路
与「计数孤岛」同源，只是每次发现新岛屿时多统计一个面积：DFS 标记整个连通块的过程中，每访问一个新陆地格子就把计数加一，一个连通块搜索结束时就能得到它的面积，用全局变量维护最大值即可。

### 算法步骤
1. 读入矩阵，准备 visited 数组，ans 置 0。
2. 双重循环扫描所有格子，遇到未访问的陆地时启动一次 DFS，本轮计数 cnt 从 0 开始。
3. dfs(x, y)：标记 visited[x][y]，cnt 加一，再用方向数组向四方向递归扩展未访问的陆地格子。
4. 一次 DFS 结束后，用 ans 取 cnt 与 ans 的较大值。
5. 全部扫描完毕输出 ans。

### 易错点
- cnt 是本题唯一的增量逻辑：可以在 dfs 内部累加全局计数，也可以让 dfs 返回「1 + 四个子方向的面积之和」，两种写法都要保证**进入格子时立刻标记**，否则会重复计数。
- 每次启动新的 DFS 之前，计数必须从 0 开始，避免把上一个岛的面积累加进来。
- 边界判断要同时检查坐标合法、未访问、是陆地三个条件，漏掉任何一个都会数组越界或死循环。
> 岛屿数量的代码只改三行就能变成最大面积：加一个计数器、DFS 里累加、外层取 max，这就是「一题多问」的模板复用。

### 复杂度分析
- 时间复杂度：O(n * m)，每个格子被访问常数次。
- 空间复杂度：O(n * m)，visited 数组与递归栈。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const n = parseInt(lines[idx++])
  const m = parseInt(lines[idx++])
  const grid: number[][] = []
  for (let i = 0; i < n; i++) {
    grid.push(lines[idx++].trim().split(/\\s+/).map(Number))
  }
  const visited: boolean[][] = Array.from({ length: n }, () => new Array(m).fill(false))
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
  const dfs = (x: number, y: number): number => {
    visited[x][y] = true
    let cnt = 1
    for (const d of dirs) {
      const nx = x + d[0]
      const ny = y + d[1]
      if (nx >= 0 && nx < n && ny >= 0 && ny < m && !visited[nx][ny] && grid[nx][ny] === 1) {
        cnt += dfs(nx, ny)
      }
    }
    return cnt
  }
  let ans = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        ans = Math.max(ans, dfs(i, j))
      }
    }
  }
  return String(ans)
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },

  'kama-1173': {
    desc: `给定一个由 1（陆地）和 0（水）组成的矩阵。孤岛是完全位于矩阵内部、所有格子都不接触矩阵边缘的岛屿。请计算所有孤岛的总面积（组成孤岛的陆地格子总数），不存在孤岛时输出 0。

**输入格式：**第一行包含两个整数 N 和 M，表示矩阵的行数和列数；后续 N 行，每行包含 M 个数字（1 或 0）。

**示例 1：**

- 输入：
~~~
4 5
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1
~~~
- 输出：
~~~
1
~~~
- 解释：左上角岛屿接触边缘、右下角岛屿接触边缘，只有中心单独的 1 完全不接触边缘，是孤岛，面积为 1。`,
    analysis: `### 核心思路
孤岛的判定只取决于「是否接触矩阵边缘」，所以本题的关键是**反向思考**：与其判断哪些岛是孤岛，不如先把不可能是孤岛的陆地清除掉。从矩阵四条边上的每个陆地格子出发 DFS，把能到达的陆地全部沉没（置 0），剩下的陆地一定全是孤岛，最后数一遍格子即可。

### 算法步骤
1. 依次遍历第一行、最后一行、第一列、最后一列的每个格子。
2. 遇到值为 1 的格子就从这个格子出发 DFS，把整个连通块的 1 全部改成 0——这些岛屿都接触边缘，不是孤岛。
3. 清理完成后，再次双重循环扫描矩阵，直接累加剩余 1 的个数，即孤岛总面积。
4. 输出总和。

### 易错点
- 四条边界都要扫，漏掉任何一条边都会把贴边岛屿误判成孤岛。
- 边界 DFS 里先置 0 再递归扩展，用 grid 本身充当 visited，省掉额外数组。
> 「先把边界连通块处理掉，再统计内部」是处理孤岛类题目的万能套路，后面的沉没孤岛用的也是它。
- 第二遍统计时不需要再 DFS：孤岛之间互不相邻，直接数 1 的个数就等于数面积。

### 复杂度分析
- 时间复杂度：O(n * m)，两遍扫描加上边界 DFS，每个格子被处理常数次。
- 空间复杂度：O(n * m)，最坏情况下（整张图都是陆地）递归栈深度达到 n * m。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const n = parseInt(lines[idx++])
  const m = parseInt(lines[idx++])
  const grid: number[][] = []
  for (let i = 0; i < n; i++) {
    grid.push(lines[idx++].trim().split(/\\s+/).map(Number))
  }
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
  const dfs = (x: number, y: number): void => {
    if (x < 0 || x >= n || y < 0 || y >= m || grid[x][y] === 0) return
    grid[x][y] = 0
    for (const d of dirs) {
      dfs(x + d[0], y + d[1])
    }
  }
  for (let i = 0; i < n; i++) {
    if (grid[i][0] === 1) dfs(i, 0)
    if (grid[i][m - 1] === 1) dfs(i, m - 1)
  }
  for (let j = 0; j < m; j++) {
    if (grid[0][j] === 1) dfs(0, j)
    if (grid[n - 1][j] === 1) dfs(n - 1, j)
  }
  let total = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      total += grid[i][j]
    }
  }
  return String(total)
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },

  'kama-1174': {
    desc: `给定一个由 1（陆地）和 0（水）组成的矩阵。孤岛是完全位于矩阵内部、所有格子都不接触矩阵边缘的岛屿。请将所有孤岛沉没——把孤岛中的所有陆地格子从 1 变成 0，然后输出沉没之后的矩阵。

**输入格式：**第一行包含两个整数 N 和 M，表示矩阵的行数和列数；后续 N 行，每行包含 M 个数字（1 或 0）。

**输出格式：**输出沉没孤岛后的矩阵，注意每个元素后面都有一个空格。

**示例 1：**

- 输入：
~~~
4 5
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1
~~~
- 输出：
~~~
1 1 0 0 0
1 1 0 0 0
0 0 0 0 0
0 0 0 1 1
~~~
- 解释：左上角与右下角的岛屿都接触矩阵边缘，予以保留；中心单独的 1 是孤岛，被沉没为 0。`,
    analysis: `### 核心思路
与「孤岛的总面积」是同一套路，只是最后不数面积，而是把孤岛沉没后**输出矩阵**。难点在于沉没的只能是孤岛，贴边的非孤岛陆地必须原样保留，所以不能直接把边界连通块置 0，而是先标记成特殊值：从四条边界出发 DFS，把贴边岛屿整体标记为 2，之后扫描矩阵时 2 恢复成 1、1 改成 0。

### 算法步骤
1. 从第一行、最后一行、第一列、最后一列的每个陆地格子出发 DFS，把连通块里的 1 全部标记为 2（表示「接触边缘的陆地」）。
2. 双重循环遍历矩阵：值为 2 的恢复成 1，值仍为 1 的（孤岛）置 0。
3. 每行拼好字符串后加入输出数组，行与行之间用换行符连接返回。
4. 输出时每个元素后面跟一个空格，包括行尾。

### 易错点
- 标记值不能直接用 0：如果边界 DFS 时就把陆地改成 0，后面就无法区分「本来就是水」和「非孤岛陆地」了，恢复矩阵时会出错。
- 孤岛判定只看是否接触边缘，DFS 必须从**四条边界**启动，而不是从矩阵内部启动。
> 标记、恢复、再翻转，这套「借助第三种状态」的技巧在矩阵原地操作题里非常常用。
- 输出格式：本题明确要求每个元素后面都有一个空格，逐格拼接时别漏了行尾的空格。

### 复杂度分析
- 时间复杂度：O(n * m)，边界 DFS 与最终扫描各访问每个格子常数次。
- 空间复杂度：O(n * m)，最坏情况下递归栈深度为 n * m；原地标记省去了 visited 数组。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const n = parseInt(lines[idx++])
  const m = parseInt(lines[idx++])
  const grid: number[][] = []
  for (let i = 0; i < n; i++) {
    grid.push(lines[idx++].trim().split(/\\s+/).map(Number))
  }
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
  const dfs = (x: number, y: number): void => {
    if (x < 0 || x >= n || y < 0 || y >= m || grid[x][y] !== 1) return
    grid[x][y] = 2
    for (const d of dirs) {
      dfs(x + d[0], y + d[1])
    }
  }
  for (let i = 0; i < n; i++) {
    if (grid[i][0] === 1) dfs(i, 0)
    if (grid[i][m - 1] === 1) dfs(i, m - 1)
  }
  for (let j = 0; j < m; j++) {
    if (grid[0][j] === 1) dfs(0, j)
    if (grid[n - 1][j] === 1) dfs(n - 1, j)
  }
  const out: string[] = []
  for (let i = 0; i < n; i++) {
    let row = ''
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 2) {
        grid[i][j] = 1
      } else if (grid[i][j] === 1) {
        grid[i][j] = 0
      }
      row = row + grid[i][j] + ' '
    }
    out.push(row)
  }
  return out.join('\\n')
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },

  'kama-1175': {
    desc: `现有一个 N * M 的矩阵，每个单元格有一个数值代表该位置的相对高度。矩阵的左边界和上边界是第一组边界，右边界和下边界是第二组边界。雨水落在某格后会向相邻（上下左右）**不高**于当前位置的格子流动。请找出所有这样的格子：从它出发的水既可以流到第一组边界，也可以流到第二组边界，输出这些格子的坐标，顺序任意。

**输入格式：**第一行包含两个整数 N 和 M；后续 N 行，每行包含 M 个整数表示高度。

**示例 1：**

- 输入：
~~~
5 5
1 3 1 2 4
1 2 1 3 2
2 4 7 2 1
4 5 6 1 1
1 4 1 2 1
~~~
- 输出：
~~~
0 4
1 3
2 2
3 0
3 1
3 2
4 0
4 1
~~~
- 解释：以上 8 个格子上的雨水既能流向左边界或上边界，也能流向右边界或下边界，输出顺序任意。`,
    analysis: `### 核心思路
正向模拟「水往低处流」要从每个格子各搜一遍，复杂度太高。反过来想：水能从格子 a 流到格子 b，等价于从 b 出发沿「逆流」方向（走向更高或等高的格子）能到 a。于是只需两次 DFS：第一次从第一组边界（第 0 行、第 0 列）所有格子出发逆流，标记能到达的格子；第二次从第二组边界（最后一行、最后一列）出发再标记一次。**两组标记同时成立**的格子就是答案。

### 算法步骤
1. 准备两个布尔矩阵 first、second，分别记录两组边界逆流可达的格子。
2. 把第一组边界的所有格子作为起点 DFS，标记 first；把第二组边界的所有格子作为起点 DFS，标记 second。
3. dfs(x, y)：标记当前格子，向四方向扩展 (nx, ny)，扩展条件是界内、未标记，且 height[nx][ny] >= height[x][y]（逆流允许爬坡与等高）。
4. 扫描两个标记矩阵，同时为 true 的坐标按「行 列」输出。

### 易错点
- 逆流条件是 >= 而不是 >：等高的格子之间水可以流动，逆流自然也允许走等高格子。
- 起点是**整条边界**，不是四个角；两组边界在小矩阵上可能重叠，靠标记数组去重即可，重复 DFS 也只是常数开销。
> 正难则反：从结果出发倒着搜，把「每个点向边界」的 n 次搜索变成「边界向内」的两次搜索，这是本题最值得吸收的技巧。
- 不要对每个格子做正向 DFS，n、m 达到 100 时总复杂度会到四次方级别，容易超时。

### 复杂度分析
- 时间复杂度：O(n * m)，两组 DFS 各自最多访问每个格子一次，最后一次扫描也是 O(n * m)。
- 空间复杂度：O(n * m)，两个标记矩阵加递归栈。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const n = parseInt(lines[idx++])
  const m = parseInt(lines[idx++])
  const grid: number[][] = []
  for (let i = 0; i < n; i++) {
    grid.push(lines[idx++].trim().split(/\\s+/).map(Number))
  }
  const first: boolean[][] = Array.from({ length: n }, () => new Array(m).fill(false))
  const second: boolean[][] = Array.from({ length: n }, () => new Array(m).fill(false))
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
  const dfs = (x: number, y: number, mark: boolean[][]): void => {
    if (mark[x][y]) return
    mark[x][y] = true
    for (const d of dirs) {
      const nx = x + d[0]
      const ny = y + d[1]
      if (nx >= 0 && nx < n && ny >= 0 && ny < m && !mark[nx][ny] && grid[nx][ny] >= grid[x][y]) {
        dfs(nx, ny, mark)
      }
    }
  }
  for (let i = 0; i < n; i++) {
    dfs(i, 0, first)
    dfs(i, m - 1, second)
  }
  for (let j = 0; j < m; j++) {
    dfs(0, j, first)
    dfs(n - 1, j, second)
  }
  const out: string[] = []
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (first[i][j] && second[i][j]) {
        out.push(i + ' ' + j)
      }
    }
  }
  return out.join('\\n')
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },

  'kama-1176': {
    desc: `给定一个由 1（陆地）和 0（水）组成的矩阵，你最多可以将矩阵中的**一格水**变成陆地。操作之后，矩阵中最大的岛屿面积是多少？岛屿由水平或垂直方向上相邻的陆地连接而成，面积为陆地格子总数，矩阵外均被水包围。输出这个最大面积。

**输入格式：**第一行包含两个整数 N 和 M，表示矩阵的行数和列数；后续 N 行，每行包含 M 个数字（1 或 0）。

**示例 1：**

- 输入：
~~~
4 5
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1
~~~
- 输出：
~~~
6
~~~
- 解释：把 (1, 2) 或 (2, 1) 处的水变成陆地，可以把面积为 4 的岛屿与面积为 1 的岛屿连成面积为 6 的岛屿。`,
    analysis: `### 核心思路
如果对每一格水都重新搜一遍周围的岛，复杂度会爆炸。正确做法是**先编号、再枚举**：第一次 DFS 给每个岛屿打上唯一编号，同时用数组记录每个编号对应的面积；之后枚举每一格水，把四邻接的岛屿面积（去重后）加起来，再加 1（新填的陆地），更新答案。

### 算法步骤
1. 扫描矩阵，遇到未标记的陆地就把岛屿编号加一，从该格子 DFS，把整个连通块标记为这个编号，并累加该编号的面积。
2. 初始答案 ans 设为所有岛屿面积的最大值，用来覆盖「不需要填水」和「全是陆地」的情况。
3. 枚举每个值为 0 的格子，收集四方向邻接的岛屿编号到集合里去重。
4. 该格子填成陆地后的面积为 1 加上集合中各岛屿面积之和，用 ans 取较大值。
5. 输出 ans。

### 易错点
- 四邻接的可能是**同一个岛**：必须用集合对岛屿编号去重，否则同岛面积会被重复累加。
- 全陆地的边界情况：矩阵里没有 0 时，答案就是 n * m，把 ans 初始化为最大岛面积即可自动覆盖，不需要特判代码。
> 「岛屿编号 + 面积表」是这类带修改统计题的通用预处理套路，先 O(n * m) 打标，再 O(1) 查询每个决策的收益。
- 编号从 1 开始，用 0 表示「不是陆地」，方便判断与去重。

### 复杂度分析
- 时间复杂度：O(n * m)。编号 DFS 每格访问一次；枚举每格水只看四个邻接格，查询面积是 O(1)。
- 空间复杂度：O(n * m)，编号矩阵、面积表与递归栈。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const n = parseInt(lines[idx++])
  const m = parseInt(lines[idx++])
  const grid: number[][] = []
  for (let i = 0; i < n; i++) {
    grid.push(lines[idx++].trim().split(/\\s+/).map(Number))
  }
  const mark: number[][] = Array.from({ length: n }, () => new Array(m).fill(0))
  const area: number[] = [0]
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
  let id = 0
  const dfs = (x: number, y: number): void => {
    mark[x][y] = id
    area[id]++
    for (const d of dirs) {
      const nx = x + d[0]
      const ny = y + d[1]
      if (nx >= 0 && nx < n && ny >= 0 && ny < m && grid[nx][ny] === 1 && mark[nx][ny] === 0) {
        dfs(nx, ny)
      }
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1 && mark[i][j] === 0) {
        id++
        area.push(0)
        dfs(i, j)
      }
    }
  }
  let ans = 0
  for (let k = 1; k <= id; k++) {
    ans = Math.max(ans, area[k])
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 0) {
        const near = new Set<number>()
        let sum = 1
        for (const d of dirs) {
          const nx = i + d[0]
          const ny = j + d[1]
          if (nx >= 0 && nx < n && ny >= 0 && ny < m && grid[nx][ny] === 1 && !near.has(mark[nx][ny])) {
            near.add(mark[nx][ny])
            sum += area[mark[nx][ny]]
          }
        }
        ans = Math.max(ans, sum)
      }
    }
  }
  return String(ans)
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },

  'kama-1177': {
    desc: `给定一个有向图，包含 N 个节点，节点编号分别为 1, 2, ..., N。现从 1 号节点出发，如果沿着有向边可以到达任何节点，则输出 1，否则输出 -1。

**输入格式：**第一行包含两个正整数 N 和 K，分别表示节点数量和边的数量；后续 K 行，每行两个正整数 s 和 t，表示从 s 节点有一条有向边单向连接到 t 节点。

**示例 1：**

- 输入：
~~~
4 4
1 2
2 1
1 3
2 4
~~~
- 输出：
~~~
1
~~~
- 解释：从 1 号节点出发，可以直接到达 2、3，再经由 2 到达 4，所有节点均可达，输出 1。`,
    analysis: `### 核心思路
从 1 号点出发做一遍 DFS 或 BFS，统计能到达的节点个数：等于 N 就输出 1，否则输出 -1。唯一要当心的是**有向图只能沿边的方向走**，建图时只加一条单向边，不能顺手加反向边。

### 算法步骤
1. 建邻接表：读入 K 条边，graph[s] 中加入 t。
2. 准备 visited 数组，从节点 1 开始 BFS：起点入队并标记，count 置 1。
3. 出队 cur，遍历 cur 的每个邻接点 next，未标记的标记后入队，count 加一。
4. 搜索结束后，count 等于 N 输出 1，否则输出 -1。

### 易错点
- 有向图建图只加 graph[s].push(t)，无向图才加双向边，这是图论题最常见的笔误点。
- visited 在**入队时**就标记，出队再标记会导致同一节点重复入队，最坏退化成指数级。
> 本题其实是「连通块计数」的特例：从 1 出发的可达集合就是一个连通块，只需判断它是否覆盖了全部节点。
- 节点编号从 1 开始，邻接表与 visited 都要开 n + 1 的长度，避免下标 n 越界。

### 复杂度分析
- 时间复杂度：O(N + K)，每个节点进出队列一次，每条边被遍历一次。
- 空间复杂度：O(N + K)，邻接表、visited 与队列。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const n = parseInt(lines[idx++])
  const k = parseInt(lines[idx++])
  const graph: number[][] = []
  for (let i = 0; i <= n; i++) graph.push([])
  for (let i = 0; i < k; i++) {
    const s = parseInt(lines[idx++])
    const t = parseInt(lines[idx++])
    graph[s].push(t)
  }
  const visited: boolean[] = new Array(n + 1).fill(false)
  const queue: number[] = [1]
  visited[1] = true
  let count = 1
  let head = 0
  while (head < queue.length) {
    const cur = queue[head++]
    for (const next of graph[cur]) {
      if (!visited[next]) {
        visited[next] = true
        count++
        queue.push(next)
      }
    }
  }
  return count === n ? '1' : '-1'
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },

  'kama-1178': {
    desc: `给定一个由 1（陆地）和 0（水）组成的矩阵，矩阵中恰好有一个岛屿，且岛屿内部没有水域。岛屿由水平或垂直方向上相邻的陆地连接而成，矩阵外均被水包围。组成岛屿的每个陆地格子边长都为 1，请计算海岸线，即岛屿的周长，输出一个整数。

**输入格式：**第一行包含两个整数 N 和 M，表示矩阵的行数和列数；后续 N 行，每行包含 M 个数字（1 或 0）。

**示例 1：**

- 输入：
~~~
5 5
0 0 0 0 0
0 1 0 1 0
0 1 1 1 0
0 1 1 1 0
0 0 0 0 0
~~~
- 输出：
~~~
14
~~~
- 解释：陆地在 (1,1)、(1,3)、(2,1)、(2,2)、(2,3)、(3,1)、(3,2)、(3,3)，逐格累加暴露在水边的边长，周长为 14。`,
    analysis: `### 核心思路
周长就是陆地格子暴露在水边的边数总和。对每个陆地格子检查上下左右四个邻居：邻居是水（或坐标出界，即矩阵外也是水）就贡献 1 条边长，逐格累加就是海岸线。也可以从整体视角看：周长 = 4 * 陆地格数 - 2 * 陆地相邻边数，两种理解殊途同归，逐格检查的实现最直观。

### 算法步骤
1. 双重循环扫描矩阵，只处理值为 1 的格子。
2. 对每个陆地格子，用方向数组检查四方向邻居 (nx, ny)。
3. 若坐标出界或 grid[nx][ny] 为 0，说明这一面暴露在水边，周长加一。
4. 全部累加完成后输出周长。

### 易错点
- **出界也算临水**：陆地格子贴着矩阵边缘时，边缘之外的「矩阵外」同样是水，贡献周长，所以越界判断也要加一。
- 本题保证只有一个岛且内部没有水，不需要 DFS 标记连通块，也不需要 visited，直接逐格统计即可。
- 若改用 4 * count - 2 * adjacent 公式，注意相邻边会被两个格子各数一次，要乘 2 才是正确扣减量。

### 复杂度分析
- 时间复杂度：O(n * m)，每个格子只检查常数个邻居。
- 空间复杂度：O(1)，除输入矩阵外只用了常数个变量。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const n = parseInt(lines[idx++])
  const m = parseInt(lines[idx++])
  const grid: number[][] = []
  for (let i = 0; i < n; i++) {
    grid.push(lines[idx++].trim().split(/\\s+/).map(Number))
  }
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
  let perimeter = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1) {
        for (const d of dirs) {
          const nx = i + d[0]
          const ny = j + d[1]
          if (nx < 0 || nx >= n || ny < 0 || ny >= m || grid[nx][ny] === 0) {
            perimeter++
          }
        }
      }
    }
  }
  return String(perimeter)
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },

  'kama-1179': {
    desc: `给定一个包含 n 个节点的无向图，节点编号从 1 到 n。请判断是否存在一条从节点 source 出发到节点 destination 的路径：存在输出 1，不存在输出 0。

**输入格式：**第一行包含两个正整数 N 和 M，表示节点个数和边的个数；后续 M 行，每行两个正整数 s 和 t，表示节点 s 与节点 t 之间有一条无向边；最后一行包含两个正整数，表示起始节点 source 和目标节点 destination。

**示例 1：**

- 输入：
~~~
5 4
1 2
1 3
2 4
3 4
1 4
~~~
- 输出：
~~~
1
~~~
- 解释：节点 1 与节点 4 之间有边 1-2-4 相连，存在路径，输出 1。`,
    analysis: `### 核心思路
判断两点是否连通，不需要真的去搜路径：把每条边的两个端点并查集 union 起来，全部处理完后，source 和 destination 的根相同，就说明它们在同一个集合里，即存在路径。DFS/BFS 也能做，但并查集写起来更短，而且天然适合「多次查询两点是否连通」的场景。

### 算法步骤
1. 初始化 father 数组：father[i] = i，下标 1 到 n。
2. 依次读入 M 条边，对每条边 (s, t) 执行合并：先分别 find 出两者的根，根不同才把一个根挂到另一个根下面。
3. find(x) 用递归实现：father[x] 等于 x 直接返回 x，否则先递归 find(father[x])，再把结果直接挂到根上，顺带完成路径压缩。
4. 读入最后一行的 source 和 destination，两个 find 的结果相同输出 1，否则输出 0。

### 易错点
- 合并前必须先 find 比较根：写成 father[s] = t 只是把 s 挂到 t 下面，两个集合并没有真正合并，这是并查集最经典的错误。
- 本题是**无向图**，一条边只需 union 一次，find 天然双向可达，不用建两条边。
> 并查集三板斧：init 每个节点自成一个集合、find 找根并路径压缩、union 合并两个根，背熟这三段代码，连通性问题可以秒写。
- 输入的最后一行才是查询，按行读入时注意行数的对应关系，别把查询当成边处理。

### 复杂度分析
- 时间复杂度：O((N + M) * α(N))，α 为反阿克曼函数，可以视为常数；本题 N、M 不超过 100，随便实现都能通过。
- 空间复杂度：O(N)，father 数组与递归栈。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const n = parseInt(lines[idx++])
  const m = parseInt(lines[idx++])
  const father: number[] = []
  for (let i = 0; i <= n; i++) father.push(i)
  const find = (x: number): number => {
    if (father[x] === x) return x
    father[x] = find(father[x])
    return father[x]
  }
  for (let i = 0; i < m; i++) {
    const s = parseInt(lines[idx++])
    const t = parseInt(lines[idx++])
    const rs = find(s)
    const rt = find(t)
    if (rs !== rt) {
      father[rs] = rt
    }
  }
  const source = parseInt(lines[idx++])
  const dest = parseInt(lines[idx++])
  return find(source) === find(dest) ? '1' : '0'
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },

  'kama-1183': {
    desc: `字典 strList 中，从字符串 beginStr 到 endStr 的转换序列按如下规则形成：序列第一个字符串是 beginStr，最后一个字符串是 endStr；每次转换只能改变一个字符；转换过程中的中间字符串必须是字典 strList 中的字符串，且字典里的每个字符串只能使用一次。求从 beginStr 到 endStr 的最短转换序列中的字符串数目，不存在这样的序列时输出 0。

**输入格式：**第一行包含一个整数 N，表示字典中的字符串数量；第二行包含两个字符串 beginStr 和 endStr，用空格隔开；后续 N 行，每行一个字典字符串。

**示例 1：**

- 输入：
~~~
6
abc def
efc
dbc
ebc
dec
dfc
yhn
~~~
- 输出：
~~~
4
~~~
- 解释：最短的转换路径为 abc -> dbc -> dec -> def，序列中共 4 个字符串。`,
    analysis: `### 核心思路
把每个字符串看作图中的一个节点，两个字符串只差一个字符就连一条无向边，那么最短转换序列就是图中两点的**无权最短路径**，首选用 BFS 层层扩展：第一次碰到 endStr 时的层数就是答案。扩展时不必预先建边，直接枚举把当前位置替换成 a 到 z 的 26 种候选，能覆盖所有可能的一步转换。

### 算法步骤
1. 读入 N、beginStr、endStr 和字典，把字典放进 Set 方便 O(1) 查询。
2. BFS 队列初始放入 (beginStr, 1)，visited 集合先加入 beginStr，步数 1 表示序列中已有这一个字符串。
3. 出队一个状态 (word, steps)，对 word 的每个位置尝试替换成 26 个字母：
- 得到的串恰好等于 endStr：返回 steps + 1。
- 在字典中且未访问过：标记已访问并入队，步数为 steps + 1。
4. 队列空仍未碰到 endStr，输出 0。

### 易错点
- 已访问标记要在**入队时**打，出队才标记会让同一字符串重复入队，队列规模爆炸。
- 序列长度包含首尾两个字符串，所以 beginStr 的初始步数是 1，答案也无需再加一。
- endStr 本身**不在字典里也能是终点**：样例中的 def 就不在字典里，它只是目标，不受「中间字符串必须来自字典」的限制。
- 枚举替换字母时，替换结果等于原字符串的分支直接跳过即可，不影响正确性。
> 无权图最短路想 BFS 而不是 DFS：BFS 按层扩展，第一次到达终点时走过的层数天然就是最短距离。

### 复杂度分析
- 时间复杂度：O(N * 26 * L * L)，其中 L 是字符串长度：每个出队字符串生成 26 * L 个候选，每次候选比较与切片要 O(L)；N <= 500，规模很小。
- 空间复杂度：O(N * L)，字典、visited 集合与队列。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const n = parseInt(lines[idx++])
  const parts = lines[idx++].trim().split(/\\s+/)
  const beginStr = parts[0]
  const endStr = parts[1]
  const dict = new Set<string>()
  for (let i = 0; i < n; i++) {
    dict.add(lines[idx++].trim())
  }
  const visited = new Set<string>([beginStr])
  const queue: Array<[string, number]> = [[beginStr, 1]]
  let head = 0
  while (head < queue.length) {
    const cur = queue[head++]
    const word = cur[0]
    const steps = cur[1]
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const ch = String.fromCharCode(c)
        if (ch === word[i]) continue
        const next = word.slice(0, i) + ch + word.slice(i + 1)
        if (next === endStr) {
          return String(steps + 1)
        }
        if (dict.has(next) && !visited.has(next)) {
          visited.add(next)
          queue.push([next, steps + 1])
        }
      }
    }
  }
  return '0'
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  }
}

export default solutions
