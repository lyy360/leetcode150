import type { Solution } from './types'

const solutions: Record<string, Solution> = {
  'lc-daily-temperatures': {
    desc: `给定一个整数数组 temperatures 表示每天的温度，返回一个数组 answer，其中 answer[i] 表示对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。

**示例 1：**

- 输入：temperatures = [73,74,75,71,69,72,76,73]
- 输出：[1,1,4,2,1,1,0,0]
- 解释：第 0 天温度 73，下一天 74 更高，记 1；第 2 天温度 75，直到第 6 天的 76 才更高，记 4。

**示例 2：**

- 输入：temperatures = [30,40,50,60]
- 输出：[1,1,1,0]
- 解释：温度逐日升高，只有最后一天找不到更高温度，记 0。

**提示：**

- 1 <= temperatures.length <= 10^5
- 30 <= temperatures[i] <= 100`,
    analysis: `### 核心思路

本题求"每个元素右边第一个比它大的元素到它的距离"，是单调栈的入门模板题。暴力做法对每一天向右扫描，最坏 O(n^2)，在 n 达到 10^5 时必然超时。单调栈的思路是：维护一个存放**下标**的栈，栈内对应的温度从栈底到栈顶严格递减；当来了一根更高的温度，栈里所有比它矮的温度就同时找到了答案，一次弹出即可。

> 单调栈的本质是摊还分析：每个下标最多入栈一次、出栈一次，所以虽然写起来是两层循环，总操作次数仍然是 O(n)。

### 算法步骤

1. 初始化答案数组为全 0，栈中存放数组下标。
2. 从左到右遍历温度数组：若当前温度**严格大于**栈顶下标对应的温度，弹出栈顶下标 prev，并记录 answer[prev] = 当前下标 - prev。
3. 反复弹栈直到栈顶温度不小于当前温度，再把当前下标入栈。
4. 遍历结束后仍在栈中的下标，说明右边没有更高温度，答案保持 0。

~~~text
温度 [73,74,75,71,69,72,76,73] 的弹栈过程：
i=5 温度 72 高于栈顶 69，弹出下标 4 记 answer[4]=1，
又高于 71，弹出下标 3 记 answer[3]=2，随后 72 入栈
i=6 温度 76 连续弹出 5、2，记 answer[5]=1、answer[2]=4
~~~

### 易错点

- 栈里存的是**下标**而不是温度值，否则无法计算"隔了几天"。
- 弹栈条件必须是严格大于，温度相等不算"更高"，相等元素要留在栈里继续等待。
- 最后栈中剩余元素无需清理，答案数组初始为 0 已经覆盖了这种情况。

### 复杂度分析

- 时间复杂度：O(n)，每个下标最多入栈、出栈各一次。
- 空间复杂度：O(n)，为单调栈的开销，最坏情况（温度递减）栈内保留全部下标。`,
    code: `function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length
  const answer = new Array(n).fill(0)
  // 单调栈存放数组下标，栈内温度从栈底到栈顶单调递减
  const stack: number[] = []
  for (let i = 0; i < n; i++) {
    // 当前温度高于栈顶对应温度时，栈顶元素找到了第一个更高温度
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIndex = stack.pop()!
      answer[prevIndex] = i - prevIndex
    }
    stack.push(i)
  }
  return answer
}`
  },
  'lc-next-greater-element-i': {
    desc: `nums1 中数字 x 的下一个更大元素是指 x 在 nums2 中对应位置右侧的第一个比 x 大的元素。给你两个没有重复元素的数组 nums1 和 nums2（下标从 0 开始），其中 nums1 是 nums2 的子集。对于每个 0 <= i < nums1.length，找出满足 nums1[i] == nums2[j] 的下标 j，并确定 nums2[j] 的下一个更大元素；如果不存在，本次查询的答案是 -1。返回长度为 nums1.length 的数组 ans 作为答案。

**示例 1：**

- 输入：nums1 = [4,1,2], nums2 = [1,3,4,2]
- 输出：[-1,3,-1]
- 解释：4 在 nums2 中没有下一个更大元素；1 的下一个更大元素是 3；2 没有下一个更大元素。

**示例 2：**

- 输入：nums1 = [2,4], nums2 = [1,2,3,4]
- 输出：[3,-1]
- 解释：2 的下一个更大元素是 3；4 没有下一个更大元素。

**提示：**

- 1 <= nums1.length <= nums2.length <= 1000
- 0 <= nums1[i], nums2[i] <= 10^4
- nums1 和 nums2 中所有整数互不相同，且 nums1 中的所有整数都出现在 nums2 中`,
    analysis: `### 核心思路

本题是 739 题的铺垫：在 nums2 中为每个元素找右侧第一个更大元素，再回答 nums1 的查询。如果对 nums1 中每个值都去 nums2 里向右线性扫描，复杂度是 O(m × n)；更好的做法是先对 nums2 整体跑一遍单调栈，把所有元素的答案存进哈希表，之后每个查询只要 O(1) 查表。

> 这是"先预处理、后查询"的经典套路：单调栈负责一次性算出全部答案，哈希表负责把每次查询降为常数时间。

### 算法步骤

1. 创建哈希表 nextGreater，遍历 nums2，维护一个栈内元素递减的单调栈（本题元素互不相同，直接存元素值即可）。
2. 当前元素大于栈顶时，弹出栈顶并记录 nextGreater[栈顶值] = 当前元素，重复此过程后将当前元素入栈。
3. 遍历 nums1，对每个值查哈希表，查不到就填 -1。

### 易错点

- 注意是在 **nums2** 中找下一个更大元素，nums1 只是查询列表，别在 nums1 上建栈。
- 题目保证元素互不相同，才能放心以"元素值"作为哈希键；若有重复值则必须改为存下标。
- 弹栈结束后栈内剩余元素没有更大值，它们不在哈希表中，查询时自然返回 -1，无需特判。

### 复杂度分析

- 时间复杂度：O(m + n)，其中 n 为 nums2 长度、m 为 nums1 长度；建表 O(n)，查询 O(m)。
- 空间复杂度：O(n)，哈希表与单调栈的开销。`,
    code: `function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  const nextGreater = new Map<number, number>()
  // 单调栈：栈内元素从栈底到栈顶单调递减
  const stack: number[] = []
  for (const num of nums2) {
    while (stack.length > 0 && num > stack[stack.length - 1]) {
      nextGreater.set(stack.pop()!, num)
    }
    stack.push(num)
  }
  // nums1 中每个值直接查表，查不到说明没有更大元素
  return nums1.map(num => nextGreater.get(num) ?? -1)
}`
  },
  'lc-next-greater-element-ii': {
    desc: `给定一个循环数组 nums（nums[nums.length - 1] 的下一个元素是 nums[0]），返回 nums 中每个元素的下一个更大元素。数字 x 的下一个更大元素是按数组遍历顺序排在 x 之后的第一个比它更大的数，这意味着你需要循环地搜索；如果不存在，则输出 -1。

**示例 1：**

- 输入：nums = [1,2,1]
- 输出：[2,-1,2]
- 解释：第一个 1 的下一个更大元素是 2；2 找不到更大的数；第二个 1 需要循环搜索，答案也是 2。

**示例 2：**

- 输入：nums = [1,2,3,4,3]
- 输出：[2,3,4,-1,4]
- 解释：最后一个 3 的下一个更大元素需要绕回数组开头，找到 4。

**提示：**

- 1 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9`,
    analysis: `### 核心思路

与 496 题唯一的区别是数组变成**循环**的：找下一个更大元素时可以绕回开头。处理循环数组的通用技巧是把数组"虚拟拉长"为两倍——遍历 i 从 0 到 2n-1，用 i % n 映射回真实下标，逻辑上等价于在原数组后面再拼接一份自己，却不用真的复制数组。

> 为什么遍历两遍就够？任何元素的下一个更大元素若存在，一定在从它开始的两倍长度范围内；绕满一圈还没找到，再绕下去也不会有，因为又回到了起点。

### 算法步骤

1. 答案数组初始化为全 -1，栈中存放真实下标。
2. i 从 0 遍历到 2n-1，取 index = i % n：当 nums[index] 大于栈顶下标对应值时，弹出栈顶并记录 answer[栈顶] = nums[index]。
3. **只有第一圈（i < n）才把下标入栈**，第二圈仅做弹栈更新，不再入栈。
4. 遍历结束，仍未被更新的位置保持 -1。

### 易错点

- 第二圈重复入栈是最大陷阱：同一个下标会被处理两次，甚至出现自己和自己比较，导致答案错误。
- 栈里存的是真实下标，取值时统一用 nums[index]（index 是取模后的），不要和 i 混用。
- 元素可能为负数，答案数组必须初始化为 -1，不能用 0 充当"不存在"的标记。

### 复杂度分析

- 时间复杂度：O(n)，虽然循环 2n 次，但每个真实下标最多入栈、出栈各一次。
- 空间复杂度：O(n)，单调栈最多存放 n 个下标。`,
    code: `function nextGreaterElements(nums: number[]): number[] {
  const n = nums.length
  const answer = new Array(n).fill(-1)
  const stack: number[] = []
  // 遍历两遍模拟循环数组，i % n 映射回真实下标
  for (let i = 0; i < 2 * n; i++) {
    const index = i % n
    while (stack.length > 0 && nums[index] > nums[stack[stack.length - 1]]) {
      const prevIndex = stack.pop()!
      answer[prevIndex] = nums[index]
    }
    // 只有第一圈需要入栈，避免同一元素被重复处理
    if (i < n) {
      stack.push(index)
    }
  }
  return answer
}`
  },
  'lc-trapping-rain-water': {
    desc: `给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

**示例 1：**

- 输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
- 输出：6
- 解释：该数组表示的高度图中，低洼处可接 6 个单位的雨水。

**示例 2：**

- 输入：height = [4,2,0,3,2,5]
- 输出：9

**提示：**

- n == height.length
- 1 <= n <= 2 * 10^4
- 0 <= height[i] <= 10^5`,
    analysis: `### 核心思路

接雨水的关键是想清楚：每个位置能接的水由它左右两侧的最高柱子决定，水量 = min(左侧最高, 右侧最高) - 自身高度。单调栈采用**按行（横向）接水**的视角：栈内下标对应高度递减，当出现更高的柱子时，栈顶元素正好是某个凹槽的底部，弹出它，左边界是新栈顶、右边界是当前柱子，三者在水平方向围出一块水。

> 双指针法按"竖向一格一格"算水，单调栈则按"横向一块一块凹槽"算水，两种视角得到的总量相同；弹栈的过程恰好依次暴露出每一个凹槽。

### 算法步骤

1. 栈存放数组下标，栈内高度从栈底到栈顶递减。
2. 遍历数组：当前柱子高于栈顶时进入循环弹栈。
3. 每弹出一个下标 mid：若栈已空说明左侧没有墙，直接跳出循环；否则 left 为新栈顶，宽度 = i - left - 1，高度 = min(height[i], height[left]) - height[mid]，累加到结果。
4. 当前下标入栈。

### 易错点

- 弹栈后**必须先判断栈是否为空**：栈空意味着凹槽没有左墙，接不了水，要立即跳出循环。
- 凹槽高度用左右边界的较小值减去底部高度；当前柱子和左边界等高时算出的高度为 0，属于正常情况。
- 宽度是下标差再减 1，别把两根墙柱自身算进水面宽度里。

### 复杂度分析

- 时间复杂度：O(n)，每个下标最多入栈、出栈各一次。
- 空间复杂度：O(n)，最坏情况（高度递减）栈内保留全部下标。`,
    code: `function trap(height: number[]): number {
  const stack: number[] = []
  let water = 0
  for (let i = 0; i < height.length; i++) {
    // 当前柱子高于栈顶时，栈顶元素是凹槽底部，可以横向接水
    while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
      const mid = stack.pop()!
      if (stack.length === 0) break // 左侧没有墙，接不了水
      const left = stack[stack.length - 1]
      const width = i - left - 1
      const h = Math.min(height[i], height[left]) - height[mid]
      water += width * h
    }
    stack.push(i)
  }
  return water
}`
  },
  'lc-largest-rectangle-in-histogram': {
    desc: `给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1。求在该柱状图中，能够勾勒出来的矩形的最大面积。

**示例 1：**

- 输入：heights = [2,1,5,6,2,3]
- 输出：10
- 解释：最大的矩形出现在下标 2 到 3 的两根柱子上，高度为 5，面积为 10。

**示例 2：**

- 输入：heights = [2,4]
- 输出：4
- 解释：可以选任意一根柱子作为矩形的高，最大面积为 4。

**提示：**

- 1 <= heights.length <= 10^5
- 0 <= heights[i] <= 10^4`,
    analysis: `### 核心思路

枚举每根柱子作为"决定矩形高度"的那一根：以它为高的矩形能向左右扩展，直到两侧第一根比它矮的柱子为止。于是问题转化为对每根柱子求左右第一个更小元素，这正是单调递增栈擅长的事——当一根柱子被弹出时，触发它出栈的柱子就是它右侧第一个更小元素，弹出后的新栈顶就是它左侧第一个更小元素。

> 人为安排一根高度为 0 的哨兵柱子（遍历到下标 n 时按高度 0 处理即可，不必真的修改数组），保证所有真实柱子最终都会被弹出，省去遍历结束后单独清算栈内剩余元素的步骤。

### 算法步骤

1. 栈存放数组下标，栈内高度从栈底到栈顶递增。
2. i 从 0 遍历到 n（含 n，此时按高度 0 的哨兵处理）：当前高度小于栈顶高度时循环弹栈。
3. 每弹出一个下标 cur：左边界 left 为新栈顶（栈空则记为 -1），宽度 = i - left - 1，面积 = heights[cur] × 宽度，更新最大面积。
4. 当前下标入栈。

### 易错点

- 弹栈条件用严格小于即可：相等高度的柱子先留在栈里，最后由其中最左边那根统一结算出最大宽度，结果不受影响。
- 计算宽度时 left 是"左侧第一根更矮柱子"的下标，矩形不包含它，所以宽度要减 1；栈空时 left 取 -1，宽度恰为 i。
- 别漏掉遍历到 n 的哨兵轮次，否则栈中一直递增的柱子永远无法结算，答案偏小。

### 复杂度分析

- 时间复杂度：O(n)，每根柱子最多入栈、出栈各一次。
- 空间复杂度：O(n)，最坏情况（高度递增）栈内保留全部下标。`,
    code: `function largestRectangleArea(heights: number[]): number {
  const n = heights.length
  const stack: number[] = []
  let maxArea = 0
  // i 遍历到 n 时视为高度 0 的右哨兵，逼出栈中所有柱子
  for (let i = 0; i <= n; i++) {
    const curHeight = i === n ? 0 : heights[i]
    while (stack.length > 0 && curHeight < heights[stack[stack.length - 1]]) {
      const cur = stack.pop()!
      const left = stack.length > 0 ? stack[stack.length - 1] : -1
      const width = i - left - 1
      maxArea = Math.max(maxArea, heights[cur] * width)
    }
    stack.push(i)
  }
  return maxArea
}`
  }
}

export default solutions
