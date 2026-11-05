import type { Solution } from './types'

const solutions: Record<string, Solution> = {
  'lc-house-robber-iii': {
    desc: `小偷又发现了一个新的可行窃的地区。这个地区只有一个入口，称为「根」，除了「根」之外，每栋房子有且只有一个「父」房子与之相连。这里所有房屋的排列类似于一棵二叉树，如果两个直接相连的房子在同一天晚上被打劫，小偷将自动报警。给定二叉树的根节点 root，返回在不触动警报的情况下小偷能够盗取的最高金额。

**示例 1：**

- 输入：root = [3,2,3,null,3,null,1]
- 输出：7
- 解释：小偷一晚能够盗取的最高金额为 3 + 3 + 1 = 7。

**示例 2：**

- 输入：root = [3,4,5,1,3,null,1]
- 输出：9
- 解释：小偷一晚能够盗取的最高金额为 4 + 5 = 9。

**提示：**

- 树的节点数在 [1, 10^4] 范围内
- 0 <= Node.val <= 10^4`,
    analysis: `本题是树形 DP 的入门题。房屋不是线性排列而是树形结构，因此 dp 数组要搬到树上来：通过递归遍历每个节点，并让递归返回节点的两种状态。

### 状态定义

每个节点只有偷或不偷两种状态，因此在递归中为每个节点返回一个长度为 2 的数组 dp：

- dp[0]：不偷当前节点时，以当前节点为根的子树能获得的最大金额
- dp[1]：偷当前节点时，以当前节点为根的子树能获得的最大金额

### 递推公式

- 偷当前节点：两个孩子都不能偷，dp[1] = node.val + left[0] + right[0]
- 不偷当前节点：孩子可偷可不偷，各自取较大值再相加，dp[0] = max(left[0], left[1]) + max(right[0], right[1])

> 关键点：不偷当前节点时，不能强制偷孩子，而要取「偷孩子」与「不偷孩子」中的较大值，否则会漏掉最优解。

### 初始化

- 空节点直接返回 [0, 0]，既是递归出口也是边界

### 遍历顺序

- 后序遍历：必须先拿到左右孩子的状态，才能推出当前节点的状态

相比暴力递归（会重复计算孙子等节点），每次递归直接把两种状态返回给父节点，每个节点只计算一次，天然完成了记忆化。

### 复杂度分析

- 时间复杂度：O(n)，每个节点访问一次
- 空间复杂度：O(h)，递归栈深度为树高，最坏情况下（链状树）为 O(n)`,
    code: `class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val
    this.left = left === undefined ? null : left
    this.right = right === undefined ? null : right
  }
}

function rob(root: TreeNode | null): number {
  // 返回 [不偷当前节点的最大金额, 偷当前节点的最大金额]
  const dfs = (node: TreeNode | null): number[] => {
    if (node === null) return [0, 0]
    const left = dfs(node.left)
    const right = dfs(node.right)
    // 偷当前节点：左右孩子只能不偷
    const robIt = node.val + left[0] + right[0]
    // 不偷当前节点：孩子可偷可不偷，取较大者
    const skipIt = Math.max(left[0], left[1]) + Math.max(right[0], right[1])
    return [skipIt, robIt]
  }
  const res = dfs(root)
  return Math.max(res[0], res[1])
}`
  },
  'lc-best-time-to-buy-and-sell-stock': {
    desc: `给定一个数组 prices，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。你只能选择某一天买入这只股票，并选择在未来的某一个不同的日子卖出该股票，设计算法计算你所能获取的最大利润。如果不能获取任何利润，返回 0。

**示例 1：**

- 输入：prices = [7,1,5,3,6,4]
- 输出：5
- 解释：在第 2 天（股票价格 = 1）买入，在第 5 天（股票价格 = 6）卖出，最大利润 = 6 - 1 = 5。注意利润不能是 7 - 1 = 6，因为卖出价格需要大于买入价格。

**示例 2：**

- 输入：prices = [7,6,4,3,1]
- 输出：0
- 解释：在这种情况下没有交易完成，所以最大利润为 0。

**提示：**

- 1 <= prices.length <= 10^5
- 0 <= prices[i] <= 10^4`,
    analysis: `本题是股票系列的第一题，有两种经典解法：贪心和动规。这里用动规五部曲分析，为后面整个股票系列打基础。

### 状态定义

- dp[i][0]：第 i 天持有股票所得的最大现金
- dp[i][1]：第 i 天不持有股票所得的最大现金

> 注意「持有」不等于「当天买入」，可能是前几天买入后一直持有到第 i 天。

### 递推公式

- dp[i][0] = max(dp[i - 1][0], -prices[i])：昨天就持有，或者今天买入
- dp[i][1] = max(dp[i - 1][1], dp[i - 1][0] + prices[i])：昨天就不持有，或者今天卖出

> 本题只能买卖一次，所以今天买入时现金就是 -prices[i]，不能写成 dp[i - 1][1] - prices[i]（那是可以买卖多次的写法）。

### 初始化

- dp[0][0] = -prices[0]，第 0 天买入
- dp[0][1] = 0，第 0 天不持有

### 遍历顺序

- 从前往后遍历，第 i 天的状态只依赖第 i - 1 天

最终答案是 dp[n - 1][1]：最后一天不持有的现金一定不小于持有。

### 复杂度分析

- 时间复杂度：O(n)
- 空间复杂度：O(n)，由于只依赖前一天，可用两个变量滚动优化到 O(1)

贪心解法：一遍遍历记录历史最低价格，用当前价格减去历史最低价，不断更新最大利润。`,
    code: `function maxProfit(prices: number[]): number {
  const n = prices.length
  // 滚动变量：hold 第 i 天持有股票的最大现金，sold 第 i 天不持有股票的最大现金
  let hold = -prices[0]
  let sold = 0
  for (let i = 1; i < n; i++) {
    hold = Math.max(hold, -prices[i])
    sold = Math.max(sold, hold + prices[i])
  }
  return sold
}`
  },
  'lc-best-time-to-buy-and-sell-stock-iii': {
    desc: `给定一个数组 prices，它的第 i 个元素 prices[i] 是一支给定股票第 i 天的价格。设计一个算法计算你所能获取的最大利润，你最多可以完成两笔交易。注意：你不能同时参与多笔交易，必须在再次购买前出售掉之前的股票。

**示例 1：**

- 输入：prices = [3,3,5,0,0,3,1,4]
- 输出：6
- 解释：在第 4 天（股票价格 = 0）买入，在第 6 天（股票价格 = 3）卖出，利润为 3；随后在第 7 天（股票价格 = 1）买入，在第 8 天（股票价格 = 4）卖出，利润为 3，总利润为 6。

**示例 2：**

- 输入：prices = [1,2,3,4,5]
- 输出：4
- 解释：在第 1 天买入，在第 5 天卖出，利润为 4。不允许同时参与多笔交易。

**提示：**

- 1 <= prices.length <= 10^5
- 0 <= prices[i] <= 10^5`,
    analysis: `本题在 121 题的基础上把交易次数从一次放宽到至多两次，状态数量随之增加，是理解后面 188 题的关键。

### 状态定义

一天结束时共有五种状态（用 j 编号）：

- 状态 0：没有操作
- 状态 1：第一次持有股票
- 状态 2：第一次卖出股票
- 状态 3：第二次持有股票
- 状态 4：第二次卖出股票

dp[i][j] 表示第 i 天处于状态 j 所得的最大现金。

### 递推公式

- dp[i][1] = max(dp[i - 1][1], -prices[i])
- dp[i][2] = max(dp[i - 1][2], dp[i - 1][1] + prices[i])
- dp[i][3] = max(dp[i - 1][3], dp[i - 1][2] - prices[i])
- dp[i][4] = max(dp[i - 1][4], dp[i - 1][3] + prices[i])

> 第二次买入必须基于第一次卖出后的现金，所以状态 3 要从状态 2 转移而来，各状态之间是链条关系。

### 初始化

- dp[0][1] = dp[0][3] = -prices[0]，其余为 0

> 第 0 天把状态 3 也初始化为 -prices[0]，等价于同一天买入又卖出一次，这是合法的（相当于白做一次交易），也保证了转移的完备性。

### 遍历顺序

- 从前往后遍历每一天，每天依次更新四个状态，最终取 dp[n - 1][4]（最后一次卖出一定最优）

### 复杂度分析

- 时间复杂度：O(n)
- 空间复杂度：O(n)，可优化为 O(1)，只用四个变量分别记录四个状态`,
    code: `function maxProfit(prices: number[]): number {
  const n = prices.length
  // buy1 第一次持有 / sell1 第一次卖出 / buy2 第二次持有 / sell2 第二次卖出
  let buy1 = -prices[0]
  let sell1 = 0
  let buy2 = -prices[0]
  let sell2 = 0
  for (let i = 1; i < n; i++) {
    buy1 = Math.max(buy1, -prices[i])
    sell1 = Math.max(sell1, buy1 + prices[i])
    buy2 = Math.max(buy2, sell1 - prices[i])
    sell2 = Math.max(sell2, buy2 + prices[i])
  }
  return sell2
}`
  },
  'lc-best-time-to-buy-and-sell-stock-iv': {
    desc: `给定一个整数数组 prices，其中 prices[i] 是某支股票第 i 天的价格；再给定整数 k，代表最多可以完成的交易数。设计算法计算你能获取的最大利润。注意：你不能同时参与多笔交易，必须在再次购买前出售掉之前的股票。

**示例 1：**

- 输入：k = 2, prices = [2,4,1]
- 输出：2
- 解释：在第 1 天（股票价格 = 2）买入，在第 2 天（股票价格 = 4）卖出，利润为 2。

**示例 2：**

- 输入：k = 2, prices = [3,2,6,5,0,3]
- 输出：7
- 解释：在第 2 天（股票价格 = 2）买入，在第 3 天（股票价格 = 6）卖出，利润为 4；随后在第 5 天（股票价格 = 0）买入，在第 6 天（股票价格 = 3）卖出，利润为 3。

**提示：**

- 0 <= k <= 100
- 1 <= prices.length <= 1000
- 0 <= prices[i] <= 1000`,
    analysis: `本题是 123 题的泛化：交易次数从固定的两次变为参数 k，思路完全一致，只是把写死的状态换成循环枚举。

### 状态定义

用一维下标 j 把状态编号到 0 到 2k：

- j = 0：没有操作
- j 为奇数：第 (j + 1) / 2 次持有股票
- j 为偶数且大于 0：第 j / 2 次卖出股票

dp[i][j] 表示第 i 天处于状态 j 的最大现金，共 2k + 1 个状态。

### 递推公式

- j 为奇数（买入）：dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - 1] - prices[i])
- j 为偶数（卖出）：dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - 1] + prices[i])

> 奇数状态减价格买入、偶数状态加价格卖出，交替进行，与 123 题手写四个状态完全对应。

### 初始化

- 第 0 天所有奇数状态（持有）初始化为 -prices[0]，其余为 0

### 遍历顺序

- 外层遍历天数，内层遍历 2k 个状态，从前往后，答案取 dp[2k]

### 复杂度分析

- 时间复杂度：O(n * k)
- 空间复杂度：O(k)，把 dp 滚动成一维即可

> 特殊优化：当 k >= n / 2 时，交易次数不再构成限制，等同于不限次数交易，直接贪心收集所有相邻上涨的差价即可，避免状态数过大。`,
    code: `function maxProfit(k: number, prices: number[]): number {
  const n = prices.length
  // k 过大时等同于不限交易次数，贪心收集所有上涨差价
  if (k >= Math.floor(n / 2)) {
    let profit = 0
    for (let i = 1; i < n; i++) {
      if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1]
    }
    return profit
  }
  // dp[j]: j 为奇数表示第 (j+1)/2 次持有，j 为偶数表示完成 j/2 次交易且不持有
  const dp: number[] = new Array(2 * k + 1).fill(0)
  for (let j = 1; j <= 2 * k; j += 2) dp[j] = -prices[0]
  for (let i = 1; i < n; i++) {
    for (let j = 1; j <= 2 * k; j++) {
      const gain = j % 2 === 1 ? -prices[i] : prices[i]
      dp[j] = Math.max(dp[j], dp[j - 1] + gain)
    }
  }
  return dp[2 * k]
}`
  },
  'lc-best-time-to-buy-and-sell-stock-with-cooldown': {
    desc: `给定一个整数数组 prices，其中 prices[i] 表示第 i 天的股票价格。设计算法计算最大利润，在满足约束的条件下你可以尽可能地完成更多的交易（多次买卖一支股票）：卖出股票后，你无法在第二天买入股票，即冷冻期为 1 天。注意：你不能同时参与多笔交易。

**示例 1：**

- 输入：prices = [1,2,3,0,2]
- 输出：3
- 解释：对应的交易状态为 [买入, 卖出, 冷冻期, 买入, 卖出]，总利润为 3。

**示例 2：**

- 输入：prices = [1]
- 输出：0

**提示：**

- 1 <= prices.length <= 5000
- 0 <= prices[i] <= 1000`,
    analysis: `本题是股票系列中状态划分最细的一题，核心在于把「冷冻期」拆解成独立状态。

### 状态定义

一天结束时共有四个状态：

- 状态 0：持有股票（今天买入或之前买入一直持有）
- 状态 1：保持卖出（两天前就卖出了，今天不是冷冻期）
- 状态 2：今天卖出股票
- 状态 3：今天处于冷冻期（昨天卖出的）

dp[i][j] 表示第 i 天处于状态 j 的最大现金。

### 递推公式

- dp[i][0] = max(dp[i - 1][0], max(dp[i - 1][1], dp[i - 1][3]) - prices[i])
- dp[i][1] = max(dp[i - 1][1], dp[i - 1][3])
- dp[i][2] = dp[i - 1][0] + prices[i]
- dp[i][3] = dp[i - 1][2]

> 今天想买入，昨天不能是「今天卖出」状态（那是冷冻期），可以是「保持卖出」或「冷冻期」；冷冻期过完后自然回到状态 1。

### 初始化

- dp[0][0] = -prices[0]，其余三个状态都是 0

### 遍历顺序

- 从前往后遍历，第 i 天的四个状态都由第 i - 1 天推出

最终答案取 dp[n - 1][1]、dp[n - 1][2]、dp[n - 1][3] 中的最大值，最后一天持有股票一定不如卖出。

### 复杂度分析

- 时间复杂度：O(n)
- 空间复杂度：O(n)，滚动优化后为 O(1)`,
    code: `function maxProfit(prices: number[]): number {
  const n = prices.length
  // hold 持有 / keepSold 保持卖出 / soldToday 今天卖出 / cooldown 今天冷冻期
  let hold = -prices[0]
  let keepSold = 0
  let soldToday = 0
  let cooldown = 0
  for (let i = 1; i < n; i++) {
    const newHold = Math.max(hold, Math.max(keepSold, cooldown) - prices[i])
    const newKeepSold = Math.max(keepSold, cooldown)
    const newSoldToday = hold + prices[i]
    const newCooldown = soldToday
    hold = newHold
    keepSold = newKeepSold
    soldToday = newSoldToday
    cooldown = newCooldown
  }
  return Math.max(keepSold, soldToday, cooldown)
}`
  },
  'lc-best-time-to-buy-and-sell-stock-with-transaction-fee': {
    desc: `给定一个整数数组 prices，其中 prices[i] 表示第 i 天的股票价格；整数 fee 代表交易股票的手续费用。你可以无限次地完成交易，但是每笔交易都需要支付一次手续费。如果已经购买了一个股票，在卖出它之前就不能再继续购买股票。返回获得利润的最大值。注意：一笔交易指买入持有并卖出股票的整个过程，每笔交易只需要支付一次手续费。

**示例 1：**

- 输入：prices = [1, 3, 2, 8, 4, 9], fee = 2
- 输出：8
- 解释：在第 1 天买入 prices[0] = 1，在第 4 天卖出 prices[3] = 8，利润 (8 - 1) - 2 = 5；随后在第 5 天买入 prices[4] = 4，在第 6 天卖出 prices[5] = 9，利润 (9 - 4) - 2 = 3，总利润为 8。

**示例 2：**

- 输入：prices = [1, 3, 7, 5, 10, 3], fee = 3
- 输出：6

**提示：**

- 1 <= prices.length <= 5 * 10^4
- 1 <= prices[i] < 5 * 10^4
- 0 <= fee < 5 * 10^4`,
    analysis: `本题与 122 题（不限次数买卖股票）几乎相同，唯一区别是每笔交易多收一笔手续费，在卖出时扣掉即可。

### 状态定义

- dp[i][0]：第 i 天持有股票所得的最大现金
- dp[i][1]：第 i 天不持有股票所得的最大现金

### 递推公式

- dp[i][0] = max(dp[i - 1][0], dp[i - 1][1] - prices[i])：昨天就持有，或者今天买入
- dp[i][1] = max(dp[i - 1][1], dp[i - 1][0] + prices[i] - fee)：昨天就不持有，或者今天卖出并支付手续费

> 与 121 题不同，本题可以多次交易，所以买入的转移来源是 dp[i - 1][1] - prices[i]；手续费只在卖出时扣一次，保证每笔交易恰好扣一笔。

### 初始化

- dp[0][0] = -prices[0]
- dp[0][1] = 0

### 遍历顺序

- 从前往后，每天的状态只依赖前一天

答案取 dp[n - 1][1]，最后不持有股票一定不劣。

### 复杂度分析

- 时间复杂度：O(n)
- 空间复杂度：O(n)，滚动优化后为 O(1)

贪心解法也成立：股价低于记录的买入价就更新买入价；当股价超过买入价加手续费时卖出，并把记录的买入价更新为当前股价，相当于锁定已有利润，后续若继续上涨可无缝续持。`,
    code: `function maxProfit(prices: number[], fee: number): number {
  // hold: 持有股票的最大现金; sold: 不持有股票的最大现金
  let hold = -prices[0]
  let sold = 0
  for (let i = 1; i < prices.length; i++) {
    hold = Math.max(hold, sold - prices[i])
    sold = Math.max(sold, hold + prices[i] - fee)
  }
  return sold
}`
  },
  'lc-longest-increasing-subsequence': {
    desc: `给你一个整数数组 nums，找到其中最长严格递增子序列的长度。子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序，例如 [3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。

**示例 1：**

- 输入：nums = [10,9,2,5,3,7,101,18]
- 输出：4
- 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4。

**示例 2：**

- 输入：nums = [0,1,0,3,2,3]
- 输出：4

**示例 3：**

- 输入：nums = [7,7,7,7,7,7,7]
- 输出：1

**提示：**

- 1 <= nums.length <= 2500
- -10^4 <= nums[i] <= 10^4
- 进阶：你能将算法的时间复杂度降低到 O(n log n) 吗？`,
    analysis: `子序列问题的经典入门题，dp 的含义从「以 i 结尾」重新出发，注意与线性动规套路的差异。

### 状态定义

- dp[i]：以下标 i 结尾的最长递增子序列的长度

> 一定要定义为「以 i 结尾」，否则无法通过递推把更长的子序列接在后面。也正因如此，答案不是 dp[n - 1]，而是所有 dp[i] 中的最大值。

### 递推公式

位置 i 的最长递增子序列，等于从 0 到 i - 1 各个位置中，选一个结尾比 nums[i] 小且长度最大的，再接上当前元素：

- 对所有 0 <= j < i 且 nums[j] < nums[i]：dp[i] = max(dp[i], dp[j] + 1)

> 与之前动规「由前一个位置推当前」不同，这里要在 i 之前的所有位置中搜索，所以需要内层循环 j。

### 初始化

- dp[i] = 1：每个元素自身构成长度为 1 的递增子序列

### 遍历顺序

- i 从 1 到 n - 1，j 从 0 到 i - 1，遍历中用 res 记录最大值

### 复杂度分析

- 时间复杂度：O(n^2)
- 空间复杂度：O(n)

进阶 O(n log n) 解法：维护 tails 数组，tails[k] 表示长度为 k + 1 的递增子序列的最小结尾元素，每来一个新元素用二分查找找到它应替换的位置（第一个大于等于它的值），tails 的最终长度就是答案。`,
    code: `function lengthOfLIS(nums: number[]): number {
  const n = nums.length
  // dp[i]: 以 nums[i] 结尾的最长递增子序列长度
  const dp: number[] = new Array(n).fill(1)
  let res = 1
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1)
    }
    res = Math.max(res, dp[i])
  }
  return res
}`
  },
  'lc-longest-continuous-increasing-subsequence': {
    desc: `给定一个未经排序的整数数组，找到最长且连续递增的子序列，并返回该序列的长度。连续递增子序列可以由两个下标 l 和 r（l < r）确定：如果对于每个 l <= i < r，都有 nums[i] < nums[i + 1]，那么子序列 [nums[l], ..., nums[r]] 就是连续递增子序列。

**示例 1：**

- 输入：nums = [1,3,5,4,7]
- 输出：3
- 解释：最长连续递增序列是 [1,3,5]，长度为 3。尽管 [1,3,5,7] 也是升序的子序列，但它不是连续的，因为 5 和 7 在原数组里被 4 隔开。

**示例 2：**

- 输入：nums = [2,2,2,2,2]
- 输出：1
- 解释：最长连续递增序列是 [2]，长度为 1。

**提示：**

- 1 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9`,
    analysis: `本题是 300 题的简化版，核心区别是「连续」二字，递推因此大幅简化。

### 状态定义

- dp[i]：以下标 i 结尾的最长连续递增序列的长度

### 递推公式

- 如果 nums[i] > nums[i - 1]：dp[i] = dp[i - 1] + 1，递增链延长一位
- 否则（相等或下降）：dp[i] = 1，从当前元素重新开始

> 与 300 题最大的不同：因为要求连续，只需和紧邻的前一个元素比较，不需要内层循环去比较所有 j < i。

### 初始化

- dp[i] = 1：每个元素自身构成长度为 1 的连续递增序列

### 遍历顺序

- 从前往后一遍遍历，答案取所有 dp[i] 的最大值

### 复杂度分析

- 时间复杂度：O(n)
- 空间复杂度：O(n)，由于 dp[i] 只依赖 dp[i - 1]，可滚动优化为 O(1)

由于只依赖前一个状态，实际编码时用一个变量 cur 保存当前连续递增长度即可，遍历中随时更新答案。`,
    code: `function findLengthOfLCIS(nums: number[]): number {
  // cur: 以当前元素结尾的连续递增长度（dp[i] 的滚动形式）
  let cur = 1
  let res = 1
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      cur = cur + 1
    } else {
      cur = 1
    }
    res = Math.max(res, cur)
  }
  return res
}`
  },
  'lc-maximum-length-of-repeated-subarray': {
    desc: `给两个整数数组 nums1 和 nums2，返回两个数组中公共的、长度最长的子数组的长度。子数组是数组中的一个连续部分。

**示例 1：**

- 输入：nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
- 输出：3
- 解释：长度最长的公共子数组是 [3,2,1]。

**示例 2：**

- 输入：nums1 = [0,0,0,0,0], nums2 = [0,0,0,0,0]
- 输出：5

**提示：**

- 1 <= nums1.length, nums2.length <= 1000
- 0 <= nums1[i], nums2[i] <= 100`,
    analysis: `本题是子序列系列中要求「连续」的一类，也是编辑距离系列的前置题，「连续」直接决定了递推公式的形态。

### 状态定义

- dp[i][j]：以下标 i - 1 结尾的 nums1 子数组，和以下标 j - 1 结尾的 nums2 子数组，两者的最长重复子数组长度

> 用「以 i - 1 结尾」而不是「以 i 结尾」定义，是为了让 dp[0][j]、dp[i][0] 天然表示空数组，初始化全为 0 即可，省去对第 0 行第 0 列的特殊处理，这是两个数组的 dp 题的惯用技巧。

### 递推公式

- 当 nums1[i - 1] == nums2[j - 1] 时：dp[i][j] = dp[i - 1][j - 1] + 1，两边各往前延伸一位
- 不相等时：dp[i][j] = 0，以这两个元素结尾不可能构成公共子数组

> 与不要求连续的最长公共子序列不同，这里不相等时不能继承 dp[i - 1][j] 或 dp[i][j - 1]，因为「连续」一旦断开长度就归零。

### 初始化

- dp[0][j] = dp[i][0] = 0

### 遍历顺序

- 两层循环分别遍历两个数组，从 1 开始；dp[i][j] 只依赖左上角 dp[i - 1][j - 1]，两层循环的先后可以交换

答案不是 dp[n][m]，而是遍历过程中所有 dp[i][j] 的最大值。

### 复杂度分析

- 时间复杂度：O(n * m)
- 空间复杂度：O(n * m)，可滚动优化为 O(m)（保存左上角旧值后倒序更新）`,
    code: `function findLength(nums1: number[], nums2: number[]): number {
  const n = nums1.length
  const m = nums2.length
  // dp[i][j]: 以 nums1[i-1] 结尾与以 nums2[j-1] 结尾的最长重复子数组长度
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  let res = 0
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (nums1[i - 1] === nums2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
        res = Math.max(res, dp[i][j])
      }
    }
  }
  return res
}`
  },
  'lc-longest-common-subsequence': {
    desc: `给定两个字符串 text1 和 text2，返回这两个字符串的最长公共子序列的长度。如果不存在公共子序列，返回 0。一个字符串的子序列是指从原字符串中删除若干字符（也可以不删）且不改变剩余字符相对顺序形成的新字符串；公共子序列是两个字符串所共同拥有的子序列。

**示例 1：**

- 输入：text1 = "abcde", text2 = "ace"
- 输出：3
- 解释：最长公共子序列是 "ace"，它的长度为 3。

**示例 2：**

- 输入：text1 = "abc", text2 = "abc"
- 输出：3
- 解释：最长公共子序列是 "abc"，它的长度为 3。

**示例 3：**

- 输入：text1 = "abc", text2 = "def"
- 输出：0

**提示：**

- 1 <= text1.length, text2.length <= 1000
- 两个字符串均由小写英文字符组成`,
    analysis: `本题是两个字符串 dp 的基石，后面 1035、392、583、72 等题都在它的模型上变化。

### 状态定义

- dp[i][j]：text1 前 i 个字符与 text2 前 j 个字符的最长公共子序列长度

> 用「前 i 个字符」定义而非「以 i 结尾」，因为公共子序列不要求连续，以 i 结尾反而限制了两边的最优选择。

### 递推公式

- 当 text1[i - 1] == text2[j - 1] 时：dp[i][j] = dp[i - 1][j - 1] + 1，两个末尾字符配对
- 不相等时：dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])，跳过 text1 或 text2 的末尾字符

> 不相等时不能只考虑 dp[i - 1][j - 1]：两个串的公共子序列可能分别以更早的字符结尾，必须同时考虑两个回退方向。

### 初始化

- dp[0][j] = dp[i][0] = 0：空串与任何串的公共子序列长度为 0

### 遍历顺序

- 从上到下、从左到右，dp[i][j] 依赖左、上、左上三个位置

答案就是 dp[n][m]。

### 复杂度分析

- 时间复杂度：O(n * m)
- 空间复杂度：O(n * m)，可滚动优化为 O(m)

与 718 题对比记忆：那题不相等时归零（要求连续），本题不相等时取两个方向的最大值（不要求连续）。`,
    code: `function longestCommonSubsequence(text1: string, text2: string): number {
  const n = text1.length
  const m = text2.length
  // dp[i][j]: text1 前 i 个字符与 text2 前 j 个字符的最长公共子序列长度
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  return dp[n][m]
}`
  },
  'lc-uncrossed-lines': {
    desc: `在两条独立的水平线上按给定的顺序写下 nums1 和 nums2 中的整数。现在可以绘制一些连接两个数字的直线，只要满足：两个数字相等，且直线不与任何其他连线（非水平线）相交。返回可以绘制的最大连线数。

**示例 1：**

- 输入：nums1 = [1,4,2], nums2 = [1,2,4]
- 输出：2
- 解释：可以画出两条不交叉的线，分别连接两个数组中的 1 和 2；不存在更多条不相交的直线。

**示例 2：**

- 输入：nums1 = [2,5,1,2,5], nums2 = [10,5,2,1,5,2]
- 输出：3

**示例 3：**

- 输入：nums1 = [1,3,7,1,7,5], nums2 = [1,9,2,5,1]
- 输出：2

**提示：**

- 1 <= nums1.length, nums2.length <= 500
- 1 <= nums1[i], nums2[i] <= 2000`,
    analysis: `这道题看起来是几何问题，实际与 1143 题完全同构：能画出的最大不相交连线数就是最长公共子序列的长度。

### 问题转化

- 连线不相交，要求相等数字的匹配在两个数组中的先后顺序保持一致
- 每个数字最多连一条线，等价于每个元素最多使用一次
- 这正是「子序列」的定义：按原顺序挑选元素

### 状态定义

- dp[i][j]：nums1 前 i 个数字与 nums2 前 j 个数字能画出的最大连线数

### 递推公式

- nums1[i - 1] == nums2[j - 1] 时：dp[i][j] = dp[i - 1][j - 1] + 1，这一对数字连线
- 不相等时：dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])，跳过其中一个数组的当前数字

### 初始化

- dp[0][j] = dp[i][0] = 0，空数组无法连线

### 遍历顺序

- 双层循环从 1 开始，从上到下、从左到右

答案就是 dp[n][m]。

### 复杂度分析

- 时间复杂度：O(n * m)
- 空间复杂度：O(n * m)，可滚动优化为 O(m)`,
    code: `function maxUncrossedLines(nums1: number[], nums2: number[]): number {
  const n = nums1.length
  const m = nums2.length
  // 本质是最长公共子序列：不相交意味着匹配的相对顺序一致
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (nums1[i - 1] === nums2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  return dp[n][m]
}`
  },
  'lc-is-subsequence': {
    desc: `给定字符串 s 和 t，判断 s 是否为 t 的子序列。字符串的一个子序列是原始字符串删除一些（也可以不删除）字符而不改变剩余字符相对位置形成的新字符串，例如 "ace" 是 "abcde" 的一个子序列，而 "aec" 不是。进阶：如果有大量输入的 S 需要依次检查是否为 T 的子序列，你会怎样改变代码？

**示例 1：**

- 输入：s = "abc", t = "ahbgdc"
- 输出：true

**示例 2：**

- 输入：s = "axc", t = "ahbgdc"
- 输出：false

**提示：**

- 0 <= s.length <= 100
- 0 <= t.length <= 10^4
- 两个字符串都只由小写字符组成`,
    analysis: `本题是编辑距离系列的入门题，用动规做能为后续题目打好基础，双指针解法则最为直观。

### 状态定义

- dp[i][j]：s 前 i 个字符与 t 前 j 个字符的最长公共子序列长度

判断 s 是否为 t 的子序列，等价于两者的最长公共子序列长度恰好等于 s 的长度。

### 递推公式

- s[i - 1] == t[j - 1] 时：dp[i][j] = dp[i - 1][j - 1] + 1，字符匹配成功
- 不相等时：dp[i][j] = dp[i][j - 1]，只能跳过 t 的当前字符继续找

> 与 1143 题的区别：不相等时只有一个方向。s 的每个字符必须按顺序用上，不存在「跳过 s 的字符」这个选项。

### 初始化

- dp[0][j] = dp[i][0] = 0

### 遍历顺序

- 从上到下、从左到右，最后判断 dp[n][m] 是否等于 n

### 复杂度分析

- 时间复杂度：O(n * m)
- 空间复杂度：O(n * m)，可滚动优化为 O(m)

双指针解法：两个指针分别指向 s 和 t，字符相同则双指针后移，否则只移动 t 的指针，最后看 s 的指针是否走完，时间 O(n + m)、空间 O(1)，处理进阶场景时可对 t 预处理字符位置索引做二分。`,
    code: `function isSubsequence(s: string, t: string): boolean {
  const n = s.length
  const m = t.length
  // dp[i][j]: s 前 i 个字符与 t 前 j 个字符的最长公共子序列长度
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        // 不相等时只能跳过 t 的字符
        dp[i][j] = dp[i][j - 1]
      }
    }
  }
  return dp[n][m] === n
}`
  },
  'lc-distinct-subsequences': {
    desc: `给你两个字符串 s 和 t，统计并返回在 s 的子序列中 t 出现的个数，题目数据保证答案符合 32 位带符号整数范围。

**示例 1：**

- 输入：s = "rabbbit", t = "rabbit"
- 输出：3
- 解释：如下所示，有 3 种可以从 s 中得到 "rabbit" 的方案，区别在于保留哪个 b。

**示例 2：**

- 输入：s = "babgbag", t = "bag"
- 输出：5

**提示：**

- 0 <= s.length, t.length <= 1000
- s 和 t 由英文字母组成`,
    analysis: `编辑距离系列的第一题，dp 存的是「方案数」而不是「步数」或「长度」，注意递推是相加而非取最值。

### 状态定义

- dp[i][j]：s 前 i 个字符的子序列中，t 前 j 个字符出现的个数

### 递推公式

分两种情况：

- s[i - 1] == t[j - 1] 时：dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j]
- 不相等时：dp[i][j] = dp[i - 1][j]，只能忽略 s 的当前字符

> 相等时的两项含义：dp[i - 1][j - 1] 表示用 s[i - 1] 去匹配 t[j - 1] 后，剩余部分的方案数；dp[i - 1][j] 表示即使字符相等也不用它去匹配的方案数。两者相加是本题最关键的点。

### 初始化

- dp[i][0] = 1：t 为空串时，任何 s 都有 1 种方式（全部删除）
- dp[0][j] = 0（j 大于 0）：s 为空不可能包含非空 t

dp[0][0] = 1，空串包含空串有一种方式。

### 遍历顺序

- 从上到下、从左到右，答案取 dp[n][m]

### 复杂度分析

- 时间复杂度：O(n * m)
- 空间复杂度：O(n * m)，可滚动优化为 O(m)`,
    code: `function numDistinct(s: string, t: string): number {
  const n = s.length
  const m = t.length
  // dp[i][j]: s 前 i 个字符的子序列中出现 t 前 j 个字符的方案数
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = 0; i <= n; i++) dp[i][0] = 1
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s[i - 1] === t[j - 1]) {
        // 用 s[i-1] 匹配 + 不用 s[i-1] 匹配
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j]
      } else {
        dp[i][j] = dp[i - 1][j]
      }
    }
  }
  return dp[n][m]
}`
  },
  'lc-delete-operation-for-two-strings': {
    desc: `给定两个单词 word1 和 word2，返回使得 word1 和 word2 相同所需的最小步数。每一步可以删除任意一个字符串中的一个字符。

**示例 1：**

- 输入：word1 = "sea", word2 = "eat"
- 输出：2
- 解释：第一步将 "sea" 变为 "ea"，第二步将 "eat" 变为 "ea"。

**示例 2：**

- 输入：word1 = "leetcode", word2 = "etco"
- 输出：4

**提示：**

- 1 <= word1.length, word2.length <= 500
- word1 和 word2 只含有小写英文字符`,
    analysis: `本题是编辑距离的前奏，只涉及删除操作，比 72 题简单，思路可以完全迁移过去。

### 状态定义

- dp[i][j]：使 word1 前 i 个字符与 word2 前 j 个字符相同所需的最少删除步数

### 递推公式

- word1[i - 1] == word2[j - 1] 时：末尾字符相同无需删除，dp[i][j] = dp[i - 1][j - 1]
- 不相等时：删除 word1 的末尾字符或删除 word2 的末尾字符，取最小再加一，dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1)

> 不需要单独考虑「两个末尾都删」：它等于 dp[i - 1][j - 1] + 2，而 dp[i - 1][j] + 1 一定能覆盖到不劣的结果。

### 初始化

- dp[i][0] = i：与空串相同，需删掉 word1 的全部 i 个字符
- dp[0][j] = j：同理删掉 word2 的全部 j 个字符

### 遍历顺序

- 从上到下、从左到右，答案取 dp[n][m]

### 复杂度分析

- 时间复杂度：O(n * m)
- 空间复杂度：O(n * m)，可滚动优化为 O(m)

另一种思路：先求最长公共子序列长度 L，答案就是 n + m - 2 * L，即两个字符串中不属于公共子序列的字符全部删掉。`,
    code: `function minDistance(word1: string, word2: string): number {
  const n = word1.length
  const m = word2.length
  // dp[i][j]: 使 word1 前 i 个字符与 word2 前 j 个字符相同的最少删除步数
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = 1; i <= n; i++) dp[i][0] = i
  for (let j = 1; j <= m; j++) dp[0][j] = j
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1)
      }
    }
  }
  return dp[n][m]
}`
  },
  'lc-edit-distance': {
    desc: `给你两个单词 word1 和 word2，请返回将 word1 转换成 word2 所使用的最少操作数。可以对一个单词进行如下三种操作：插入一个字符、删除一个字符、替换一个字符。

**示例 1：**

- 输入：word1 = "horse", word2 = "ros"
- 输出：3
- 解释：horse -> rorse（将 h 替换为 r），rorse -> rose（删除 r），rose -> ros（删除 e）。

**示例 2：**

- 输入：word1 = "intention", word2 = "execution"
- 输出：5
- 解释：intention -> inention（删除 t），inention -> enention（将 i 替换为 e），enention -> exention（将 n 替换为 x），exention -> exection（将 n 替换为 c），exection -> execution（插入 u）。

**提示：**

- 0 <= word1.length, word2.length <= 500
- word1 和 word2 由小写英文字母组成`,
    analysis: `编辑距离是字符串动规的收官题，把增、删、改三种操作统一进一个递推公式，理解它之后字符串 DP 体系就完整了。

### 状态定义

- dp[i][j]：word1 前 i 个字符转换成 word2 前 j 个字符所使用的最少操作数

### 递推公式

- word1[i - 1] == word2[j - 1] 时：末尾字符一致无需操作，dp[i][j] = dp[i - 1][j - 1]
- 不相等时，三种来源取最小：

1. 删除 word1 的末尾字符：dp[i - 1][j] + 1
2. 删除 word2 的末尾字符（等价于在 word1 末尾插入）：dp[i][j - 1] + 1
3. 替换 word1 的末尾字符使其等于 word2 的末尾字符：dp[i - 1][j - 1] + 1

> 「在 word1 插入一个字符」与「删除 word2 的一个字符」效果等价：word1 插入后多出的字符正好对应 word2 的末尾字符，所以递推里不需要单列插入操作。

### 初始化

- dp[i][0] = i：word1 前 i 个字符变成空串需删除 i 次
- dp[0][j] = j：空串变成 word2 前 j 个字符需插入 j 次

### 遍历顺序

- 从上到下、从左到右，dp[i][j] 依赖左、上、左上三个方向

### 复杂度分析

- 时间复杂度：O(n * m)
- 空间复杂度：O(n * m)，可滚动优化为 O(m)`,
    code: `function minDistance(word1: string, word2: string): number {
  const n = word1.length
  const m = word2.length
  // dp[i][j]: word1 前 i 个字符转换成 word2 前 j 个字符的最少操作数
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = 1; i <= n; i++) dp[i][0] = i
  for (let j = 1; j <= m; j++) dp[0][j] = j
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        // 删 word1 / 删 word2(等价于插入) / 替换，三者取最小
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1)
      }
    }
  }
  return dp[n][m]
}`
  },
  'lc-palindromic-substrings': {
    desc: `给你一个字符串 s，统计并返回这个字符串中回文子串的数目。具有不同开始位置或结束位置的子串，即使是由相同的字符组成，也会被视作不同的子串。

**示例 1：**

- 输入：s = "abc"
- 输出：3
- 解释：三个回文子串是 "a"、"b"、"c"。

**示例 2：**

- 输入：s = "aaa"
- 输出：6
- 解释：六个回文子串是 "a"、"a"、"a"、"aa"、"aa"、"aaa"。

**提示：**

- 1 <= s.length <= 1000
- s 由小写英文字母组成`,
    analysis: `回文系列的第一题。这里的 dp 存布尔值而不是数值，状态定义思路的转变值得体会。

### 状态定义

- dp[i][j]：区间 [i, j]（左闭右闭）的子串是否为回文串

> 不能把 dp 定义为「[i, j] 内回文子串的个数」：判断 [i, j] 是否回文必须依赖内部子串的回文信息，布尔定义才是递推链条的基石，个数在遍历时顺便统计即可。

### 递推公式

当 s[i] == s[j] 时分三种情况：

1. i == j：单个字符，一定是回文
2. j - i == 1：两个相同字符，如 aa，一定是回文
3. j - i > 1：取决于去掉两端后的子串，dp[i][j] = dp[i + 1][j - 1]

当 s[i] != s[j] 时，dp[i][j] = false。

### 初始化

- 全部初始化为 false，在遍历中逐步填成 true

### 遍历顺序

- dp[i][j] 依赖左下角 dp[i + 1][j - 1]，所以 i 必须从下往上遍历、j 从左往右遍历，保证计算 dp[i][j] 时更短的区间已经算好

每当 dp[i][j] 为 true，回文子串计数加一。

### 复杂度分析

- 时间复杂度：O(n^2)
- 空间复杂度：O(n^2)

另一种解法是中心扩散法：以每个字符（奇数长度）和每对相邻字符（偶数长度）为中心向两侧扩散，空间 O(1)，时间同为 O(n^2)。`,
    code: `function countSubstrings(s: string): number {
  const n = s.length
  // dp[i][j]: s[i..j] 是否为回文子串
  const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false))
  let res = 0
  // 从下往上、从左往右遍历，保证 dp[i+1][j-1] 先算出
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      if (s[i] === s[j] && (j - i <= 1 || dp[i + 1][j - 1])) {
        dp[i][j] = true
        res++
      }
    }
  }
  return res
}`
  },
  'lc-longest-palindromic-subsequence': {
    desc: `给你一个字符串 s，找出其中最长的回文子序列，并返回该序列的长度。子序列定义为：不改变剩余字符顺序，通过删除某些字符（也可以不删除）形成的序列。

**示例 1：**

- 输入：s = "bbbab"
- 输出：4
- 解释：一个可能的最长回文子序列为 "bbbb"。

**示例 2：**

- 输入：s = "cbbd"
- 输出：2
- 解释：一个可能的最长回文子序列为 "bb"。

**提示：**

- 1 <= s.length <= 1000
- s 仅由小写英文字符组成`,
    analysis: `本题求最长回文子序列的长度，与 647 题有两个区别：子序列可以跳过字符；dp 存的是长度而不是布尔值。

### 状态定义

- dp[i][j]：字符串 s 在区间 [i, j]（左闭右闭）内最长回文子序列的长度

### 递推公式

- s[i] == s[j] 时：dp[i][j] = dp[i + 1][j - 1] + 2，两端字符同时纳入回文
- s[i] != s[j] 时：两端不能同时保留，分别跳过取较大值，dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])

> 与子串版本不同，这里不需要判断区间长度：即使 s[i] == s[j] 且中间部分不是回文，dp[i + 1][j - 1] + 2 依然成立，因为 dp 存的是「最长回文子序列长度」而非「是否回文」。

### 初始化

- dp[i][i] = 1：单个字符自身是长度为 1 的回文

其余位置初始化为 0 即可，遍历时会被覆盖。

### 遍历顺序

- dp[i][j] 依赖左下、下方、左边三个位置，所以 i 从下往上、j 从 i + 1 向右遍历，保证依赖位置先算出

答案就是 dp[0][n - 1]，即整个字符串的最长回文子序列长度。

### 复杂度分析

- 时间复杂度：O(n^2)
- 空间复杂度：O(n^2)`,
    code: `function longestPalindromeSubseq(s: string): number {
  const n = s.length
  // dp[i][j]: s[i..j] 中最长回文子序列的长度
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))
  for (let i = 0; i < n; i++) dp[i][i] = 1
  // i 从下往上、j 从左往右，保证依赖位置先算出
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1])
      }
    }
  }
  return dp[0][n - 1]
}`
  }
}

export default solutions
