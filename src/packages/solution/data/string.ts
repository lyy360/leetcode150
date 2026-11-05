import type { Solution } from './types'

const solutions: Record<string, Solution> = {
  'lc-reverse-string': {
    desc: `编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 s 的形式给出，要求**原地修改**输入数组，并使用 O(1) 的额外空间解决这一问题，函数无返回值。

**示例 1：**
- 输入：s = ["h","e","l","l","o"]
- 输出：["o","l","l","e","h"]

**示例 2：**
- 输入：s = ["H","a","n","n","a","h"]
- 输出：["h","a","n","n","a","H"]

**提示：**
- 1 <= s.length <= 10^5
- s[i] 都是 ASCII 码表中的可打印字符`,
    analysis: `### 核心思路

反转字符串是双指针技巧中最基础的一题。定义 left 指向数组首元素，right 指向末元素，两指针**对向而行**，每轮把所指的两个元素交换，然后同时向中间移动，直到相遇为止。

> 为什么不从前往后逐个搬移？那样每个元素都可能引发一段区间的整体挪动，是 O(n^2)。首尾对撞指针每交换一次就确定两个元素的最终位置，一轮循环恰好完成整个反转。

### 算法步骤

1. 初始化 left = 0，right = s.length - 1。
2. 当 left < right 时，用临时变量交换 s[left] 与 s[right]。
3. 每轮结束后 left++、right--，两指针继续向中间靠拢。
4. 两指针相遇时（奇数长度恰好停在中间字符），反转完成，原地结束。

### 易错点

- 题目要求原地修改且无返回值，不要新建数组接收结果。
- 循环条件是 left < right 而不是 left <= right，中间元素无需自己和自己交换。
- 交换时先存临时变量再赋值，两行赋值顺序写反会覆盖丢数据。
- JS 中解构写法 [s[left], s[right]] = [s[right], s[left]] 也可以，但手写临时变量更通用。

### 复杂度分析

- 时间复杂度：O(n)，约执行 n / 2 次交换。
- 空间复杂度：O(1)，只使用常数个临时变量。`,
    code: `/**
 Do not return anything, modify s in-place instead.
 */
function reverseString(s: string[]): void {
    let left = 0;               // 指向首元素
    let right = s.length - 1;   // 指向末元素
    // 首尾对撞，两两交换
    while (left < right) {
        const tmp = s[left];
        s[left] = s[right];
        s[right] = tmp;
        left++;
        right--;
    }
}`
  },
  'lc-reverse-string-ii': {
    desc: `给定一个字符串 s 和一个整数 k，从字符串开头算起，每计数至 2k 个字符，就反转这 2k 个字符中的前 k 个字符。如果剩余字符少于 k 个，则将剩余字符全部反转；如果剩余字符小于 2k 但大于或等于 k 个，则反转前 k 个字符，其余字符保持原样。

**示例 1：**
- 输入：s = "abcdefg", k = 2
- 输出："bacdfeg"
- 解释：每 2k = 4 个字符为一组，反转每组前 k = 2 个字符，即 ab 变 ba、ef 变 fe。

**示例 2：**
- 输入：s = "abcd", k = 2
- 输出："bacd"

**提示：**
- 1 <= s.length <= 10^4
- s 仅由小写英文组成
- 1 <= k <= 10^4`,
    analysis: `### 核心思路

本题是「反转字符串」的分组升级版，关键在于找到模拟的规律：让下标 i 每次跨越 2k，它正好落在每个分组的首字符上。然后在每个起点只需判断一件事——从这里往后还凑不凑得齐 k 个字符。凑得齐就反转区间 [i, i + k - 1]，凑不齐就把剩余字符全部反转。

> 三种情况其实只有两种处理：剩余大于等于 k 个时反转前 k 个，剩余小于 k 个时全部反转。而「剩余在 k 到 2k 之间」与「剩余更多」在前一种处理里天然统一，因为反转只针对前 k 个，后面的字符自然保持原样，无需单独判断。

### 算法步骤

1. 将字符串转为字符数组（JS 字符串不可变）。
2. for 循环，i 从 0 开始，每次步进 2 * k。
3. 每轮取 left = i，right = min(i + k - 1, 数组末尾下标)，双指针交换完成区间反转。
4. 全部处理完后把数组拼接为字符串返回。

### 易错点

- 反转区间是闭区间 [i, i + k - 1]，右边界不要写成 i + k，否则会多反转一个字符。
- i 的步长是 2 * k，不是 k，写错会导致分组错位。
- 剩余不足 k 个时反转的是剩余的**全部**字符，而不是最后 k 个。
- 不要给每种情况单独写一串 if 判断，用 min 统一右边界最简洁。

### 复杂度分析

- 时间复杂度：O(n)，每个字符最多参与常数次交换。
- 空间复杂度：O(n)，字符数组开销；支持原地修改的语言中为 O(1)。`,
    code: `function reverseStr(s: string, k: number): string {
    const arr = s.split('');  // 字符串不可变，先转数组
    // i 每次跨越 2k，正好落在每组首字符上
    for (let i = 0; i < arr.length; i += 2 * k) {
        let left = i;
        // 剩余不足 k 个时，右边界自动收缩到数组末尾
        let right = Math.min(i + k - 1, arr.length - 1);
        while (left < right) {  // 双指针交换，反转 [left, right]
            const tmp = arr[left];
            arr[left] = arr[right];
            arr[right] = tmp;
            left++;
            right--;
        }
    }
    return arr.join('');
}`
  },
  'lc-ti-huan-kong-ge-lcof': {
    desc: `请实现一个函数，把字符串 s 中的每个空格替换成 **%20**。空格可能出现在字符串的任意位置，也可能出现多个，需要全部替换。

**示例 1：**
- 输入：s = "We are happy."
- 输出："We%20are%20happy."
- 解释：两个空格分别被替换为 %20，其余字符保持不变。

**提示：**
- 0 <= s.length <= 10000`,
    analysis: `### 核心思路

最直观的做法是从前往后遍历，遇到空格就把后面的字符整体后移两位再填入 %20，但每个空格都引发一次 O(n) 的搬移，最坏 O(n^2)。代码随想录推荐的高效技巧是**先扩容、再从后往前填充**：先统计空格个数，把字符数组扩容到替换后的长度，再用双指针从尾部向前移动。

> 从后往前填充的精髓：旧指针 left 从原字符串末尾出发，新指针 right 从扩容后的末尾出发，right 始终不小于 left，之间不会覆盖任何尚未处理的字符，每个字符只搬一次，整体 O(n)。

### 算法步骤

1. 遍历 s，统计空格个数 count。
2. 把字符数组扩容到 s.length + 2 * count 的长度，每个空格由 1 个字符变为 3 个。
3. left 指向原字符串末尾，right 指向扩容后的末尾。
4. left 从后向前遍历：普通字符直接复制到 right 处；遇到空格则依次填入 0、2、%。
5. left 走到头时填充完成，拼接返回。

### 易错点

- 扩容大小是 s.length + 2 * count：每个空格从 1 个字符变成 3 个，净增 2 个。
- 遇到空格时从后往前依次填 0、2、%，顺序写反结果会变成 02%。
- 循环条件是 left >= 0；当 left 与 right 相遇，说明前面已经没有空格，可以提前结束。
- 这套「扩容 + 从后向前填充」技巧还适用于合并两个有序数组等原地填充问题，务必掌握。

### 复杂度分析

- 时间复杂度：O(n)，统计与填充各扫描一遍。
- 空间复杂度：O(n)，字符数组开销（JS 字符串不可变，无法真正原地）。`,
    code: `function replaceSpace(s: string): string {
    // 统计空格个数
    let spaceCount = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === ' ') spaceCount++;
    }
    const newLen = s.length + 2 * spaceCount;  // 每个空格多占 2 个字符
    const arr: string[] = new Array(newLen);
    for (let i = 0; i < s.length; i++) {
        arr[i] = s[i];
    }
    // 从后向前双指针填充
    let left = s.length - 1;   // 指向原字符串末尾
    let right = newLen - 1;    // 指向扩容后的末尾
    while (left >= 0) {
        if (s[left] === ' ') {
            arr[right--] = '0';  // 逆序填入 %20
            arr[right--] = '2';
            arr[right--] = '%';
            left--;
        } else {
            arr[right--] = s[left--];
        }
    }
    return arr.join('');
}`
  },
  'lc-reverse-words-in-a-string': {
    desc: `给你一个字符串 s，请你反转字符串中**单词**的顺序。单词是由非空格字符组成的连续子串，s 中使用至少一个空格将单词分隔开。要求返回反转后的字符串，单词之间用**单个空格**分隔，且不包含任何前导或尾随空格。进阶：尝试使用 O(1) 额外空间的原地算法解决本题。

**示例 1：**
- 输入：s = "the sky is blue"
- 输出："blue is sky the"

**示例 2：**
- 输入：s = "  hello world  "
- 输出："world hello"
- 解释：反转的同时要去除前导、尾随空格，并把单词间的多个空格压缩成一个。

**示例 3：**
- 输入：s = "a good   example"
- 输出："example good a"

**提示：**
- 1 <= s.length <= 10^4
- s 包含英文大小写字母、数字和空格
- s 中至少存在一个单词`,
    analysis: `### 核心思路

分三步走：**移除多余空格 → 整体反转 → 逐个单词再反转**。先把整个字符串反转，单词的相对顺序就对了，但每个单词内部的字符是倒的；再把每个单词各自反转一次，单词内部恢复正常。这种「整体反转 + 局部反转」的组合拳是字符串题的经典套路，下一题左旋转字符串还会用到。

> 三步中最容易被轻视的是第一步：必须把前导、尾随空格以及单词间连续的多个空格全部清掉，只保留单词间一个空格。用快慢指针原地移除：快指针扫描，慢指针写入，每写完一个单词补一个空格，最后把末尾多余的空格裁掉。

### 算法步骤

1. 快慢指针移除多余空格：快指针遇到非空字符就开始搬运整个单词，慢指针负责写入，单词之间补一个空格。
2. 将字符数组整体反转。
3. 从头扫描，遇到空格或到达末尾即确定一个单词的边界，对每个单词单独反转。
4. 拼接返回结果。

### 易错点

- 移除空格时，只有 slow 不在起点才补空格，否则开头会多出一个空格。
- 反转单词的边界要用「空格或到达末尾」判断，for 循环要走到 i <= length 才能覆盖最后一个单词。
- 用 split 加 filter 加 reverse 加 join 一行也能过，但面试考察的就是手写原地解法，别偷懒。
- JS 字符串不可变，需要先转字符数组操作，最后再拼接返回。

### 复杂度分析

- 时间复杂度：O(n)，三个步骤均为线性扫描。
- 空间复杂度：O(n)，字符数组开销；支持原地修改的语言中为 O(1)。`,
    code: `function reverseWords(s: string): string {
    const arr = Array.from(s);
    // 第一步：快慢指针移除多余空格
    let slow = 0;
    for (let fast = 0; fast < arr.length; fast++) {
        if (arr[fast] !== ' ') {
            if (slow !== 0) arr[slow++] = ' ';  // 单词间补一个空格
            while (fast < arr.length && arr[fast] !== ' ') {
                arr[slow++] = arr[fast++];      // 搬运整个单词
            }
        }
    }
    arr.length = slow;  // 裁掉尾部多余部分
    // 第二步：整体反转
    reverseRange(arr, 0, arr.length - 1);
    // 第三步：逐个单词反转
    let start = 0;
    for (let i = 0; i <= arr.length; i++) {
        if (i === arr.length || arr[i] === ' ') {
            reverseRange(arr, start, i - 1);
            start = i + 1;
        }
    }
    return arr.join('');
}

// 闭区间 [left, right] 原地反转
function reverseRange(arr: string[], left: number, right: number): void {
    while (left < right) {
        const tmp = arr[left];
        arr[left] = arr[right];
        arr[right] = tmp;
        left++;
        right--;
    }
}`
  },
  'lc-zuo-xuan-zhuan-zi-fu-chuan-lcof': {
    desc: `字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请实现一个函数，完成字符串左旋转 n 位的功能，返回旋转后的结果。进阶：尝试用「局部反转 + 整体反转」的方式实现，而不是直接切片拼接。

**示例 1：**
- 输入：s = "abcdefg", n = 2
- 输出："cdefgab"
- 解释：把前面的 ab 移到尾部，得到 cdefgab。

**示例 2：**
- 输入：s = "lrloseumgh", n = 6
- 输出："umghlrlose"

**提示：**
- 1 <= s.length <= 10000
- 1 <= n <= 10000
- 题目数据保证 n 小于字符串长度`,
    analysis: `### 核心思路

最省事的写法是 s.slice(n) + s.slice(0, n) 直接拼接，但进阶考察的是**局部反转 + 整体反转**的组合：先把前 n 个字符反转，再把剩余字符反转，最后把整个字符串反转一遍。

> 为什么这样恰好得到左旋转？把 s 看成两段 A（前 n 个字符）和 B（剩余部分），目标结果是 B A。对 A、B 分别反转后字符串变为 A' B'（A' 表示 A 的反转）；再对整个字符串反转，两部分各自还原的同时顺序也对调，结果正是 B A。口诀：先局部反转，再整体反转。

### 算法步骤

1. 反转区间 [0, n - 1]，即前 n 个字符。
2. 反转区间 [n, s.length - 1]，即剩余字符。
3. 反转整个字符串 [0, s.length - 1]。
4. 拼接返回。

以 abcdefg、n = 2 为例：

~~~
ab cdefg → ba gfedc → cdefgab
~~~

### 易错点

- 第二次反转的起点下标是 n，前一段的区间是 [0, n - 1]，两段不要重叠也不要漏掉。
- 与右旋转区分：右旋转 k 位等价于左旋转 len - k 位，可以转化后套用同一套逻辑。
- 若允许额外空间，切片拼接一行搞定；面试遇到进阶要求时必须会原地写法。
- 本题与「翻转字符串里的单词」共用同一思想，可以对照记忆。

### 复杂度分析

- 时间复杂度：O(n)，每个字符最多被交换两次。
- 空间复杂度：O(n)，JS 字符串不可变需要字符数组；可原地修改的语言中为 O(1)。`,
    code: `function reverseLeftWords(s: string, n: number): string {
    const arr = s.split('');
    reverseRange(arr, 0, n - 1);           // 反转前 n 个字符
    reverseRange(arr, n, arr.length - 1);  // 反转剩余字符
    reverseRange(arr, 0, arr.length - 1);  // 整体反转
    return arr.join('');
}

// 闭区间 [left, right] 原地反转
function reverseRange(arr: string[], left: number, right: number): void {
    while (left < right) {
        const tmp = arr[left];
        arr[left] = arr[right];
        arr[right] = tmp;
        left++;
        right--;
    }
}`
  },
  'lc-implement-strstr': {
    desc: `给你两个字符串 haystack 和 needle，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回 -1；当 needle 是空字符串时返回 0。本题是 KMP 算法的入门经典，建议不用内置的 indexOf，而是亲手实现 KMP。

**示例 1：**
- 输入：haystack = "hello", needle = "ll"
- 输出：2

**示例 2：**
- 输入：haystack = "aaaaa", needle = "bba"
- 输出：-1

**示例 3：**
- 输入：haystack = "", needle = ""
- 输出：0

**提示：**
- 0 <= haystack.length, needle.length <= 5 * 10^4
- haystack 和 needle 仅由小写英文字符组成`,
    analysis: `### 核心思路

暴力解法是文本串和模式串双层循环，每次失配都把模式串挪回开头重新比，最坏 O(m * n)。KMP 的核心武器是 **next 数组（前缀表）**：它记录模式串每个位置之前的子串中，最长相等前后缀的长度。失配时利用这个信息把模式串直接「对齐」到合适位置继续比较，主串指针 i 从不回退，复杂度降到 O(m + n)。

> KMP 为什么快？失配时，模式串中已经匹配上的部分，其尾部（后缀）必然与主串对应位置相等；这部分后缀又可能恰好等于模式串的前缀。前缀表就是用来找「最长相等前后缀」的，于是模式串一次可以滑过多步，省去大量重复比较。

### 算法步骤

1. 构建 next 数组（本实现采用前缀表统一减一的版本）：初始化 next[0] = -1；i 指向后缀末尾，j 指向前缀末尾；字符相等时 j 后移并记录 next[i]，不等时 j 回退到 next[j]。
2. 匹配阶段：i 扫描 haystack，j 表示模式串已匹配到的末位（减一版本从 -1 开始）。
3. 失配时 j 沿 next[j] 回退；匹配则 i、j 同步后移。
4. j 走到 needle.length - 1 即匹配成功，返回起始下标；循环结束仍未成功返回 -1。

### 易错点

- next 数组有「原值」和「统一减一」两种流派，减一版本比较时用的是 needle[j + 1]，回退和判定要配套，不能混用。
- 构建 next 时的回退要用 while 而不是 if，可能需要连续回退多次。
- needle 为空字符串时要特判返回 0。
- 匹配成功时 j 等于模式串长度减一，返回 i - needle.length + 1，别直接返回 i。

### 复杂度分析

- 时间复杂度：O(m + n)，m 为文本串长度，n 为模式串长度；构建 next 为 O(n)，匹配为 O(m)。
- 空间复杂度：O(n)，next 数组开销。`,
    code: `function strStr(haystack: string, needle: string): number {
    if (needle.length === 0) return 0;  // 空模式串特判
    // 构建 next 数组（前缀表统一减一版本）
    const next: number[] = new Array(needle.length);
    let j = -1;   // j 指向前缀末尾
    next[0] = j;
    for (let i = 1; i < needle.length; i++) {
        // 前后缀不等，j 沿 next 回退
        while (j >= 0 && needle[i] !== needle[j + 1]) {
            j = next[j];
        }
        // 前后缀相等，j 后移
        if (needle[i] === needle[j + 1]) j++;
        next[i] = j;
    }
    // 匹配阶段：i 扫描文本串，j 表示已匹配的模式串末位
    j = -1;
    for (let i = 0; i < haystack.length; i++) {
        // 失配，j 回退
        while (j >= 0 && haystack[i] !== needle[j + 1]) {
            j = next[j];
        }
        // 匹配，i、j 同步后移
        if (haystack[i] === needle[j + 1]) j++;
        // 模式串全部匹配完成
        if (j === needle.length - 1) {
            return i - needle.length + 1;  // 匹配起始下标
        }
    }
    return -1;
}`
  },
  'lc-repeated-substring-pattern': {
    desc: `给定一个非空的字符串 s，检查它是否可以由它的一个子串重复多次构成。若可以由某个长度大于 0 的子串重复两次及以上构成则返回 true，否则返回 false。

**示例 1：**
- 输入：s = "abab"
- 输出：true
- 解释：s 可由子串 ab 重复两次构成。

**示例 2：**
- 输入：s = "aba"
- 输出：false

**示例 3：**
- 输入：s = "abcabcabcabc"
- 输出：true
- 解释：s 可由 abc 重复四次构成，也可由 abcabc 重复两次构成。

**提示：**
- 1 <= s.length <= 10^4
- s 由小写英文字母组成`,
    analysis: `### 核心思路

本题是字符串章节的收官题，用 KMP 的 next 数组可以给出一个漂亮的判断。若 s 由重复子串构成，那么**最长相等前后缀不覆盖的中间区域，正好是一个最小重复单元**。记整个字符串的最长相等前后缀长度为 longest（减一版本为 next[len - 1] + 1），则重复单元长度为 len - longest；只要 len 能被 len - longest 整除，s 就一定由重复子串构成。

> 直觉解释：存在最长相等前后缀，意味着开头一段和结尾一段完全相同。把开头这段「叠」到结尾这段上，中间错开的区域恰好被首尾重叠补齐，其长度就是循环周期；周期能整除总长，说明整个字符串由它铺满。

还有一个思路极简的**移动匹配**解法：把 s 拼接成 s + s 再掐头去尾，若 s 仍能在其中找到，则 s 必由重复子串构成——因为不含重复单元的串在 s + s 中只会在两处拼接位置恰好出现两次。

### 算法步骤

1. 构建 next 数组（前缀表统一减一，与 strStr 题同一套写法）。
2. 计算 longest = next[len - 1] + 1，即整个字符串的最长相等前后缀长度。
3. longest 为 0 说明不存在相等前后缀，直接返回 false。
4. 判断 s.length 能否被 s.length - longest 整除，能整除返回 true，否则 false。

### 易错点

- 减一版本下最长相等前后缀是 next[len - 1] + 1，别直接把 next[len - 1] 当长度用。
- 整除的分母是周期 len - longest；若用「原值版本」next 数组则是 len - next[len - 1]，两种写法不能混。
- 用移动匹配时必须掐掉 s + s 的首尾各一个字符，否则 s 原串就会被匹配到。
- 单字符字符串没有相等前后缀，longest 为 0，自然返回 false。

### 复杂度分析

- 时间复杂度：O(n)，主要开销在构建 next 数组。
- 空间复杂度：O(n)，next 数组开销。`,
    code: `function repeatedSubstringPattern(s: string): boolean {
    // 构建 next 数组（前缀表统一减一版本）
    const next: number[] = new Array(s.length);
    let j = -1;
    next[0] = j;
    for (let i = 1; i < s.length; i++) {
        while (j >= 0 && s[i] !== s[j + 1]) j = next[j];  // 失配回退
        if (s[i] === s[j + 1]) j++;                       // 匹配则前移
        next[i] = j;
    }
    // 整个字符串的最长相等前后缀长度
    const longest = next[s.length - 1] + 1;
    if (longest === 0) return false;  // 无相等前后缀，不可能由重复子串构成
    // 最小重复单元长度 = len - longest，能整除即成立
    return s.length % (s.length - longest) === 0;
}`
  }
}

export default solutions
