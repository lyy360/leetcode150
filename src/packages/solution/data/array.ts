import type { Solution } from './types'

const solutions: Record<string, Solution> = {
  'lc-binary-search': {
    desc: `给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target，写一个函数搜索 nums 中的 target。如果目标值存在则返回其下标，否则返回 -1。

**示例 1：**
- 输入：nums = [-1,0,3,5,9,12], target = 9
- 输出：4
- 解释：9 出现在 nums 中并且下标为 4。

**示例 2：**
- 输入：nums = [-1,0,3,5,9,12], target = 2
- 输出：-1
- 解释：2 不存在于 nums 中，因此返回 -1。

**提示：**
- 你可以假设 nums 中的所有元素是不重复的。
- n 将在 [1, 10000] 之间。
- nums 的每个元素都将在 [-9999, 9999] 之间。`,
    analysis: `### 核心思路
这道题最容易想到的是从头到尾线性扫描，时间复杂度 O(n)。但题目给的数组有两个关键前提：**有序**且**无重复元素**，这正是二分查找的适用场景。二分的本质是利用有序性，每次用中间元素和 target 比较，就能淘汰掉一半的搜索区间，把 O(n) 的扫描压缩到 O(log n)。

二分写法最大的坑是边界问题：循环条件该写 left < right 还是 left <= right？收缩区间该写 right = mid 还是 right = mid - 1？很多人写错，根源是一会儿按左闭右闭理解、一会儿按左闭右开理解，两套规则互相打架。

> 循环不变量是解题关键：如果定义搜索区间为左闭右闭 [left, right]，那么循环条件和区间更新就必须始终与这个定义保持一致。

### 算法步骤
1. 初始化 left = 0，right = nums.length - 1，表示在闭区间 [left, right] 内搜索。
2. 循环条件写 left <= right：左闭右闭区间在 left == right 时仍含一个合法元素，不能漏查。
3. 取 mid = left + (right - left) / 2 向下取整，先减后加避免加法溢出。
4. nums[mid] 等于 target 直接返回 mid；nums[mid] 小于 target 说明答案只可能在右半区，令 left = mid + 1；反之令 right = mid - 1。
5. 循环结束仍未命中，返回 -1。

### 易错点
- 区间定义一旦混乱就会死循环或漏元素：左闭右闭对应 left <= right 和 right = mid - 1；若改用左闭右开 [left, right)，则必须写 left < right 和 right = mid。
- mid 建议写成 left + (right - left) / 2，虽然本题数据范围下 left + right 不会溢出，但要养成防溢出的习惯。
- 一定要看清「无重复元素」这个前提，若有重复元素，二分还需要额外规定返回最左还是最右下标。

### 复杂度分析
- 时间复杂度：O(log n)，每次循环搜索区间缩小一半。
- 空间复杂度：O(1)，只使用了常数个辅助变量。`,
    code: `function search(nums: number[], target: number): number {
  // 左闭右闭写法：在 [left, right] 区间内搜索
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    // 先减后加，防止两数相加溢出
    const mid = left + Math.floor((right - left) / 2)
    if (nums[mid] === target) {
      return mid
    } else if (nums[mid] < target) {
      // 目标在右半区，收缩左边界
      left = mid + 1
    } else {
      // 目标在左半区，收缩右边界
      right = mid - 1
    }
  }
  return -1
}`
  },
  'lc-remove-element': {
    desc: `给你一个数组 nums 和一个值 val，你需要原地移除所有数值等于 val 的元素，并返回移除后数组的新长度。要求不使用额外的数组空间，仅使用 O(1) 额外空间并原地修改输入数组。元素的顺序可以改变，你不需要考虑数组中超出新长度后面的元素。

**示例 1：**
- 输入：nums = [3,2,2,3], val = 3
- 输出：2, nums = [2,2]
- 解释：函数应该返回新的长度 2，并且 nums 中的前两个元素均为 2。不需要考虑数组中超出新长度后面的元素。

**示例 2：**
- 输入：nums = [0,1,2,2,3,0,4,2], val = 2
- 输出：5, nums = [0,1,4,0,3]
- 解释：函数应该返回新的长度 5，并且 nums 中的前五个元素为 0, 1, 3, 0, 4。元素的顺序可以改变。

**提示：**
- 0 <= nums.length <= 100
- 0 <= nums[i] <= 50
- 0 <= val <= 100`,
    analysis: `### 核心思路
数组的元素在内存地址上是连续的，没办法像链表那样把节点摘掉，只能用后面的元素**覆盖**前面的元素。暴力做法是每遇到一个 val，就把它后面的所有元素整体前移一位，最坏情况下时间复杂度 O(n^2)。

> 双指针法（快慢指针）只需一趟遍历：快指针负责探查原数组的每一个元素，慢指针负责记录「新数组」下一个待写入的位置。

具体含义是：快指针当前元素不等于 val，说明它是新数组需要的元素，直接覆盖到慢指针位置，两个指针同时前进；快指针当前元素等于 val，则把它跳过，只有快指针前进。这样数组在逻辑上被分成两段：[0, slow) 是移除后的新数组，[slow, fast) 是被丢弃的 val。

### 算法步骤
1. 初始化 slow = 0，fast = 0。
2. fast 逐个向右扫描：若 nums[fast] 不等于 val，执行 nums[slow] = nums[fast]，然后 slow 加一。
3. 若 nums[fast] 等于 val，什么都不做，相当于把这个元素丢弃。
4. fast 扫完整个数组后，slow 就是新数组的长度，直接返回。

### 易错点
- 理解「返回新长度」的语义：slow 之后的元素是残留的旧数据，判题程序只检查前 slow 个元素。
- 本题明确说元素顺序可以改变，所以还有更快的相向双指针写法：把数组尾部的元素搬到待删除位置，两侧指针向中间收拢，适合 val 出现很少的场景，但边界更容易出错。
- 快慢指针写法保留了元素的相对顺序，这是它相比相向双指针的优势。

### 复杂度分析
- 时间复杂度：O(n)，fast 只对数组做一趟扫描。
- 空间复杂度：O(1)，原地覆盖，没有使用额外的数组。`,
    code: `function removeElement(nums: number[], val: number): number {
  // 快指针 fast 扫描原数组，慢指针 slow 指向新数组的写入位置
  let slow = 0
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== val) {
      nums[slow] = nums[fast]
      slow++
    }
  }
  return slow
}`
  },
  'lc-squares-of-a-sorted-array': {
    desc: `给你一个按非递减顺序排序的整数数组 nums，返回每个数字的平方组成的新数组，要求新数组也按非递减顺序排序。

**示例 1：**
- 输入：nums = [-4,-1,0,3,10]
- 输出：[0,1,9,16,100]
- 解释：平方后数组变为 [16,1,0,9,100]，排序后变为 [0,1,9,16,100]。

**示例 2：**
- 输入：nums = [-7,-3,2,3,11]
- 输出：[4,9,9,49,121]

**提示：**
- 1 <= nums.length <= 10^4
- -10^4 <= nums[i] <= 10^4
- nums 已按非递减顺序排序`,
    analysis: `### 核心思路
数组平方之后，原本的有序性会被负数破坏：负数部分平方后由小变大，正数部分平方后仍然递增。于是整个平方数组呈现「两端大、中间小」的形态，**最大值一定出现在原数组的两端**，最小值藏在中间某个位置。

> 与其平方后再排序（O(n log n)），不如直接利用原有有序性：双指针分别指向数组两端，每次比较两端平方值，把较大的那个从结果数组末尾往前填。

这个过程和「合并两个有序数组」是同一个套路：负数部分的平方倒着看是递增序列，正数部分的平方正着看也是递增序列，两个序列归并就是答案。

### 算法步骤
1. 定义 left = 0，right = nums.length - 1，创建与原数组等长的结果数组 result。
2. 填充位置 k 从 result 的末尾开始，逐格向前。
3. 比较 nums[left] 的平方与 nums[right] 的平方：较大者写入 result[k]，并移动对应指针（left 右移或 right 左移）。
4. k 走到 0 时全部填完，返回 result。

### 易错点
- 填充方向是**从后往前填最大值**，而不是从前往后找最小值——最小值的位置在中间，从两端定位反而困难。
- 双指针相遇的最后一步（填 result[0] 时）也要走统一的比较逻辑，用严格大于号即可保证剩余元素正确落入。
- 平方可能超出原数值范围：本题 |nums[i]| <= 10^4，平方后为 10^8，安全；数据更大时要有溢出意识。

### 复杂度分析
- 时间复杂度：O(n)，左右指针合计最多移动 n 次。
- 空间复杂度：O(1)，不计入返回的结果数组。`,
    code: `function sortedSquares(nums: number[]): number[] {
  const n = nums.length
  const result: number[] = new Array(n).fill(0)
  let left = 0
  let right = n - 1
  // 平方后最大值一定在两端，从后往前填入较大的平方值
  for (let k = n - 1; k >= 0; k--) {
    const leftSq = nums[left] * nums[left]
    const rightSq = nums[right] * nums[right]
    if (leftSq > rightSq) {
      result[k] = leftSq
      left++
    } else {
      result[k] = rightSq
      right--
    }
  }
  return result
}`
  },
  'lc-minimum-size-subarray-sum': {
    desc: `给定一个含有 n 个正整数的数组 nums 和一个正整数 target。找出该数组中满足其总和大于等于 target 的长度最小的连续子数组，并返回其长度。如果不存在符合条件的子数组，返回 0。

**示例 1：**
- 输入：target = 7, nums = [2,3,1,2,4,3]
- 输出：2
- 解释：子数组 [4,3] 是该条件下的长度最小的子数组。

**示例 2：**
- 输入：target = 4, nums = [1,4,4]
- 输出：1

**示例 3：**
- 输入：target = 11, nums = [1,1,1,1,1,1,1,1]
- 输出：0
- 解释：数组中不存在总和大于等于 11 的子数组。

**提示：**
- 1 <= target <= 10^9
- 1 <= nums.length <= 10^5
- 1 <= nums[i] <= 10^5`,
    analysis: `### 核心思路
暴力解法是枚举每一个起点，向后累加直到总和达到 target，记录最短长度，两层循环时间复杂度 O(n^2)。在 n 最大 10^5 的规模下必然超时，必须把嵌套的两层循环压成一层。

> 本题的关键性质是：数组元素全是**正整数**。窗口向右扩张时窗口和单调增加，向左收缩时窗口和单调减少，这种单调性正是「滑动窗口」能够成立的前提。

滑动窗口本质上还是双指针：right 指针不断向右扩张窗口，负责寻找可行解；一旦窗口内总和大于等于 target，right 停住，left 指针开始收缩，在可行解中挑出最短的。每个元素最多被 right 和 left 各访问一次，全程只有一趟线性扫描。

> 若数组包含 0 或负数，收缩后窗口和不再单调变化，滑动窗口直接失效，需要改用前缀和加单调队列的思路（LeetCode 862）。

### 算法步骤
1. 初始化 sum = 0，left = 0，result 记为无穷大。
2. right 从左到右扩张，把 nums[right] 累加进 sum。
3. 当 sum >= target 时进入收缩循环：先用当前窗口长度 right - left + 1 更新 result，再减去 nums[left]，left 右移，直到 sum 小于 target。
4. 扫描结束后，result 仍是无穷大说明无解，返回 0；否则返回 result。

### 易错点
- 更新最短长度的时机必须放在 while 收缩循环内部、每次收缩之前，而不是整个 right 循环结束才更新一次，否则会漏掉更短的窗口。
- 本题数据保证正整数，才敢放心收缩左边界；若含非正数不能套滑动窗口。
- result 用 Infinity 初始化，最后返回前要判断是否被更新过。

### 复杂度分析
- 时间复杂度：O(n)，left 和 right 各最多移动 n 次，别看写的是两层循环。
- 空间复杂度：O(1)，只用常数个变量。`,
    code: `function minSubArrayLen(target: number, nums: number[]): number {
  let result = Infinity
  let sum = 0
  let left = 0
  // 右指针扩张窗口，窗口和达标时左指针收缩，寻找最短窗口
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right]
    while (sum >= target) {
      result = Math.min(result, right - left + 1)
      sum -= nums[left]
      left++
    }
  }
  return result === Infinity ? 0 : result
}`
  },
  'lc-spiral-matrix-ii': {
    desc: `给你一个正整数 n，生成一个包含 1 到 n^2 所有元素，且元素按顺时针顺序螺旋排列的 n x n 正方形矩阵 matrix，返回该矩阵。

**示例 1：**
- 输入：n = 3
- 输出：[[1,2,3],[8,9,4],[7,6,5]]
- 解释：数字 1 到 9 按顺时针螺旋顺序填入 3x3 矩阵。

**示例 2：**
- 输入：n = 1
- 输出：[[1]]

**提示：**
- 1 <= n <= 20`,
    analysis: `### 核心思路
本题不涉及复杂算法，真正考察的是把「模拟过程」翻译成边界清晰代码的能力。很多人写不出来，是因为处理每条边时区间规则不统一：这一条边按左闭右闭填，下一条边又按左闭右开填，四条边的边界互相打架，最后不是重复填就是漏填。

> 解题关键是坚持**循环不变量**：每画一条边都使用左闭右开区间 [起点, 终点)，每条边的最后一个格子留给下一条边去填，四条边的规则才能无缝衔接。

比如画上边时，只填到 n - offset 之前的格子，最右上角的格子由右边那条边自上而下时填入；右边同理，最右下的格子留给下边，以此类推，转一圈正好首尾相接。

### 算法步骤
1. 圈数 loop 取 n / 2 向下取整，起点 startX、startY 从 0 开始，offset 记录当前圈从边界收进来的宽度，count 记录下一个要填的数字。
2. 每圈按 上边（从左到右）、右边（从上到下）、下边（从右到左）、左边（从下到上）的顺序填数，每条边都是左闭右开。
3. 每画完一圈，startX 和 startY 各加一，offset 加一。
4. n 为奇数时，最后一圈只剩中心一个格子，循环外单独填入。

### 易错点
- 四条边必须按同一套区间规则转圈（上右下左），每条边的终点就是下一条边的起点，全靠左闭右开保证不重不漏。
- 循环变量 i、j 要在四条边之间连续传递，不要每条边都重新初始化，否则位置对不上。
- 奇数 n 的中心点容易忘记填，或填错成 0，正确值是当前的 count（即 n^2）。

### 复杂度分析
- 时间复杂度：O(n^2)，每个格子恰好被填一次。
- 空间复杂度：O(1)，不计入返回的矩阵本身。`,
    code: `function generateMatrix(n: number): number[][] {
  const matrix: number[][] = new Array(n).fill(0).map(() => new Array(n).fill(0))
  let startX = 0
  let startY = 0
  let offset = 1
  let count = 1
  let loop = Math.floor(n / 2)
  while (loop--) {
    let i = startY
    let j = startX
    // 上边：从左到右，左闭右开，最后一个格子留给右边
    for (; j < n - offset; j++) {
      matrix[i][j] = count++
    }
    // 右边：从上到下，最后一个格子留给下边
    for (; i < n - offset; i++) {
      matrix[i][j] = count++
    }
    // 下边：从右到左，最后一个格子留给左边
    for (; j > startX; j--) {
      matrix[i][j] = count++
    }
    // 左边：从下到上
    for (; i > startY; i--) {
      matrix[i][j] = count++
    }
    startX++
    startY++
    offset++
  }
  // n 为奇数时，单独填充中心点
  if (n % 2 === 1) {
    matrix[Math.floor(n / 2)][Math.floor(n / 2)] = count
  }
  return matrix
}`
  },
  'kama-1070': {
    desc: `给定一个整数数组 Array，请计算该数组在每个给定区间内的元素总和。第一行输入数组长度 n，接下来 n 行每行一个整数表示数组元素；随后的每行输入为需要计算总和的区间，用空格隔开的两个整数，分别为区间的起始位置和结束位置（数组下标，从 0 开始），直至文件结束。

**输入示例：**
~~~
5
1
2
3
4
5
0 3
1 4
~~~
**输出示例：**
~~~
10
14
~~~
> 数组为 [1, 2, 3, 4, 5]，区间 [0, 3] 的和为 1 + 2 + 3 + 4 = 10，区间 [1, 4] 的和为 2 + 3 + 4 + 5 = 14。`,
    analysis: `### 核心思路
本题如果对每个查询都从 a 到 b 逐个累加，最坏情况下每次查询都是 O(n)，查询一多必然超时。

> 前缀和是处理「静态数组 + 区间和查询」的标准武器：预处理出 prefix[i] 表示数组前 i 个元素的和，之后任意区间 [a, b] 的和都能用两次减法得到。

区间 [a, b] 的和等于 prefix[b + 1] - prefix[a]，推导很直观：前 b + 1 个数的和减去前 a 个数的和，剩下的正好是第 a 到第 b 个元素。预处理 O(n)，之后每次查询 O(1)，这就是用空间换时间的典型。

### 算法步骤
1. 读入 n，再读入 n 个数组元素。
2. 构建 prefix 数组：prefix[0] = 0，prefix[i + 1] = prefix[i] + nums[i]。
3. 对每一行查询 a、b，输出 prefix[b + 1] - prefix[a]。
4. 查询行数不确定，读到输入末尾为止，逐行输出结果。

### 易错点
- prefix 数组建议比原数组多一位、从 0 开始存，这样处理 a = 0 的查询时不用特判（否则要写 a == 0 时单独返回 prefix[b]）。
- ACM 模式输入按行读：数组元素每行一个数，查询每行两个数，解析时要区分清楚。
- 查询行数不确定，必须循环读到输入末尾，不能假设固定行数。
- 下标含义要统一：题目给的 a、b 是数组下标，对应前缀和数组时要整体右移一位。

### 复杂度分析
- 时间复杂度：预处理 O(n)，单次查询 O(1)。
- 空间复杂度：O(n)，存储原数组和前缀和数组。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const n = parseInt(lines[idx++])
  const nums: number[] = []
  for (let i = 0; i < n; i++) {
    nums.push(parseInt(lines[idx++]))
  }
  // 构建前缀和数组：prefix[i] 表示前 i 个元素之和
  const prefix: number[] = new Array(n + 1).fill(0)
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i]
  }
  const output: string[] = []
  // 查询行数不确定，读到输入末尾为止
  while (idx < lines.length) {
    const parts = lines[idx++].split(' ')
    if (parts.length < 2) {
      continue
    }
    const a = parseInt(parts[0])
    const b = parseInt(parts[1])
    // 区间 [a, b] 的和 = prefix[b + 1] - prefix[a]
    output.push(String(prefix[b + 1] - prefix[a]))
  }
  return output.join('\\n')
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  },
  'kama-1044': {
    desc: `在一个被划分成 n * m 个连续区块的城市区域中，每个区块拥有不同的价值。开发商想用一条水平或垂直的直线把整块区域切割成两个非空部分进行开发，希望两部分的价值总和差值尽可能小。请你求出所有切割方案中，两部分价值总和差值的最小值。输入第一行为 n 和 m，接下来 n 行，每行 m 个整数表示每个区块的价值。

**输入示例：**
~~~
3 3
1 2 3
4 5 6
7 8 9
~~~
**输出示例：**
~~~
3
~~~
> 总价值为 45。在第一、二行之间水平切割时，上部分 1+2+3+4+5+6 = 21，下部分 7+8+9 = 24，差值 |21 - 24| = 3，为所有切割方案中的最小值。`,
    analysis: `### 核心思路
题意可以抽象为：用一条水平切割线或垂直切割线，把 n * m 的网格切成上下（或左右）两个非空部分，求两部分价值和之差的最小绝对值。

如果对每条切割线都重新逐格累加一遍两部分的和，会产生大量重复计算。更好的做法是先做预处理：

> 分别统计每一行的和 rowSum 与每一列的和 colSum，再借助前缀思想遍历切割线，每移动一条切割线只需一次加法和一次减法。

设 sum 为整张地图的总价值。水平切割线位于第 i 行下方时，上半部分价值和 cut 等于前 i + 1 行 rowSum 之和，下半部分就是 sum - cut，两部分差值为 |sum - 2 * cut|。垂直方向完全同理。遍历全部 n - 1 条水平线和 m - 1 条垂直线，取最小值即可。

### 算法步骤
1. 读入 n、m 和整个网格，累加出总价值 sum。
2. 统计 rowSum[i]（第 i 行的和）与 colSum[j]（第 j 列的和）。
3. 水平方向：cut 从 0 开始逐行累加 rowSum[i]（i 从 0 到 n - 2），每次用 sum - cut - cut 的绝对值更新答案。
4. 垂直方向：cut 逐列累加 colSum[j]（j 从 0 到 m - 2），同样方式更新答案。
5. 输出最小差值。

### 易错点
- 切割线只有 n - 1 条水平、m - 1 条垂直——必须切成两个**非空**部分，循环边界不要写成到 n 或 m。
- 差值公式是 sum 与两倍 cut 之差的绝对值：cut 是一侧的和，sum - cut 是另一侧，相减化简而来，不要误写成 |sum - cut|。
- 答案初始化为极大值；只要 n、m 均不小于 2 就一定存在合法切割，最后直接输出即可。
- 输入是逐行给出的 m 个数，ACM 模式解析时按行 split 再转数字。

### 复杂度分析
- 时间复杂度：O(n * m)，读入并累加网格占主导，后续统计与遍历均为线性级别。
- 空间复杂度：O(n * m)，需要保存整个网格；辅助的行和与列和数组只占 O(n + m)。`,
    code: `function solve(lines: string[]): string {
  let idx = 0
  const header = lines[idx++].split(' ')
  const n = parseInt(header[0])
  const m = parseInt(header[1])
  const grid: number[][] = []
  let sum = 0
  for (let i = 0; i < n; i++) {
    const row = lines[idx++].split(' ').map(Number)
    grid.push(row)
    for (let j = 0; j < m; j++) {
      sum += row[j]
    }
  }
  // 统计每行、每列的价值总和
  const rowSum: number[] = new Array(n).fill(0)
  const colSum: number[] = new Array(m).fill(0)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      rowSum[i] += grid[i][j]
      colSum[j] += grid[i][j]
    }
  }
  let result = Infinity
  // 水平切割：枚举 n - 1 条切割线，cut 为上半部分的和
  let cut = 0
  for (let i = 0; i < n - 1; i++) {
    cut += rowSum[i]
    result = Math.min(result, Math.abs(sum - cut - cut))
  }
  // 垂直切割：枚举 m - 1 条切割线
  cut = 0
  for (let j = 0; j < m - 1; j++) {
    cut += colSum[j]
    result = Math.min(result, Math.abs(sum - cut - cut))
  }
  return String(result)
}

// 卡码网 ACM 模式输入输出
const lines: string[] = []
require('readline').createInterface({ input: process.stdin })
  .on('line', (line: string) => lines.push(line))
  .on('close', () => console.log(solve(lines)))`
  }
}

export default solutions
