import type { Solution } from './types'

const solutions: Record<string, Solution> = {
  'lc-implement-queue-using-stacks': {
    desc: `请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作：push、pop、peek 和 empty。

实现 MyQueue 类：
- void push(int x) 将元素 x 推到队列的末尾
- int pop() 从队列的开头移除并返回元素
- int peek() 返回队列开头的元素
- boolean empty() 如果队列为空，返回 true；否则，返回 false

**示例 1：**
- 输入：["MyQueue", "push", "push", "peek", "pop", "empty"] [[], [1], [2], [], [], []]
- 输出：[null, null, null, 1, 1, false]
- 解释：依次执行 push(1)、push(2) 后，peek() 返回队头元素 1，pop() 移除并返回队头元素 1，此时队列不为空，empty() 返回 false。

**提示：**
- 1 <= x <= 9
- 最多调用 100 次 push、pop、peek 和 empty
- 假设所有操作都是有效的（例如，一个空的队列不会调用 pop 或者 peek 操作）`,
    analysis: `### 核心思路
栈是后进先出，队列是先进先出，顺序正好相反。但**数据经过两个栈倒手一次，顺序就会反过来**。于是用一个栈 stackIn 专门负责入队，另一个栈 stackOut 专门负责出队：当 stackOut 为空时，把 stackIn 的全部元素一次性倒入 stackOut，此时 stackOut 的栈顶恰好是最早进入的元素，出队顺序就正确了。

### 算法步骤
1. push：直接压入 stackIn。
2. pop / peek：若 stackOut 非空，直接操作它的栈顶；若为空，先把 stackIn 的所有元素弹出并压入 stackOut，再操作栈顶。
3. empty：两个栈同时为空时，队列才为空。

### 易错点
- **必须等 stackOut 为空时才能倒入**：否则新倒入的元素会压在旧元素上面，先进先出的顺序就被打乱了。
- 倒入时要**一次性倒空** stackIn，只倒一部分会导致顺序错乱。
- peek 可以复用 pop 的搬运逻辑：取到栈顶值后不弹出即可，避免写两份重复的搬运代码。

### 复杂度分析
- 每个元素最多入栈两次（先进 stackIn，再进 stackOut）、出栈两次，因此 push / pop / peek 的**均摊时间复杂度**都是 O(1)。
- 空间复杂度 O(n)，两个栈合计最多存放 n 个元素。`,
    code: `class MyQueue {
  private stackIn: number[]
  private stackOut: number[]

  constructor() {
    this.stackIn = []
    this.stackOut = []
  }

  // 入队：直接压入 stackIn
  push(x: number): void {
    this.stackIn.push(x)
  }

  // 出队：从 stackOut 弹出栈顶；stackOut 为空时先把 stackIn 全部倒入
  pop(): number {
    if (this.stackOut.length === 0) {
      this.shift()
    }
    return this.stackOut.pop()!
  }

  // 取队头：与 pop 同样的搬运逻辑，但只读取不弹出
  peek(): number {
    if (this.stackOut.length === 0) {
      this.shift()
    }
    return this.stackOut[this.stackOut.length - 1]
  }

  // 两个栈都为空时队列才为空
  empty(): boolean {
    return this.stackIn.length === 0 && this.stackOut.length === 0
  }

  // 把 stackIn 的所有元素一次性倒入 stackOut
  private shift(): void {
    while (this.stackIn.length > 0) {
      this.stackOut.push(this.stackIn.pop()!)
    }
  }
}`
  },
  'lc-implement-stack-using-queues': {
    desc: `请你仅使用一个队列实现一个后入先出（LIFO）的栈，并支持普通栈的全部四种操作：push、top、pop 和 empty。

实现 MyStack 类：
- void push(int x) 将元素 x 压入栈顶
- int pop() 移除并返回栈顶元素
- int top() 返回栈顶元素
- boolean empty() 如果栈是空的，返回 true；否则，返回 false

**示例 1：**
- 输入：["MyStack", "push", "push", "top", "pop", "empty"] [[], [1], [2], [], [], []]
- 输出：[null, null, null, 2, 2, false]
- 解释：依次执行 push(1)、push(2) 后，top() 返回栈顶元素 2，pop() 移除并返回栈顶元素 2，此时栈不为空，empty() 返回 false。

**提示：**
- 1 <= x <= 9
- 最多调用 100 次 push、pop、top 和 empty
- 每次调用 pop 和 top 都保证栈不为空`,
    analysis: `### 核心思路
队列是先进先出，栈是后进先出，顺序恰好相反。其实**用一个队列就够了**，关键是让新元素排到队头：每次 push 之后，把队列中除新元素外的所有元素依次出队再重新入队，这样队头永远是栈顶，pop 和 top 直接操作队头即可。相比「两个队列来回倒」的写法，单队列在 push 时一次到位，逻辑更简洁。

### 算法步骤
1. push：元素先入队尾，然后把前面 size - 1 个元素依次出队并重新入队。
2. pop：直接出队，取走队头元素。
3. top：直接读取队头元素，不做任何出队操作。
4. empty：队列长度为 0 时返回 true。

### 易错点
- 重新排队的循环次数是 **size - 1**：新元素自身不能再出队入队，否则等于白排。
- 重排必须在新元素入队后**立即完成**，这样 pop 和 top 才都是 O(1)。
- top 不能用「出队再入队」的方式取值：那样该元素会跑到队尾，破坏「栈顶在队头」的约定，直接读队头即可。

### 复杂度分析
- push 需要移动 n - 1 个元素，时间复杂度 O(n)；pop、top、empty 都是 O(1)。
- 空间复杂度 O(n)，队列最多存放 n 个元素。`,
    code: `class MyStack {
  private queue: number[]

  constructor() {
    this.queue = []
  }

  // 入栈：先入队尾，再把前面的元素依次出队重排，让新元素排到队头
  push(x: number): void {
    this.queue.push(x)
    const n = this.queue.length
    for (let i = 0; i < n - 1; i++) {
      this.queue.push(this.queue.shift()!)
    }
  }

  // 出栈：队头即栈顶
  pop(): number {
    return this.queue.shift()!
  }

  // 取栈顶：直接读队头，不要出队再入队
  top(): number {
    return this.queue[0]
  }

  empty(): boolean {
    return this.queue.length === 0
  }
}`
  },
  'lc-valid-parentheses': {
    desc: `给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s，判断字符串是否有效。

有效字符串需满足：
- 左括号必须用相同类型的右括号闭合。
- 左括号必须以正确的顺序闭合。
- 每个右括号都有一个对应的相同类型的左括号。

**示例 1：**
- 输入：s = "()"
- 输出：true

**示例 2：**
- 输入：s = "()[]{}"
- 输出：true

**示例 3：**
- 输入：s = "(]"
- 输出：false

**示例 4：**
- 输入：s = "([)]"
- 输出：false

**示例 5：**
- 输入：s = "{[]}"
- 输出：true

**提示：**
- 1 <= s.length <= 10^4
- s 仅由括号 '()[]{}' 组成`,
    analysis: `### 核心思路
括号匹配的特点是：**越靠后的左括号，越先被右括号匹配**，这正是栈后进先出的应用场景。遍历字符串：遇到左括号就压栈；遇到右括号时，栈顶必须恰好是与之匹配的左括号，匹配则弹栈继续，否则整个字符串无效。

> 实现小技巧：遇到左括号时直接把**对应的右括号**压入栈，这样后面只需比较「栈顶字符是否等于当前右括号」，省去一堆配对判断。

### 算法步骤
1. 遍历字符串：遇到左括号 (、[、{ 时，将对应的右括号 )、]、} 压入栈。
2. 遇到右括号时，若栈为空或栈顶字符与当前字符不同，返回 false；否则弹出栈顶。
3. 遍历结束后栈为空则返回 true，否则说明有多余的左括号，返回 false。

### 易错点
括号不匹配一共三种情况，缺一不可：
1. **左括号多余**：字符串遍历完了，栈里还剩元素。
2. **右括号多余**：遇到右括号时栈已经空了，无东西可匹配。
3. **类型不匹配**：栈顶括号与当前右括号类型对不上，例如 ([)]。

另外注意：栈为空时不能直接取栈顶，要先判空，否则会访问到 undefined。

### 复杂度分析
- 时间复杂度 O(n)：每个字符至多入栈、出栈各一次。
- 空间复杂度 O(n)：最坏情况整个字符串都是左括号，全部进栈。`,
    code: `function isValid(s: string): boolean {
  const stack: string[] = []
  // 左括号 -> 对应右括号 的映射
  const pairs: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
  }
  for (const ch of s) {
    if (pairs[ch] !== undefined) {
      // 遇到左括号：把期望的右括号压栈
      stack.push(pairs[ch])
    } else {
      // 遇到右括号：栈顶必须恰好是它，且栈不能为空
      if (stack.length === 0 || stack[stack.length - 1] !== ch) {
        return false
      }
      stack.pop()
    }
  }
  // 遍历结束后栈必须为空，否则左括号多余
  return stack.length === 0
}`
  },
  'lc-remove-all-adjacent-duplicates-in-string': {
    desc: `给出由小写字母组成的字符串 s，重复项删除操作会选择两个相邻且相同的字母，并删除它们。

在 s 上反复执行重复项删除操作，直到无法继续删除。

在完成所有重复项删除操作后返回最终的字符串。答案保证唯一。

**示例 1：**
- 输入：s = "abbaca"
- 输出："ca"
- 解释：在 "abbaca" 中可以删除 "bb"，得到 "aaca"；其中又只有 "aa" 可以执行删除操作，所以最后的字符串为 "ca"。

**示例 2：**
- 输入：s = "azxxzy"
- 输出："ay"

**提示：**
- 1 <= s.length <= 10^5
- s 仅由小写英文字母组成`,
    analysis: `### 核心思路
删除一对相邻重复项后，原本被隔开的两段会重新相邻，可能产生新的重复项，删除操作会连锁发生。在字符串上反复扫描删除最坏是 O(n^2)，而用栈只需一趟：字符依次处理，**进栈前先比较栈顶**，相同就弹出栈顶（等于消掉这一对），不同才进栈。遍历结束后，栈中从底到顶的字符就是最终结果。

> 这道题和「有效的括号」是同一类模型：栈里维护的是尚未被消除的字符序列。

### 算法步骤
1. 遍历字符串的每个字符。
2. 若栈非空且栈顶字符等于当前字符，弹出栈顶，完成一次消除。
3. 否则把当前字符压栈。
4. 遍历结束后，把栈中字符按从底到顶的顺序拼接成结果。

### 易错点
- 不要真的在原字符串上反复查找并删除，会产生大量来回移动，最坏 O(n^2)；栈一趟搞定。
- 拼接结果的方向是**从栈底到栈顶**，写反了答案就整个倒过来了。
- 逐字符用 + 拼接字符串在大数据量下会产生大量临时对象，先收集到数组最后一次性 join 更稳。

### 复杂度分析
- 时间复杂度 O(n)：每个字符至多入栈、出栈各一次。
- 空间复杂度 O(n)：栈最多保存全部字符。`,
    code: `function removeDuplicates(s: string): string {
  const stack: string[] = []
  for (const ch of s) {
    // 栈顶与当前字符相同，说明构成一对相邻重复项，直接消除
    if (stack.length > 0 && stack[stack.length - 1] === ch) {
      stack.pop()
    } else {
      stack.push(ch)
    }
  }
  // 栈底对应字符串开头，从底到顶拼接
  return stack.join('')
}`
  },
  'lc-evaluate-reverse-polish-notation': {
    desc: `给你一个字符串数组 tokens，表示一个根据逆波兰表示法表示的算术表达式。

请你计算该表达式，返回一个表示表达式值的整数。

注意：
- 有效的算符为 '+'、'-'、'*' 和 '/'。
- 每个操作数可以是一个整数，也可能是另一个表达式的结果。
- 两个整数之间的除法总是向零截断。
- 表达式中不含除零操作。
- 答案及所有中间计算结果都可以用 32 位整数表示。

**示例 1：**
- 输入：tokens = ["2","1","+","3","*"]
- 输出：9
- 解释：该算式转化为常见的中缀算术表达式为 ((2 + 1) * 3) = 9。

**示例 2：**
- 输入：tokens = ["4","13","5","/","+"]
- 输出：6
- 解释：该算式转化为常见的中缀算术表达式为 (4 + (13 / 5)) = 6。

**示例 3：**
- 输入：tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
- 输出：22
- 解释：该算式转化为常见的中缀算术表达式为 ((10 * (6 / ((9 + 3) * -11))) + 17) + 5 = 22。

**提示：**
- 1 <= tokens.length <= 10^4
- tokens[i] 要么是一个算符（"+"、"-"、"*" 或 "/"），要么是一个在范围 [-200, 200] 内的整数`,
    analysis: `### 核心思路
逆波兰表达式是后缀表达式，运算符写在两个操作数后面，**天然不需要括号来确定运算顺序**。求值时从左到右扫描：遇到数字就压栈；遇到运算符，弹出两个操作数计算，再把结果压回栈中。扫描结束时，栈里剩下的唯一元素就是表达式的值。

> 弹栈顺序要格外小心：**先弹出的是右操作数，后弹出的是左操作数**。减法和除法不满足交换律，顺序写反结果立刻出错。

### 算法步骤
1. 遍历 tokens：若当前 token 是数字，转成整数压栈。
2. 若是运算符，先弹出的作为右操作数 b，后弹出的作为左操作数 a，计算 a op b 并把结果压栈。
3. 遍历结束，返回栈顶元素。

### 易错点
- **除法要向零截断**：用 Math.trunc(a / b)，不要用 Math.floor，例如 6 / -132 应得 0，floor 会给出 -1。
- 负数 token（例如 -11）是操作数而不是减号，判断运算符要用「完整 token 等于 + - * /」，不能只看是否含负号。
- 操作数可能是多位数，用 parseInt 整体转换，不能只处理单个字符。

### 复杂度分析
- 时间复杂度 O(n)：每个 token 恰好处理一次。
- 空间复杂度 O(n)：栈中最多同时保存约一半数量的操作数。`,
    code: `function evalRPN(tokens: string[]): number {
  const stack: number[] = []
  const ops = new Set(['+', '-', '*', '/'])
  for (const token of tokens) {
    if (ops.has(token)) {
      // 先弹出的是右操作数，后弹出的是左操作数
      const b = stack.pop()!
      const a = stack.pop()!
      let res = 0
      if (token === '+') res = a + b
      else if (token === '-') res = a - b
      else if (token === '*') res = a * b
      else res = Math.trunc(a / b) // 除法向零截断
      stack.push(res)
    } else {
      stack.push(parseInt(token))
    }
  }
  return stack.pop()!
}`
  },
  'lc-sliding-window-maximum': {
    desc: `给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。

返回滑动窗口中的最大值。

**示例 1：**
- 输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
- 输出：[3,3,5,5,6,7]
- 解释：窗口依次为 [1,3,-1]、[3,-1,-3]、[-1,-3,5]、[-3,5,3]、[5,3,6]、[3,6,7]，对应的最大值分别为 3、3、5、5、6、7。

**示例 2：**
- 输入：nums = [1], k = 1
- 输出：[1]

**提示：**
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4
- 1 <= k <= nums.length`,
    analysis: `### 核心思路
暴力解法对每个窗口遍历 k 个数求最大值，时间 O(n * k)，n 达到 10^5 时必然超时。优化的关键观察是：**新元素入窗后，窗口内比它小且在它左边的元素永远不可能再成为最大值**——它们既比新元素小，又会比新元素先滑出窗口。因此维护一个**单调递减双端队列**：队列保存元素下标，从队头到队尾对应的值严格递减，队头就永远是当前窗口最大值的下标。每个元素最多入队、出队一次，整体线性。

### 算法步骤
1. 右边界 i 每右移一步：先把队尾中所有「对应值小于等于 nums[i]」的下标弹出，再把 i 入队尾。
2. 若队头下标已经滑出窗口（队头下标小于等于 i - k），弹出队头。
3. 当窗口成型（i >= k - 1）时，把 nums[队头下标] 写入结果数组。

### 易错点
- 队列里必须存**下标**而不是值：只有下标才能判断队头元素是否已滑出窗口。
- 收集结果的时机是 i >= k - 1，即第一个窗口完整形成之后，别提前输出。
- 队尾弹出的比较条件取「小于等于」即可，为相同值保留更早的下标没有必要。

### 复杂度分析
- 时间复杂度 O(n)：虽然内层有 while 循环，但每个元素至多入队一次、出队一次，总操作数是线性的。
- 空间复杂度 O(k)：队列中最多同时保存 k 个下标（不计返回的结果数组）。`,
    code: `function maxSlidingWindow(nums: number[], k: number): number[] {
  // 双端队列存下标，对应的值从队头到队尾单调递减
  const deque: number[] = []
  const result: number[] = []
  for (let i = 0; i < nums.length; i++) {
    // 队尾所有小于等于当前值的下标都已无价值，弹出
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop()
    }
    deque.push(i)
    // 队头下标滑出窗口则弹出
    if (deque[0] <= i - k) {
      deque.shift()
    }
    // 第一个窗口成型后，队头下标对应的值就是窗口最大值
    if (i >= k - 1) {
      result.push(nums[deque[0]])
    }
  }
  return result
}`
  },
  'lc-top-k-frequent-elements': {
    desc: `给你一个整数数组 nums 和一个整数 k，请你返回其中出现频率前 k 高的元素。你可以按任意顺序返回答案。

**示例 1：**
- 输入：nums = [1,1,1,2,2,3], k = 2
- 输出：[1,2]

**示例 2：**
- 输入：nums = [1], k = 1
- 输出：[1]

**提示：**
- 1 <= nums.length <= 10^5
- k 的取值范围是 [1, 数组中不相同的元素的个数]
- 题目数据保证答案唯一，换句话说，数组中前 k 个高频元素的集合是唯一的

**进阶：** 你所设计算法的时间复杂度必须优于 O(n log n)，其中 n 是数组大小。`,
    analysis: `### 核心思路
分两步：先用哈希表统计每个元素的出现次数，再从所有元素中挑出频率最高的 k 个。直接按频率排序是 O(n log n)，不符合进阶要求；更好的做法有两种——小顶堆维护前 k 高频元素（O(n log k)），或者**按出现次数分桶**：出现次数最大不超过 n，给每个可能的次数建一个桶，元素放入自己次数对应的桶中，最后**从高次数桶向低次数桶收集**，凑满 k 个即止，整体 O(n)。下面代码采用桶排序实现，避免手写堆。

### 算法步骤
1. 遍历 nums，用 Map 统计每个元素的出现次数。
2. 建桶数组 buckets，下标 i 对应出现次数 i，把每个元素放进 buckets 中下标为其次数的位置。
3. 从 buckets 的末尾（最高次数）向前遍历，逐个收集元素，直到结果数量达到 k。

### 易错点
- 桶数组长度要开到 **n + 1**：一个元素最多出现 n 次，下标 n 必须可用。
- 收集时要在凑满 k 个后立刻停止，避免把低频元素也塞进答案。
- 题目保证前 k 高频的集合唯一，所以同一个桶内不需要再做取舍。

### 复杂度分析
- 时间复杂度 O(n)：统计、分桶、收集各扫描一次。
- 空间复杂度 O(n)：哈希表和桶的总开销与元素个数同阶。`,
    code: `function topKFrequent(nums: number[], k: number): number[] {
  // 1. 统计每个元素的出现次数
  const countMap = new Map<number, number>()
  for (const num of nums) {
    countMap.set(num, (countMap.get(num) || 0) + 1)
  }
  // 2. 按出现次数分桶，下标 i 存放出现次数为 i 的元素
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => [])
  for (const [num, count] of countMap) {
    buckets[count].push(num)
  }
  // 3. 从最高次数的桶向前收集，凑满 k 个即止
  const result: number[] = []
  for (let i = buckets.length - 1; i >= 0; i--) {
    for (const num of buckets[i]) {
      if (result.length === k) return result
      result.push(num)
    }
  }
  return result
}`
  }
}

export default solutions
