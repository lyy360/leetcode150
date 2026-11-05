import type { Solution } from './types'

/** 回溯算法题解（代码随想录讲解风格） */
const solutions: Record<string, Solution> = {
  'lc-combinations': {
    desc: `给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合。你可以按任何顺序返回答案。

**示例 1：**

- 输入：n = 4, k = 2
- 输出：[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
- 解释：从 1 到 4 中任取 2 个数字，所有不含重复元素的组合如上。

**提示：**

- 1 <= n <= 20
- 1 <= k <= n`,
    analysis: `### 核心思路
这是回溯法的入门题。把组合问题抽象成树形结构：n 相当于树的宽度，k 相当于树的深度。每层递归从集合中选一个数加入路径，然后递归地选下一个数，路径长度达到 k 就收集结果，回溯时撤销选择。

> 回溯法解决的问题都可以抽象为树形结构，组合问题本质上是在树中寻找长度为 k 的路径。

### 算法步骤
按照回溯三部曲来分析：

1. 递归函数参数：start 表示本层递归从集合的哪个位置开始搜索，避免选出重复组合；path 记录当前组合。
2. 终止条件：path.length === k 时，把 path 的拷贝放入结果集并返回。
3. 单层搜索逻辑：for 循环从 start 遍历到 n，每个数字先加入 path，再递归（下一层从 i + 1 开始，保证不重复选自己），最后 pop 撤销。

### 剪枝与去重
剪枝是本题的精髓。如果 start 之后的剩余元素不足以凑够 k 个，后面的循环完全没有意义。把循环上界从 n 收紧为 n - (k - path.length) + 1：还需要选 k - path.length 个数时，i 最多只能到 n - (k - path.length) + 1。剪枝后避免了大量无效分支。

### 易错点
- 收集结果必须 push([...path])，直接 push(path) 存的是引用，后续回溯会污染已存入的路径。
- 递归下一层要传 i + 1 而不是 start + 1，否则会产生 [2,1] 这类重复组合。
- 组合与排列不同：组合无序，靠 start 控制不回头；排列有序，每层都从头搜索。

### 复杂度分析
时间复杂度 O(C(n,k) × k)，枚举所有组合，每个组合拷贝开销 O(k)。空间复杂度 O(k)，为递归栈与路径深度（不计输出）。`,
    code: `function combine(n: number, k: number): number[][] {
  const res: number[][] = []
  const path: number[] = []

  const backtracking = (start: number) => {
    // 终止条件：凑够 k 个数，收集结果
    if (path.length === k) {
      res.push([...path])
      return
    }
    // 剪枝：i 的上界收紧为 n - (k - path.length) + 1
    for (let i = start; i <= n - (k - path.length) + 1; i++) {
      path.push(i)
      backtracking(i + 1)
      path.pop() // 回溯撤销
    }
  }

  backtracking(1)
  return res
}`
  },
  'lc-combination-sum-iii': {
    desc: `找出所有相加之和为 n 的 k 个数的组合，且满足：只使用数字 1 到 9，并且每个数字最多使用一次。返回所有可能的有效组合的列表，该列表不能包含相同的组合两次。

**示例 1：**

- 输入：k = 3, n = 7
- 输出：[[1,2,4]]
- 解释：1 + 2 + 4 = 7，这是唯一满足条件的组合。

**提示：**

- 2 <= k <= 9
- 1 <= n <= 60`,
    analysis: `### 核心思路
本题与 77.组合 的套路完全一致，只是多了两个约束：恰好选 k 个数、且和为 n，同时数字只能在 1~9 中选且每个数只用一次。在组合模板的基础上，额外用一个 sum 变量记录路径和即可。

### 算法步骤
按回溯三部曲分析：

1. 递归函数参数：start 表示本层从哪个数字开始搜，sum 记录当前路径和，path 记录路径。
2. 终止条件：path.length === k 时结算——sum === n 就收集结果，否则直接返回。
3. 单层搜索逻辑：for 从 start 遍历到 9，累加 sum、push 路径，递归时传 i + 1（每个数最多用一次），回溯时同时撤销 sum 与 path。

> 和是跟着路径走的，回溯时 sum 与 path 必须成对撤销，漏掉一个就会得到错误结果。

### 剪枝与去重
两处剪枝：其一，进入递归时若 sum > n 直接返回，数字都是正数，越往后和只会更大；其二，for 循环上界可收紧为 9 - (k - path.length) + 1，剩余数字不够凑 k 个时提前止步。

### 易错点
- 收集结果必须用 [...path] 拷贝，不能存引用。
- 每个数字只能用一次，递归传参是 i + 1；若传 i 就变成了可重复选取。
- 剪枝判断 sum > n 要放在递归入口，与终止条件配合，避免和超了还继续深入。

### 复杂度分析
时间复杂度不超过 O(C(9,k) × k)，最多从 9 个数里选 k 个且 k ≤ 9，规模很小。空间复杂度 O(k)，为递归深度（不计输出）。`,
    code: `function combinationSum3(k: number, n: number): number[][] {
  const res: number[][] = []
  const path: number[] = []
  let sum = 0

  const backtracking = (start: number) => {
    if (sum > n) return // 剪枝：和已超过目标
    if (path.length === k) {
      if (sum === n) res.push([...path])
      return
    }
    for (let i = start; i <= 9; i++) {
      sum += i
      path.push(i)
      backtracking(i + 1)
      sum -= i // 回溯：成对撤销
      path.pop()
    }
  }

  backtracking(1)
  return res
}`
  },
  'lc-letter-combinations-of-a-phone-number': {
    desc: `给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合，答案可以按任意顺序返回。数字到字母的映射与电话九宫格按键一致：2 对应 abc，3 对应 def，7 对应 pqrs，依此类推。

**示例 1：**

- 输入：digits = "23"
- 输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
- 解释：2 对应 abc，3 对应 def，两两组合共 9 种。

**提示：**

- 0 <= digits.length <= 4
- digits[i] 是范围 ['2', '9'] 的一个数字`,
    analysis: `### 核心思路
数字串的每一位都对应一串字母，所有组合数等于各位字母数的乘积，是典型的多集合笛卡尔积问题。把每个数字映射到字母串，用回溯逐位选取：第 index 层递归处理 digits[index] 对应的字母集合，从中选一个字母加入路径，深入下一层。

> 与组合题的区别：本题不是在同一个集合里反复选数，而是每个数字对应一个独立的小集合，层数由 digits 长度决定，因此不需要 start，直接用 index 表示处理到哪一位。

### 算法步骤
1. 递归函数参数：index 表示当前处理 digits 的第几位，path 收集本条路径的字母。
2. 终止条件：index === digits.length 时，把 path.join('') 存入结果。
3. 单层搜索逻辑：取出该数字对应的字母串，for 循环遍历其中每个字母，push、递归 index + 1、pop。

### 剪枝与去重
本题没有重复元素、也没有目标值约束，基本不需要剪枝。唯一要处理的是 digits 为空串时直接返回空数组，否则会得到 [''] 这样的错误结果。

### 易错点
- 忘记处理空串输入，返回了 ['']。
- 数字映射表下标要与字符对应：用 digits.charCodeAt(index) - 48 把字符转成 0~9 的下标，'0' 的 ASCII 码是 48，别减错偏移。
- 映射数组前两项留空占位，保证下标与数字一一对应。

### 复杂度分析
设 digits 长度为 m，每位平均对应 a 个字母。时间复杂度 O(a^m × m)：结果有 a^m 个，每个长度 m。空间复杂度 O(m)，为递归栈与路径（不计输出）。`,
    code: `function letterCombinations(digits: string): string[] {
  if (digits.length === 0) return []
  // 下标 0、1 留空占位，使下标与数字一一对应
  const map: string[] = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz']
  const res: string[] = []
  const path: string[] = []

  const backtracking = (index: number) => {
    if (index === digits.length) {
      res.push(path.join(''))
      return
    }
    const letters = map[digits.charCodeAt(index) - 48] // '0' 的 ASCII 是 48
    for (const ch of letters) {
      path.push(ch)
      backtracking(index + 1)
      path.pop()
    }
  }

  backtracking(0)
  return res
}`
  },
  'lc-combination-sum': {
    desc: `给你一个无重复元素的整数数组 candidates 和一个目标整数 target，找出 candidates 中可以使数字和为 target 的所有不同组合，并以列表形式返回。你可以按任意顺序返回这些组合，同一个数字可以被无限次重复选取。

**示例 1：**

- 输入：candidates = [2,3,6,7], target = 7
- 输出：[[2,2,3],[7]]
- 解释：2 和 3 可以重复选取，2 + 2 + 3 = 7；也可以直接选 7。注意 2 与 3 组合数不同即为不同组合。

**提示：**

- 1 <= candidates.length <= 30
- 2 <= candidates[i] <= 40
- candidates 中所有元素互不相同
- 1 <= target <= 40`,
    analysis: `### 核心思路
本题与组合问题的最大区别是同一个数字可以无限次选取。树形结构上体现为：递归进入下一层时，起点仍然是 i 而不是 i + 1，允许本层元素在下一层继续被选。由于元素互不相同且从 start 起搜，天然不会产生重复组合，不需要 used 数组。

> 可重复选取的本质：下一层的 start 仍取 i，表示还可以选自己；如果要求数字只能用一次，才传 i + 1。

### 算法步骤
1. 递归函数参数：start 控制本层从哪个下标开始，避免出现 [2,3,2] 与 [3,2,2] 之类的重复组合；sum 记录当前路径和。
2. 终止条件：sum === target 时收集 path 并返回。
3. 单层搜索逻辑：for 从 start 遍历候选数组，sum 加上当前数并 push，递归传 i，回溯时撤销 sum 与 path。

### 剪枝与去重
剪枝点在 for 循环内：若 sum + candidates[i] > target，直接 continue 跳过该分支。若先把数组排序，则一旦某个数加上后超了 target，后面的数更大，可以直接 break，剪枝效率更高。本题元素互不相同，无需树层去重。

### 易错点
- 递归时误传 i + 1，导致无法重复选取，漏掉 [2,2,3] 这类答案。
- 终止条件只写 sum === target，sum > target 交给剪枝处理；若不剪枝又不在超和时返回，会白白搜索甚至超时。
- 收集结果用 [...path] 拷贝。

### 复杂度分析
设 n 为候选数个数。时间复杂度上界为 O(n^(target/min))，min 是候选中的最小值，实际因剪枝远小于此。空间复杂度 O(target/min)，为递归深度（不计输出）。`,
    code: `function combinationSum(candidates: number[], target: number): number[][] {
  const res: number[][] = []
  const path: number[] = []
  let sum = 0

  const backtracking = (start: number) => {
    if (sum === target) {
      res.push([...path])
      return
    }
    for (let i = start; i < candidates.length; i++) {
      const num = candidates[i]
      if (sum + num > target) continue // 剪枝：超出目标跳过
      sum += num
      path.push(num)
      backtracking(i) // 关键：传 i 而不是 i + 1，允许重复选取
      sum -= num
      path.pop()
    }
  }

  backtracking(0)
  return res
}`
  },
  'lc-combination-sum-ii': {
    desc: `给定一个候选人编号的集合 candidates 和一个目标数 target，找出 candidates 中所有可以使数字和为 target 的组合。candidates 中的每个数字在每个组合中只能使用一次，解集不能包含重复的组合。

**示例 1：**

- 输入：candidates = [10,1,2,7,6,1,5], target = 8
- 输出：[[1,1,6],[1,2,5],[1,7],[2,6]]
- 解释：集合中有两个 1，去重后得到上述四种组合。

**提示：**

- 1 <= candidates.length <= 100
- 1 <= candidates[i] <= 50
- 1 <= target <= 30`,
    analysis: `### 核心思路
本题在 39.组合总和 基础上加了两条限制：每个数字只能用一次；集合本身可能有重复元素，要求解集中不出现重复组合。解决思路是先排序，再用 used 数组做树层去重：同一树层里相同的数字只允许选第一个，同一树枝上则不受限制（树枝上选的是不同下标的同值元素，属于合法选择）。

> 去重的关键在于区分树层与树枝：candidates[i] === candidates[i-1] 且 used[i-1] === false，说明同值的前一个元素在本层已被撤销，是树层重复，必须跳过；若 used[i-1] === true，说明正沿同一树枝深入，合法。

### 算法步骤
1. 递归函数参数：start 控制起点，sum 记录路径和，path 记录路径，used 数组标记元素使用状态，排序在回溯开始前完成。
2. 终止条件：sum === target 时收集 [...path] 并返回。
3. 单层搜索逻辑：for 从 start 开始，依次判断剪枝与去重条件，选数后 used[i] = true，递归传 i + 1（每个数只用一次），回溯时还原。

### 剪枝与去重
先排序带来两重收益：一是 sum + candidates[i] > target 时可以直接 break，后面只会更大；二是让相同元素相邻，配合 used 数组完成树层去重，省掉整棵同构子树。

### 易错点
- 不排序就去重会失效，相同的元素可能不相邻。
- 误把去重条件写成同值就跳过，会把树枝上的合法选择也剪掉。
- 递归传 i + 1 而不是 i，本题每个数字只能用一次。

### 复杂度分析
时间复杂度最坏 O(2^n × n)，n 是候选数个数；排序额外 O(n log n)。空间复杂度 O(n)，为 used 数组与递归深度（不计输出）。`,
    code: `function combinationSum2(candidates: number[], target: number): number[][] {
  const res: number[][] = []
  const path: number[] = []
  const used: boolean[] = new Array(candidates.length).fill(false)
  let sum = 0
  candidates.sort((a, b) => a - b) // 排序让相同元素相邻，去重的前提

  const backtracking = (start: number) => {
    if (sum === target) {
      res.push([...path])
      return
    }
    for (let i = start; i < candidates.length; i++) {
      const num = candidates[i]
      if (sum + num > target) break // 已排序，后面更大，直接剪掉
      // 树层去重：同层跳过重复元素
      if (i > 0 && num === candidates[i - 1] && !used[i - 1]) continue
      sum += num
      path.push(num)
      used[i] = true
      backtracking(i + 1) // 只能用一次，传 i + 1
      used[i] = false
      sum -= num
      path.pop()
    }
  }

  backtracking(0)
  return res
}`
  },
  'lc-palindrome-partitioning': {
    desc: `给你一个字符串 s，请你将 s 分割成一些子串，使每个子串都是回文串。返回 s 所有可能的分割方案。

**示例 1：**

- 输入：s = "aab"
- 输出：[["a","a","b"],["aa","b"]]
- 解释：两种分割方式中，每个子串都是回文串。

**提示：**

- 1 <= s.length <= 16
- s 仅由小写英文字母组成`,
    analysis: `### 核心思路
本题表面是分割问题，本质仍是组合：切割线在树形结构里就相当于组合中的选取。每层递归决定下一个切割点，切出的子串加入路径，切到字符串末尾就得到一种完整分割方案。判断回文是本题唯一的额外逻辑，不满足回文的子串直接剪掉。

> 分割问题与组合问题同构：s 的切割位置相当于在若干缝隙中做选择，切割线之后的部分是新的待选集合，start 就是当前切割起点。

### 算法步骤
1. 递归函数参数：start 表示本层从哪个下标开始切割，path 存放已切出的回文子串。
2. 终止条件：start === s.length，说明整条路径都是回文，收集 path。
3. 单层搜索逻辑：for 循环枚举切割终点 i，取出子串 s.substring(start, i + 1)，是回文才 push 并递归 i + 1，之后 pop 撤销。

### 剪枝与去重
核心剪枝就是回文判断：子串不是回文就 continue，整棵子树被跳过。若想进一步优化，可以先用动态规划预处理出任意区间是否回文，把判断降为 O(1)；本题规模下双指针原地判断已经足够。

### 易错点
- 切割终点 i 的取值：子串是 s.substring(start, i + 1)，注意右边界是闭的，别切出空串。
- 终止条件是 start === s.length，而不是用 path 长度判断。
- isPalindrome 双指针循环条件写错（应为 left < right），导致单字符被误判。

### 复杂度分析
设 n 为字符串长度。时间复杂度最坏 O(n × 2^n)：约有 2^(n-1) 种切法，每次判断与拷贝开销 O(n)。空间复杂度 O(n)，为递归深度与路径（不计输出）。`,
    code: `function partition(s: string): string[][] {
  const res: string[][] = []
  const path: string[] = []
  const n = s.length

  const isPalindrome = (str: string): boolean => {
    let left = 0
    let right = str.length - 1
    while (left < right) {
      if (str[left] !== str[right]) return false
      left++
      right--
    }
    return true
  }

  const backtracking = (start: number) => {
    // 切到末尾，说明整条路径都是回文
    if (start === n) {
      res.push([...path])
      return
    }
    for (let i = start; i < n; i++) {
      const sub = s.substring(start, i + 1)
      if (!isPalindrome(sub)) continue // 剪枝：不是回文直接跳过
      path.push(sub)
      backtracking(i + 1)
      path.pop()
    }
  }

  backtracking(0)
  return res
}`
  },
  'lc-restore-ip-addresses': {
    desc: `有效 IP 地址正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0）构成，整数之间用 '.' 分隔。给定一个只包含数字的字符串 s，用以表示一个 IP 地址，返回所有可能的有效 IP 地址。你可以按任何顺序返回答案。

**示例 1：**

- 输入：s = "25525511135"
- 输出：["255.255.11.135","255.255.111.35"]
- 解释：两种切分方式均满足每段在 0 到 255 之间且无前导 0。

**提示：**

- 1 <= s.length <= 20
- s 仅由数字组成`,
    analysis: `### 核心思路
本题可以看作分割回文串的变体：把字符串切成 4 段，每段是 0~255 的合法整数且不能有前导 0。用回溯模拟切割，path 收集每一段，最终用 '.' 连接。合法性判断集中在 isValid 函数里，问题规模被限制得很小。

> 与普通分割题的区别：本题最多切 4 段，可以用 path.length === 4 作为终止条件之一，同时要求 start 恰好走到字符串末尾，两个条件缺一不可。

### 算法步骤
1. 递归函数参数：start 为当前切割起点，path 收集已切出的段。
2. 终止条件：path.length === 4 时，若 start === n 则把 path.join('.') 存入结果，否则直接返回。
3. 单层搜索逻辑：for 枚举本段终点 i，取出子串做合法性判断，合法才 push 并递归 i + 1，之后 pop 撤销。

### 剪枝与去重
合法性判断本身就是强剪枝：段长超过 3、有前导 0、数值大于 255 都直接终止本分支。遇到非法子串应直接 break——子串只会越切越长，再往后也不可能合法。还可加一条：剩余字符数不足以填满剩下的段时提前返回。

### 易错点
- 前导 0 判断：'0' 单独成段合法，'01'、'010' 非法，只判数值范围会漏掉这种情况。
- 终止条件漏掉 start === n，会输出 4 段但没有用完整个字符串的方案。
- 拼接用 path.join('.')，不要手动累加分隔符导致多加点或漏加点。

### 复杂度分析
每段最多 3 个字符、共 4 段，搜索空间被限制在常数级，时间复杂度 O(3^4 × 4)，即 O(1)（不计输出）；空间复杂度 O(1)，递归深度至多 4。`,
    code: `function restoreIpAddresses(s: string): string[] {
  const res: string[] = []
  const path: string[] = []
  const n = s.length

  const isValid = (str: string): boolean => {
    if (str.length === 0 || str.length > 3) return false
    if (str.length > 1 && str[0] === '0') return false // 前导 0 非法
    const num = Number(str)
    return num >= 0 && num <= 255
  }

  const backtracking = (start: number) => {
    // 已切出 4 段：恰好用完整个字符串才是有效 IP
    if (path.length === 4) {
      if (start === n) res.push(path.join('.'))
      return
    }
    for (let i = start; i < n; i++) {
      const sub = s.substring(start, i + 1)
      if (!isValid(sub)) break // 只会越切越长，直接终止本层
      path.push(sub)
      backtracking(i + 1)
      path.pop()
    }
  }

  backtracking(0)
  return res
}`
  },
  'lc-subsets': {
    desc: `给你一个整数数组 nums，数组中的元素互不相同。返回该数组所有可能的子集（幂集）。解集不能包含重复的子集，你可以按任意顺序返回解集。

**示例 1：**

- 输入：nums = [1,2,3]
- 输出：[[],[1],[1,2],[1,3],[2],[2,3],[3]]
- 解释：空集与所有非空子集共 8 个，如上。

**提示：**

- 1 <= nums.length <= 10
- -10 <= nums[i] <= 10
- nums 中所有元素互不相同`,
    analysis: `### 核心思路
子集问题与组合问题的树形结构完全相同，区别只在收集结果的时机：组合是在叶子节点（path.length === k）收集，子集则是每一个节点都是合法结果，进入递归就先收集当前 path。因为元素互不相同，天然不会有重复子集。

> 子集是找树的所有节点，组合是找树的叶子节点，排列是找深度为 n 的路径——收集时机不同，是三者最本质的区别。

### 算法步骤
1. 递归函数参数：start 表示本层从哪个下标开始选，保证每个元素只选一次且不产生重复子集。
2. 终止条件：可以不显式写——for 循环范围是 start 到 nums.length，start 越界后循环自然结束，剩余节点早已收集过。
3. 单层搜索逻辑：进入递归先 push([...path]) 收集，再 for 循环选数、递归 i + 1、回溯 pop。

### 剪枝与去重
本题元素互不相同且要求输出所有子集，没有可以剪掉的分支，也没有去重需求，是最纯粹、最简洁的回溯模板。若面试官追问有重复元素的情况，就引出子集 II 的树层去重套路。

### 易错点
- 收集时机写成了 path.length === nums.length，最终只剩完整集合一个结果。
- 在 for 循环内先递归后收集，会漏掉部分节点；正确顺序是进入函数立即收集。
- 忘记 push 拷贝 [...path]，结果集里全是同一个引用。

### 复杂度分析
时间复杂度 O(n × 2^n)：子集共 2^n 个，每个拷贝 O(n)。空间复杂度 O(n)，为递归栈与 path（不计输出）。`,
    code: `function subsets(nums: number[]): number[][] {
  const res: number[][] = []
  const path: number[] = []

  const backtracking = (start: number) => {
    // 子集问题：每个节点都要收集，进入递归先收集
    res.push([...path])
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i])
      backtracking(i + 1)
      path.pop()
    }
  }

  backtracking(0)
  return res
}`
  },
  'lc-subsets-ii': {
    desc: `给你一个整数数组 nums，其中可能包含重复元素，请你返回该数组所有可能的子集（幂集）。解集不能包含重复的子集，返回的解集中，子集可以按任意顺序排列。

**示例 1：**

- 输入：nums = [1,2,2]
- 输出：[[],[1],[1,2],[1,2,2],[2],[2,2]]
- 解释：数组中有两个 2，去重后共 6 个子集。

**提示：**

- 1 <= nums.length <= 10
- -10 <= nums[i] <= 10`,
    analysis: `### 核心思路
本题是 78.子集 与 40.组合总和 II 的结合：既要每个节点都收集，又要在元素可重复的前提下对结果去重。套路仍然是排序 + used 数组做树层去重——同一层里相同的元素只选第一个，避免两棵同构子树输出重复子集；同一树枝上的重复元素合法，因为它们对应不同下标。

> 树层去重条件：nums[i] === nums[i-1] 且 used[i-1] === false 时 continue。false 说明同值前驱在本层已被撤销，再选必然产生重复子集。

### 算法步骤
1. 递归函数参数：start、path、used。排序必须放在回溯开始前完成。
2. 终止条件：无需显式终止，进入递归先收集 [...path]（包括空集），循环自然结束。
3. 单层搜索逻辑：for 从 start 开始，先判断树层去重条件，再 push、used[i] = true、递归 i + 1、回溯还原。

### 剪枝与去重
去重依赖排序让相同元素相邻，配合 used 判断，省掉的是整棵同构子树。本题所有节点都要收集，除此之外没有其他剪枝空间。

### 易错点
- 不排序直接去重，重复元素不相邻时判断失效。
- 去重条件写成同值就 continue，会把树枝上 [2,2] 这类合法子集也剪掉，必须同时要求 used[i-1] === false。
- 收集时机是进入递归立刻收集，注意空集也要输出。

### 复杂度分析
时间复杂度 O(n × 2^n)，排序额外 O(n log n)。空间复杂度 O(n)，为 used 数组与递归深度（不计输出）。`,
    code: `function subsetsWithDup(nums: number[]): number[][] {
  const res: number[][] = []
  const path: number[] = []
  const used: boolean[] = new Array(nums.length).fill(false)
  nums.sort((a, b) => a - b) // 排序让相同元素相邻

  const backtracking = (start: number) => {
    res.push([...path]) // 每个节点都收集
    for (let i = start; i < nums.length; i++) {
      // 树层去重：同层跳过重复元素
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue
      path.push(nums[i])
      used[i] = true
      backtracking(i + 1)
      used[i] = false
      path.pop()
    }
  }

  backtracking(0)
  return res
}`
  },
  'lc-permutations': {
    desc: `给定一个不含重复数字的数组 nums，返回其所有可能的全排列。你可以按任意顺序返回答案。

**示例 1：**

- 输入：nums = [1,2,3]
- 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
- 解释：3 个不同数字的全排列共 3! = 6 种。

**提示：**

- 1 <= nums.length <= 6
- -10 <= nums[i] <= 10
- nums 中的所有整数互不相同`,
    analysis: `### 核心思路
排列与组合的最大区别是顺序敏感：[1,2] 和 [2,1] 是两个不同的排列。因此每层递归都要从头搜索整个数组，不能用 start 限制起点，改用 used 数组标记哪些元素已在路径中，选过的跳过。

> 组合靠 start 控制不回头，排列靠 used 控制不重复选——排列的 for 循环每层都从 0 开始，把所有未用元素都作为候选。

### 算法步骤
1. 递归函数参数：本题无需 start，用 used 布尔数组标记使用状态，path 记录当前排列。
2. 终止条件：path.length === nums.length，收集 [...path]。
3. 单层搜索逻辑：for 从 0 遍历所有下标，used[i] 为 true 就 continue；否则 push、标记 used[i] = true、递归、取消标记、pop，五步成对出现。

### 剪枝与去重
本题元素互不相同，且要求输出所有排列，没有多余分支可剪，也不需要去重，是排列类问题的标准模板。所有去重技巧（used 数组、树层判断）都在下一题的基础上叠加。

### 易错点
- 沿用组合的 start 写法，每层只从后半段选，漏掉一半排列。
- used 标记与撤销不成对，导致同一元素被重复选入路径。
- 终止条件要靠 path 长度判断，与从头搜索的逻辑配套，别用 start 判断。

### 复杂度分析
时间复杂度 O(n × n!)：共 n! 个排列，每个拷贝开销 O(n)。空间复杂度 O(n)，为 used 数组、path 与递归深度（不计输出）。`,
    code: `function permute(nums: number[]): number[][] {
  const res: number[][] = []
  const path: number[] = []
  const used: boolean[] = new Array(nums.length).fill(false)

  const backtracking = () => {
    if (path.length === nums.length) {
      res.push([...path])
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue // 排列问题：从头选，用 used 跳过已用元素
      path.push(nums[i])
      used[i] = true
      backtracking()
      used[i] = false // 回溯：成对撤销
      path.pop()
    }
  }

  backtracking()
  return res
}`
  },
  'lc-permutations-ii': {
    desc: `给定一个可包含重复数字的序列 nums，按任意顺序返回所有不重复的全排列。

**示例 1：**

- 输入：nums = [1,1,2]
- 输出：[[1,1,2],[1,2,1],[2,1,1]]
- 解释：去重后共 3 种排列，[1,1,2] 与 [1,1,2]（两个 1 交换）视为同一种。

**提示：**

- 1 <= nums.length <= 8
- -10 <= nums[i] <= 10`,
    analysis: `### 核心思路
本题在 46.全排列 基础上允许元素重复，要求结果不重复。解法是排列模板 + 树层去重：先排序让相同元素相邻，再借助 used 数组区分树层与树枝。这与组合总和 II、子集 II 是同一套去重逻辑，只是应用在排列的搜索结构上。

> 对排列而言，树层去重条件 nums[i] === nums[i-1] 且 used[i-1] === false 同样成立：同值前驱被撤销后又在同一层被再次选择，两棵子树完全同构，必产生重复排列，故跳过。

### 算法步骤
1. 递归函数参数：path、used，排序在回溯开始前完成。
2. 终止条件：path.length === nums.length，收集拷贝。
3. 单层搜索逻辑：for 从 0 开始，先判 used[i] 跳过已用元素，再判树层去重条件跳过同层同值，然后 push、标记、递归、还原、pop。

### 剪枝与去重
去重即本题最大的剪枝，省去的是整棵同构子树。也可以用不排序的方案：用 Set 记录本层已选的元素值，效果等价；但排序 + used 是覆盖组合、子集、排列的通用套路，建议熟练掌握一种。

### 易错点
- 忘记排序，重复元素不相邻，去重失效。
- 去重条件漏写 used[i-1] === false，把树枝上的重复元素误剪，结果不完整。
- continue 的判断顺序：先跳过已使用的元素，再做树层去重判断，两者不能合并成一个条件。

### 复杂度分析
时间复杂度 O(n × n!)：去重只影响常数因子，最坏仍要枚举全部排列。空间复杂度 O(n)，为 used、path 与递归栈（不计输出）。`,
    code: `function permuteUnique(nums: number[]): number[][] {
  const res: number[][] = []
  const path: number[] = []
  const used: boolean[] = new Array(nums.length).fill(false)
  nums.sort((a, b) => a - b) // 排序让相同元素相邻

  const backtracking = () => {
    if (path.length === nums.length) {
      res.push([...path])
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue
      // 树层去重：同层相同元素只选第一个
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue
      path.push(nums[i])
      used[i] = true
      backtracking()
      used[i] = false
      path.pop()
    }
  }

  backtracking()
  return res
}`
  },
  'lc-n-queens': {
    desc: `按照国际象棋的规则，皇后可以攻击与之处在同一行、同一列或同一斜线上的棋子。n 皇后问题研究的是如何将 n 个皇后放置在 n × n 的棋盘上，并且使皇后彼此之间不能相互攻击。给你一个整数 n，返回所有不同的 n 皇后问题的解决方案，每一种解法包含一个不同的棋子放置方案，方案中 'Q' 和 '.' 分别代表了皇后和空位。

**示例 1：**

- 输入：n = 4
- 输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
- 解释：4 皇后问题存在两个不同的解法，如上两个棋盘。

**提示：**

- 1 <= n <= 9`,
    analysis: `### 核心思路
N 皇后是回溯法的集大成者。棋盘是二维的，但每行只能放一个皇后，于是可以转化为一维选择：第 row 层递归决定第 row 行的皇后放在哪一列。逐行放置后，同一行天然不会冲突，只需检查列与斜线，冲突检查也只需回看之前行的皇后位置。

> 二维问题一维化是本题的关键转化：搜索的树深是 n（行），树的宽度也是 n（列），合法性检查负责剪掉不满足约束的分支。

### 算法步骤
1. 递归函数参数：row 表示当前处理第几行；queens[row] 记录该行皇后所在的列。
2. 终止条件：row === n，说明 n 行都放好了，把 queens 翻译成由 'Q' 与 '.' 组成的棋盘字符串存入结果。
3. 单层搜索逻辑：for 遍历当前行的每一列，isValid 通过才放置，递归处理下一行，回溯时撤销。

### 剪枝与去重
剪枝就是合法性检查：同列冲突直接排除；斜线冲突用行列差的绝对值判断——Math.abs(row - r) === Math.abs(col - c) 说明两个位置在同一条斜线上。由于逐行放置，检查时要回看之前所有行的皇后。

### 易错点
- 斜线判断只写主对角线方向（row - col 相等）会漏掉副对角线，必须用行列差的绝对值。
- 结果集需要字符串棋盘：先填满 '.' 再在皇后列覆盖 'Q'，别把数字数组直接放进去。
- n 为 1 时答案是 [["Q"]]，这个边界要能通过。

### 复杂度分析
时间复杂度上界 O(n!)：第一行 n 种选择，第二行至多 n - 1 种，依此类推，每次合法性检查 O(n)。空间复杂度 O(n)，为递归深度与皇后记录数组（不计输出）。`,
    code: `function solveNQueens(n: number): string[][] {
  const res: string[][] = []
  const queens: number[] = [] // queens[i] 表示第 i 行皇后放在第 queens[i] 列

  // 检查 (row, col) 是否与之前的皇后冲突
  const isValid = (row: number, col: number): boolean => {
    for (let r = 0; r < row; r++) {
      const c = queens[r]
      if (c === col) return false // 同列冲突
      if (Math.abs(row - r) === Math.abs(col - c)) return false // 同斜线冲突
    }
    return true
  }

  const backtracking = (row: number) => {
    if (row === n) {
      // 把一维皇后记录翻译成字符串棋盘
      res.push(queens.map((c) => {
        const cells: string[] = new Array(n).fill('.')
        cells[c] = 'Q'
        return cells.join('')
      }))
      return
    }
    for (let col = 0; col < n; col++) {
      if (!isValid(row, col)) continue
      queens.push(col)
      backtracking(row + 1)
      queens.pop()
    }
  }

  backtracking(0)
  return res
}`
  },
  'lc-sudoku-solver': {
    desc: `编写一个程序，通过填充空格来解决数独问题。数独的解法需遵循如下规则：数字 1-9 在每一行只能出现一次；在每一列只能出现一次；在每一个以粗实线分隔的 3 × 3 宫内只能出现一次。空白格用 '.' 表示，需要原地修改棋盘 board。题目数据保证输入数独只有唯一解。

**示例 1：**

- 输入：board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]
- 输出：board = [["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]
- 解释：输入数独被填充为如上唯一解。

**提示：**

- board.length == 9
- board[i].length == 9
- board[i][j] 是一位数字或者 '.'
- 题目数据保证输入数独只有一个解`,
    analysis: `### 核心思路
解数独与 N 皇后不同：棋盘上每个空位都要填，且必须找到唯一解，因此递归需要返回布尔值——一旦某条分支填完整张棋盘，立即逐层返回 true 终止搜索。二维棋盘直接双层循环找 '.'，找到后尝试 1~9，合法就填入并深入，失败则恢复 '.' 换下一个数字。

> N 皇后逐行放置只需一维选择，数独则要在整个棋盘上找空位——双层循环找格子的写法是数独题的标配。

### 算法步骤
1. 递归函数参数：无需额外参数，board 就是操作对象，返回 boolean 表示是否已找到解。
2. 终止条件：双层循环没有发现任何 '.'，说明全部填完，返回 true。
3. 单层搜索逻辑：找到空位后枚举 1~9，isValid 校验行、列、3 × 3 宫均无冲突才填入并递归；递归返回 true 直接向上传递，否则恢复 '.' 换下一个数；九个数字都失败则返回 false，让上层换别的填法。

### 剪枝与去重
合法性检查即剪枝：任一位置冲突立即跳过该数字。返回值 true 的短路传递是最重要的优化，找到唯一解后不再做任何无谓搜索。

### 易错点
- 递归返回值写成 void，无法在找到解后停止，会继续回溯导致行为错误。
- 填入失败后忘记把 '.' 还原，棋盘被污染。
- 3 × 3 宫左上角坐标计算：r0 = Math.floor(row / 3) × 3，别算错偏移。

### 复杂度分析
最坏时间复杂度指数级，约为 O(9^m)，m 是空格数量，实际因剪枝与唯一解短路远小于此。空间复杂度 O(m)，为递归深度。`,
    code: `function solveSudoku(board: string[][]): void {
  const n = 9

  // 检查在 (row, col) 填入 val 是否冲突
  const isValid = (row: number, col: number, val: string): boolean => {
    for (let i = 0; i < n; i++) {
      if (board[row][i] === val) return false // 同行冲突
      if (board[i][col] === val) return false // 同列冲突
    }
    // 所在 3 x 3 宫的左上角坐标
    const r0 = Math.floor(row / 3) * 3
    const c0 = Math.floor(col / 3) * 3
    for (let r = r0; r < r0 + 3; r++) {
      for (let c = c0; c < c0 + 3; c++) {
        if (board[r][c] === val) return false // 同宫冲突
      }
    }
    return true
  }

  // 返回 true 表示整张棋盘已填完，逐层短路终止搜索
  const backtracking = (): boolean => {
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (board[row][col] !== '.') continue
        for (let v = 1; v <= 9; v++) {
          const val = String(v)
          if (!isValid(row, col, val)) continue
          board[row][col] = val
          if (backtracking()) return true
          board[row][col] = '.' // 回溯还原
        }
        return false // 1~9 都放不下，触发上层回溯
      }
    }
    return true // 没有空格了，全部填完
  }

  backtracking()
}`
  },
  'lc-increasing-subsequences': {
    desc: `给你一个整数数组 nums，找出并返回所有该数组中不同的递增子序列，递增子序列中至少有两个元素。你可以按任意顺序返回答案。数组中可能含有重复元素，如出现两个整数相等，也可以视作递增序列的一种特殊情况。

**示例 1：**

- 输入：nums = [4,6,7,7]
- 输出：[[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]
- 解释：所有长度至少为 2 且不重复的递增子序列如上。

**提示：**

- 1 <= nums.length <= 15
- -100 <= nums[i] <= 100`,
    analysis: `### 核心思路
本题形似求子集，但有两点不同：一是结果必须是长度至少为 2 的递增序列，二是元素可能重复但输入不能排序（排序会破坏原始递增关系）。因此去重不能靠排序 + used 的套路，改用每层独立的 Set 记录本层已用过的元素值，实现树层去重。

> 本题不能排序：递增子序列的判断依赖原数组的先后顺序，排序后就无从谈递增了，这是它与子集 II 最关键的区别。

### 算法步骤
1. 递归函数参数：start 表示本层从哪个下标开始选，path 记录当前子序列。
2. 收集时机：进入递归时若 path.length >= 2 就收集，之后继续深入——收集的是树中所有满足长度的节点，而不只是叶子。
3. 单层搜索逻辑：for 从 start 开始，先判断 nums[i] 是否不小于 path 末尾元素（保证递增），再用本层 Set 判断是否重复，都通过才选择并递归。

### 剪枝与去重
递增性判断即剪枝：小于路径末尾的元素直接跳过。Set 去重是树层级别的：同层出现相同值只选第一个。每层递归新建 Set，互不干扰，这正是它能替代排序 + used 方案的原因。

### 易错点
- 习惯性先 sort，直接破坏题意，结果完全错误。
- Set 写成了全局变量，跨层去重会把合法树枝也剪掉。
- 收集时漏掉 path.length >= 2 的判断，输出了单元素子序列。

### 复杂度分析
时间复杂度最坏 O(n × 2^n)，n ≤ 15，规模可控。空间复杂度 O(n)（不计输出），递归深度与本层 Set 开销均为线性级别。`,
    code: `function findSubsequences(nums: number[]): number[][] {
  const res: number[][] = []
  const path: number[] = []

  const backtracking = (start: number) => {
    if (path.length >= 2) res.push([...path]) // 至少两个元素才收集
    if (start === nums.length) return
    const used = new Set<number>() // 本层去重：每层递归独立
    for (let i = start; i < nums.length; i++) {
      if (path.length > 0 && nums[i] < path[path.length - 1]) continue // 必须递增
      if (used.has(nums[i])) continue // 同层重复元素跳过
      used.add(nums[i])
      path.push(nums[i])
      backtracking(i + 1)
      path.pop()
    }
  }

  backtracking(0)
  return res
}`
  },
  'lc-reconstruct-itinerary': {
    desc: `给你一份航线列表 tickets，其中 tickets[i] = [fromi, toi] 表示飞机出发和降落的机场地点。请你重新规划行程顺序，所有这些机票都属于一个从 JFK（肯尼迪国际机场）出发的先生，所以该行程必须从 JFK 开始。如果存在多种有效的行程，请按字典序返回最小的行程组合。假定所有机票至少存在一种合理的行程，且所有的机票必须都用一次并且只能用一次。

**示例 1：**

- 输入：tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]
- 输出：["JFK","MUC","LHR","SFO","SJC"]
- 解释：另一种行程是 ["JFK","SFO"] 开头的组合，但字典序更大。

**提示：**

- 1 <= tickets.length <= 300
- tickets[i].length == 2
- fromi.length == 3, toi.length == 3
- fromi != toi
- 所有的 tickets[i] 都由大写英文字母组成`,
    analysis: `### 核心思路
这是回溯在图上的应用：把每张机票看作一条有向边，行程就是从 JFK 出发恰好用完所有边的路径。用邻接表存图，并对每个机场的目的地列表排序，保证搜索时优先走字典序最小的机场。因为必须用完所有票，递归要返回布尔值，找到完整行程立即短路返回。

> 死胡同问题：走了一条路发现剩下的票无法用完，必须回溯换路线，所以不能贪心地一路走到底，回溯返回值是本题的灵魂。

### 算法步骤
1. 递归函数参数：无需额外参数，res 记录当前行程，已用机票在邻接表里做标记。
2. 终止条件：res.length === tickets.length + 1——机场数比机票数多 1，说明所有机票恰好用完，返回 true。
3. 单层搜索逻辑：取 res 末尾作为出发机场，遍历其目的地列表，跳过已使用的机票，选择后递归；返回 true 直接向上传递，否则撤销恢复。

### 剪枝与去重
目的地排序保证首个可行解就是字典序最小的，配合短路返回，避免生成全部可行解再排序。已用机票的标记用置空串实现，省去额外的 used 结构。

### 易错点
- 忘记对目的地排序，或排序时机不对，得到的不是字典序最小行程。
- 递归没有返回值，陷入全量枚举后超时。
- 终止条件写成 res.length === tickets.length，差了 1。

### 复杂度分析
设 m 为机票数。时间复杂度最坏 O(m × m log m) 量级，含排序开销与回溯枚举；存在合理行程时短路会大幅剪枝。空间复杂度 O(m)，为图、递归深度与行程记录（不计输出）。`,
    code: `function findItinerary(tickets: string[][]): string[] {
  const graph: Record<string, string[]> = {}
  for (const [from, to] of tickets) {
    if (!graph[from]) graph[from] = []
    graph[from].push(to)
  }
  // 目的地按字典序排序，保证优先走字典序最小的机场
  for (const key in graph) {
    graph[key].sort()
  }

  const res: string[] = ['JFK']
  const total = tickets.length

  const backtracking = (): boolean => {
    if (res.length === total + 1) return true // 所有机票用完
    const dests = graph[res[res.length - 1]]
    if (!dests) return false // 死胡同
    for (let i = 0; i < dests.length; i++) {
      const to = dests[i]
      if (to === '') continue // 已使用的机票跳过
      dests[i] = '' // 标记机票已用
      res.push(to)
      if (backtracking()) return true
      dests[i] = to // 回溯恢复
      res.pop()
    }
    return false
  }

  backtracking()
  return res
}`
  }
}

export default solutions
