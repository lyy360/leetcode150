import type { Solution } from './types'

const solutions: Record<string, Solution> = {
  'lc-valid-anagram': {
    desc: `给定两个字符串 s 和 t，判断 t 是否是 s 的字母异位词。字母异位词指的是两个字符串包含的字母完全相同，且每个字母出现的次数也完全相同，只是排列顺序可能不同。若不是异位词则返回 false。

**示例 1：**
- 输入：s = "anagram", t = "nagaram"
- 输出：true

**示例 2：**
- 输入：s = "rat", t = "car"
- 输出：false

**提示：**
- 1 <= s.length, t.length <= 5 * 10^4
- s 和 t 仅包含小写字母`,
    analysis: `### 核心思路

字母异位词的本质是：两个字符串中每个字符出现的次数完全一致。因此只需要统计字符频次，无需排序比较。

由于题目限定只包含小写字母，可以用一个长度为 26 的数组作为哈希表，下标对应字符，值对应出现次数。

> 数组就是最简单的哈希表。当数据规模小且可控（如 26 个小写字母）时，直接用数组实现哈希，既省空间又最快。

遍历 s 时把对应位置计数加一，遍历 t 时减一，最后数组全为零则互为异位词。还可以先比较两个字符串长度，长度不同直接返回 false，提前剪枝。

### 算法步骤

1. 若 s 和 t 长度不相等，直接返回 false。
2. 创建长度为 26 的数组 record，全部初始化为 0。
3. 遍历 s，对每个字符将 record[字符 - 'a'] 加一。
4. 遍历 t，对每个字符将 record[字符 - 'a'] 减一。
5. 遍历 record，若存在非零项则返回 false，否则返回 true。

### 易错点

- 计算字符下标时要减去字符 a 的编码值，不能直接拿字符当下标。
- 遍历 t 时若某位置减成负数，说明 t 中该字符更多，可以立即返回 false。
- 也可以先加后减再统一检查，两种写法都要保证最终每个计数恰好归零。

### 复杂度分析

- 时间复杂度：O(n + m)，n 和 m 分别为两个字符串的长度，各遍历一次。
- 空间复杂度：O(1)，辅助数组长度固定为 26，与输入规模无关。`,
    code: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false
  const record: number[] = new Array(26).fill(0)
  // 遍历 s，统计每个字符出现次数
  for (const ch of s) {
    record[ch.charCodeAt(0) - 97]++
  }
  // 遍历 t，做抵消，出现负数说明字符数量对不上
  for (const ch of t) {
    record[ch.charCodeAt(0) - 97]--
    if (record[ch.charCodeAt(0) - 97] < 0) return false
  }
  return true
}`
  },
  'lc-intersection-of-two-arrays': {
    desc: `给定两个数组 nums1 和 nums2，返回它们的交集。输出结果中的每个元素一定是唯一的，可以不考虑输出结果的顺序。

**示例 1：**
- 输入：nums1 = [1,2,2,1], nums2 = [2,2]
- 输出：[2]

**示例 2：**
- 输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
- 输出：[9,4]
- 解释：[4,9] 也是可通过的答案

**提示：**
- 1 <= nums1.length, nums2.length <= 1000
- 0 <= nums1[i], nums2[i] <= 1000`,
    analysis: `### 核心思路

求交集就是判断「一个数组里的元素是否在另一个数组中出现过」，这是典型的哈希查找场景。题目数值范围只有 0 到 1000，可以直接用数组做哈希表；更通用的做法是用 ES6 的 Set。

> 用 Set 去重的思想：先把 nums1 放进 Set，再遍历 nums2，凡是能在 Set 中找到的元素都属于交集；找到后立刻从 Set 中删除，避免重复加入结果。

由于输出要求元素唯一，第二个数组中重复出现的命中元素只应记录一次，边查边删是最简洁的处理方式。

### 算法步骤

1. 将 nums1 的所有元素放入 Set 集合 set1，自动完成去重。
2. 遍历 nums2 的每个元素 num。
3. 若 set1 中存在 num，则加入结果数组，并从 set1 中删除该元素，防止重复输出。
4. 遍历结束后返回结果数组。

### 易错点

- 忘记去重，把同一个交集元素输出多次。命中后删除 Set 中的元素是最简单的防重手段。
- 若用数组做哈希表，要确认题目数值范围足够小；值域很大或含负数时必须改用 Set 或 Map。
- 任一数组为空时交集为空，上述流程天然正确，不需要特判。

### 复杂度分析

- 时间复杂度：O(n + m)，n 和 m 为两个数组的长度，Set 的查找和删除都是 O(1)。
- 空间复杂度：O(n)，最坏情况下 Set 需要存放 nums1 的全部元素。`,
    code: `function intersection(nums1: number[], nums2: number[]): number[] {
  const set1 = new Set(nums1)
  const result: number[] = []
  for (const num of nums2) {
    if (set1.has(num)) {
      result.push(num)
      set1.delete(num) // 命中后删除，避免重复加入
    }
  }
  return result
}`
  },
  'lc-happy-number': {
    desc: `编写一个算法来判断一个数 n 是不是快乐数。快乐数的定义：对于一个正整数，每一次将它替换为它每个位置上的数字的平方和，然后重复这个过程，直到这个数变为 1；也可能无限循环但始终变不到 1。如果可以变为 1，那么这个数就是快乐数，返回 true；否则返回 false。

**示例 1：**
- 输入：n = 19
- 输出：true
- 解释：19 -> 1^2 + 9^2 = 82 -> 8^2 + 2^2 = 68 -> 6^2 + 8^2 = 100 -> 1^2 + 0^2 + 0^2 = 1

**示例 2：**
- 输入：n = 2
- 输出：false

**提示：**
- 1 <= n <= 2^31 - 1`,
    analysis: `### 核心思路

题目的关键信息是「无限循环但始终变不到 1」。也就是说，不是快乐数的数会陷入循环，平方和会不断重复出现。判断「重复出现」，正是哈希表最擅长的事。

> 这道题的隐藏考点是把求和过程中的每个中间结果看作元素，用 Set 记录是否出现过。只要结果重复出现却还没变成 1，就说明进入了死循环，直接返回 false。

另一个经典做法是快慢指针（类似判环形链表），但用 Set 的写法更直观，也契合哈希表专题的训练目的。

### 算法步骤

1. 编写辅助函数 getSum：用取余和整除把 n 的每一位数字取出，累加平方和。
2. 创建 Set，循环条件为 n 不等于 1 且 n 未在 Set 中出现过。
3. 每轮先把 n 记入 Set，再计算它的各位平方和，更新 n。
4. 循环结束时，n 等于 1 则是快乐数，返回 true；否则说明陷入循环，返回 false。

### 易错点

- 终止条件必须有两个：变到 1 或结果重复，漏掉「重复」就会死循环。
- 取各位数字建议用取余和整除，而不是转字符串逐位解析，效率更高。
- 中间平方和会迅速收敛到很小的范围（千级别），不必担心数值过大。

### 复杂度分析

- 时间复杂度：O(log n)，每次求平方和需要 O(log n) 分解各位，循环次数经数学证明有上界。
- 空间复杂度：O(log n)，Set 中存放的中间结果数量有限。`,
    code: `function isHappy(n: number): boolean {
  // 计算各位数字的平方和
  const getSum = (num: number): number => {
    let sum = 0
    while (num > 0) {
      const digit = num % 10
      sum += digit * digit
      num = Math.floor(num / 10)
    }
    return sum
  }
  const seen = new Set<number>()
  // 变到 1 结束是快乐数；结果重复出现说明陷入死循环
  while (n !== 1 && !seen.has(n)) {
    seen.add(n)
    n = getSum(n)
  }
  return n === 1
}`
  },
  'lc-two-sum': {
    desc: `给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。你可以假设每种输入只会对应一个答案，并且你不能使用两次同样的元素。你可以按任意顺序返回答案。

**示例 1：**
- 输入：nums = [2,7,11,15], target = 9
- 输出：[0,1]
- 解释：因为 nums[0] + nums[1] == 9，返回 [0, 1]

**示例 2：**
- 输入：nums = [3,2,4], target = 6
- 输出：[1,2]

**示例 3：**
- 输入：nums = [3,3], target = 6
- 输出：[0,1]

**提示：**
- 2 <= nums.length <= 10^4
- 只会存在一个有效答案`,
    analysis: `### 核心思路

暴力解法是两层循环枚举所有数对，时间 O(n^2)。优化的关键在于转换视角：遍历到元素 num 时，我们其实只需要知道「target - num 是否在数组中出现过，以及它的下标」，这正是哈希表的定义式应用。

> 一边遍历一边维护哈希表：先查当前元素需要的另一半是否已在 Map 中，查到立即返回；查不到再把当前元素登记进去。先查后存的顺序保证不会把同一个元素用两次。

用 Map 而不是 Set，是因为我们不仅要知道元素是否存在，还要拿到它的下标。

### 算法步骤

1. 创建 Map，key 存数组元素的值，value 存对应下标。
2. 遍历数组，对每个元素计算 complement = target - nums[i]。
3. 若 Map 中存在 complement，返回它的下标与当前下标 i 组成的数组。
4. 否则将 nums[i] 与 i 存入 Map，继续遍历。
5. 题目保证有唯一解，循环内必然返回。

### 易错点

- 先查找后存储的顺序不能颠倒：若先存储再查找，当 target 恰好是某个元素的两倍时（如示例 3 的 [3,3]），会把同一个元素用两次。
- Map 的 key 存元素值、value 存下标，存反了就拿不到下标。
- 返回顺序随意，题目允许任意顺序。

### 复杂度分析

- 时间复杂度：O(n)，遍历数组一次，每次 Map 查找为 O(1)。
- 空间复杂度：O(n)，最坏需要把所有元素存入 Map。`,
    code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>() // key: 元素值, value: 下标
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    // 先查找需要的另一半，再登记当前元素，避免重复使用自身
    if (map.has(complement)) {
      return [map.get(complement)!, i]
    }
    map.set(nums[i], i)
  }
  return []
}`
  },
  'lc-4sum-ii': {
    desc: `给你四个整数数组 nums1、nums2、nums3 和 nums4，数组长度都是 n，请你计算有多少个元组 (i, j, k, l) 能满足：nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0。

**示例 1：**
- 输入：nums1 = [1,2], nums2 = [-2,-1], nums3 = [-1,2], nums4 = [0,2]
- 输出：2
- 解释：两个元组分别是：(0,0,0,1)，对应 1 + (-2) + (-1) + 2 = 0；(1,1,0,0)，对应 2 + (-1) + (-1) + 0 = 0

**示例 2：**
- 输入：nums1 = [0], nums2 = [0], nums3 = [0], nums4 = [0]
- 输出：1

**提示：**
- n == nums1.length == nums2.length == nums3.length == nums4.length
- 1 <= n <= 200
- -2^28 <= nums1[i], nums2[i], nums3[i], nums4[i] <= 2^28`,
    analysis: `### 核心思路

四个数组各自独立，不需要在同一数组内去重或限制下标，只统计满足条件的元组个数。如果把四个数两两分组，问题就变成：A + B 的和，与 -(C + D) 的和，能否配对成功。

> 关键转化：把 nums1 + nums2 的所有可能和存入 Map，key 是和，value 是该和出现的次数；再遍历 nums3 + nums4 的所有组合，查找 0 - (c + d) 在 Map 中出现过几次，把次数累加起来就是答案。

这题与两数之和的区别在于：不需要返回下标，且同一个和会来自多个不同组合，所以 Map 的 value 存出现次数而不是下标。两两分组把 O(n^4) 降为 O(n^2)。

### 算法步骤

1. 创建 Map sumAB，双重遍历 nums1 和 nums2，统计每个两数之和及出现次数。
2. 创建计数器 count，双重遍历 nums3 和 nums4。
3. 对每组 (c, d)，在 sumAB 中查找键 0 - c - d。
4. 若存在，把该键对应的次数累加到 count。
5. 返回 count。

### 易错点

- Map 的 value 必须存次数而不是布尔值，因为不同下标组合可以产生相同的和，每一种都要计数。
- 查找的键是 0 - c - d，即满足 A + B = -(C + D)，负号容易漏。
- 本题是四个独立数组的组合，不存在数组内去重问题，不要与三数之和、四数之和混淆。

### 复杂度分析

- 时间复杂度：O(n^2)，两次双重循环，各遍历 n^2 种组合。
- 空间复杂度：O(n^2)，最坏情况下 Map 存放 n^2 个不同的和。`,
    code: `function fourSumCount(nums1: number[], nums2: number[], nums3: number[], nums4: number[]): number {
  const sumAB = new Map<number, number>()
  // 统计 nums1 + nums2 所有组合的和及出现次数
  for (const a of nums1) {
    for (const b of nums2) {
      const sum = a + b
      sumAB.set(sum, (sumAB.get(sum) ?? 0) + 1)
    }
  }
  let count = 0
  // 查找 -(nums3 + nums4) 在 sumAB 中出现的次数
  for (const c of nums3) {
    for (const d of nums4) {
      const target = -c - d
      if (sumAB.has(target)) {
        count += sumAB.get(target)!
      }
    }
  }
  return count
}`
  },
  'lc-ransom-note': {
    desc: `给你两个字符串 ransomNote 和 magazine，判断 ransomNote 能不能由 magazine 里面的字符构成。如果可以，返回 true；否则返回 false。magazine 中的每个字符只能在 ransomNote 中使用一次。

**示例 1：**
- 输入：ransomNote = "a", magazine = "b"
- 输出：false

**示例 2：**
- 输入：ransomNote = "aa", magazine = "ab"
- 输出：false

**示例 3：**
- 输入：ransomNote = "aa", magazine = "aab"
- 输出：true

**提示：**
- 1 <= ransomNote.length, magazine.length <= 10^5
- 两个字符串均只含有小写字母`,
    analysis: `### 核心思路

这道题是「有效的字母异位词」的变形：magazine 是字符库存，ransomNote 是字符需求，问库存够不够拼出需求。同样只需要统计字符频次，用长度 26 的数组做哈希表即可。

> 与异位词判断的差别在于比较方向：异位词要求每个字符次数完全相等，而赎金信只要求 magazine 中每个字符的数量大于等于 ransomNote 的需求量，库存多出来的字符无所谓。

实现上先统计 magazine 的频次数组，再遍历 ransomNote 逐个消耗；消耗过程中一旦某字符数量不足，立即返回 false。

### 算法步骤

1. 若 ransomNote 比 magazine 还长，直接返回 false（可选剪枝）。
2. 创建长度为 26 的数组 record，遍历 magazine，把每个字符对应位置加一。
3. 遍历 ransomNote，把每个字符对应位置减一。
4. 若出现减完后小于零的位置，说明库存不足，返回 false。
5. 全部字符都消耗成功则返回 true。

### 易错点

- 判断方向容易搞反：是 magazine 的字符数量要覆盖 ransomNote，不是反过来。
- 可以在减一的同时判断负数并提前返回，不必最后再扫一遍数组。
- 每个字符只能使用一次，所以要按次数做减法，而不是只判断字符是否出现过。

### 复杂度分析

- 时间复杂度：O(n + m)，n 和 m 分别为两个字符串的长度。
- 空间复杂度：O(1)，辅助数组固定长度 26。`,
    code: `function canConstruct(ransomNote: string, magazine: string): boolean {
  if (ransomNote.length > magazine.length) return false
  const record: number[] = new Array(26).fill(0)
  // 先统计 magazine 的字符库存
  for (const ch of magazine) {
    record[ch.charCodeAt(0) - 97]++
  }
  // 再消耗 ransomNote 的字符需求，不足即失败
  for (const ch of ransomNote) {
    record[ch.charCodeAt(0) - 97]--
    if (record[ch.charCodeAt(0) - 97] < 0) return false
  }
  return true
}`
  },
  'lc-3sum': {
    desc: `给你一个整数数组 nums，判断是否存在三元组 [nums[i], nums[j], nums[k]]，满足 i、j、k 互不相同，且 nums[i] + nums[j] + nums[k] == 0。请你返回所有和为 0 且不重复的三元组。注意：答案中不可以包含重复的三元组。

**示例 1：**
- 输入：nums = [-1,0,1,2,-1,-4]
- 输出：[[-1,-1,2],[-1,0,1]]
- 解释：满足条件的三元组为 [-1,-1,2] 和 [-1,0,1]，输出的顺序和三元组内部的顺序都不重要

**示例 2：**
- 输入：nums = [0,1,1]
- 输出：[]
- 解释：唯一可能的三元组和不为 0

**示例 3：**
- 输入：nums = [0,0,0]
- 输出：[[0,0,0]]
- 解释：唯一可能的三元组和为 0

**提示：**
- 3 <= nums.length <= 3000
- -10^5 <= nums[i] <= 10^5`,
    analysis: `### 核心思路

本题难点不在求和，而在去重。哈希法虽然也能找出所有三元组，但去重逻辑非常繁琐，所以这题更适合用「排序 + 双指针」，也是哈希表章节里难得的不用哈希的一题。

> 排序之后数组有序，固定第一个数 nums[i]，再用左右双指针在 i 后面的区间里找两个数，使三数之和等于 0。和偏大时 right 左移减小总和，偏小时 left 右移增大总和，相遇前找遍所有可能。

去重要在两个层面做：一是对固定数 i 去重，二是找到一组解后对 left 和 right 去重，跳过所有重复值再收缩。

### 算法步骤

1. 将数组升序排序。
2. 遍历 i 从 0 到 n - 3，若 nums[i] 大于 0 可直接结束：有序数组中最小的数都大于 0，不可能凑出 0。
3. 对 i 去重：若 i 大于 0 且 nums[i] 等于 nums[i - 1]，跳过本轮。
4. 双指针 left = i + 1、right = n - 1，计算三数之和 sum。
5. sum 等于 0 时收集答案，对 left、right 去重后同时收缩；sum 小于 0 时 left 右移；sum 大于 0 时 right 左移。

### 易错点

- 对 i 去重必须和前一个元素比较，写成和后一个比较会误杀合法解（如 [-1,-1,2]）。
- 找到答案后先对 left、right 去重，再各移动一步，顺序错了会漏解或重复。
- 双指针收缩时始终保证 left 小于 right，不能越过对方。

### 复杂度分析

- 时间复杂度：O(n^2)，排序 O(n log n)，外层循环 n 次，内层双指针扫描 O(n)。
- 空间复杂度：O(1)，不考虑排序开销与返回结果，只用了常数个指针变量。`,
    code: `function threeSum(nums: number[]): number[][] {
  const result: number[][] = []
  nums.sort((a, b) => a - b)
  const n = nums.length
  for (let i = 0; i < n - 2; i++) {
    if (nums[i] > 0) break // 有序数组，最小数大于 0 则无解
    if (i > 0 && nums[i] === nums[i - 1]) continue // 对 i 去重
    let left = i + 1
    let right = n - 1
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]])
        // 对 left、right 去重，跳过重复值
        while (left < right && nums[left] === nums[left + 1]) left++
        while (left < right && nums[right] === nums[right - 1]) right--
        left++
        right--
      } else if (sum < 0) {
        left++
      } else {
        right--
      }
    }
  }
  return result
}`
  },
  'lc-4sum': {
    desc: `给你一个由 n 个整数组成的数组 nums 和一个目标值 target，请你找出并返回满足下述全部条件且不重复的四元组 [nums[a], nums[b], nums[c], nums[d]]：a、b、c、d 互不相同，且 nums[a] + nums[b] + nums[c] + nums[d] == target。你可以按任意顺序返回答案。

**示例 1：**
- 输入：nums = [1,0,-1,0,-2,2], target = 0
- 输出：[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]

**示例 2：**
- 输入：nums = [2,2,2,2,2], target = 8
- 输出：[[2,2,2,2]]

**提示：**
- 1 <= nums.length <= 200
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9`,
    analysis: `### 核心思路

四数之和是三数之和的自然延伸：外层多套一层循环，固定前两个数 a 和 b，后两个数依旧用双指针寻找。整体框架不变，但有三个新细节必须处理。

> 与三数之和最大的不同：target 不再是 0，可以是任意整数（包括负数），所以「第一个数大于 target 就剪枝」不再成立。正确的剪枝是判断当前最小可能的四数之和是否已经超过 target，且要限定相关数为非负时才安全。

其次是溢出问题：四个 10^9 量级的数相加可能超出 32 位整型范围，用 Java、C++ 时要换用长整型；JS 的 Number 在 2^53 内是安全的，本题数据不会溢出。

### 算法步骤

1. 数组升序排序。
2. 第一层循环固定 a：剪枝，若 nums[a] 大于 target 且 nums[a] 非负，直接结束；对 a 去重，与前一元素相同则跳过。
3. 第二层循环固定 b（从 a + 1 开始）：剪枝，若 nums[a] + nums[b] 大于 target 且非负，结束本层；对 b 去重。
4. 双指针 left、right 在 b 之后寻找两数，使四数之和等于 target，等于时收集答案并对 left、right 去重后收缩。
5. 和偏大 right 左移，偏小 left 右移。

### 易错点

- 剪枝条件照抄三数之和的「nums[i] 大于 target」是错的，target 可能为负，必须加上非负判断。
- a 和 b 的去重都要和前一个元素比较，b 的去重条件是从 a + 1 之后才算重复。
- 收集答案后先对 left、right 去重再收缩，否则同一组解会重复输出。

### 复杂度分析

- 时间复杂度：O(n^3)，排序 O(n log n)，两层循环 n^2 种组合，内层双指针 O(n)。
- 空间复杂度：O(1)，忽略排序开销与输出数组。`,
    code: `function fourSum(nums: number[], target: number): number[][] {
  const result: number[][] = []
  nums.sort((a, b) => a - b)
  const n = nums.length
  for (let a = 0; a < n - 3; a++) {
    // 剪枝：最小数已超过 target 且非负，后面不可能更小
    if (nums[a] > target && nums[a] >= 0) break
    if (a > 0 && nums[a] === nums[a - 1]) continue // 对 a 去重
    for (let b = a + 1; b < n - 2; b++) {
      // 剪枝：前两数之和已超过 target 且非负
      if (nums[a] + nums[b] > target && nums[a] + nums[b] >= 0) break
      if (b > a + 1 && nums[b] === nums[b - 1]) continue // 对 b 去重
      let left = b + 1
      let right = n - 1
      while (left < right) {
        const sum = nums[a] + nums[b] + nums[left] + nums[right]
        if (sum === target) {
          result.push([nums[a], nums[b], nums[left], nums[right]])
          // 对 left、right 去重，跳过重复值
          while (left < right && nums[left] === nums[left + 1]) left++
          while (left < right && nums[right] === nums[right - 1]) right--
          left++
          right--
        } else if (sum < target) {
          left++
        } else {
          right--
        }
      }
    }
  }
  return result
}`
  }
}

export default solutions
