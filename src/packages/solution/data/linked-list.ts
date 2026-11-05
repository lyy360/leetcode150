import type { Solution } from './types'

const solutions: Record<string, Solution> = {
  'lc-remove-linked-list-elements': {
    desc: `给你一个链表的头节点 head 和一个整数 val，请你删除链表中所有满足 Node.val === val 的节点，并返回新的头节点。

**示例 1：**

- 输入：head = [1,2,6,3,4,5,6], val = 6
- 输出：[1,2,3,4,5]

**示例 2：**

- 输入：head = [], val = 1
- 输出：[]

**示例 3：**

- 输入：head = [7,7,7,7], val = 7
- 输出：[]

**提示：**

- 列表中的节点数目在范围 [0, 10^4] 内
- 1 <= Node.val <= 50
- 0 <= val <= 50`,
    analysis: `### 核心思路

删除链表节点的关键在于：要删除某个节点，必须拿到它**前一个节点**的引用，让前一个节点的 next 跳过被删节点即可。麻烦的是，如果被删的是头节点，它没有前驱，需要单独处理。

> 设置一个**虚拟头节点**（dummy node）指向真正的头节点，这样链表里每个真实节点都有了前驱，删除头节点和删除中间节点的逻辑完全统一，代码大大简化。

### 算法步骤

1. 新建虚拟头节点 dummy，令 dummy.next = head。
2. 用指针 cur 从 dummy 开始遍历，每一步只检查 cur.next。
3. 如果 cur.next 存在且其值等于 val，执行 cur.next = cur.next.next，直接跳过目标节点。
4. 否则 cur 后移一位。
5. 遍历结束后返回 dummy.next，即新链表的头节点。

### 易错点

- 删除节点后 cur **不要**后移：新的 cur.next 可能同样等于 val（例如连续多个 7），必须原地继续检查。
- 返回值要用 dummy.next 而不是 head，因为原头节点可能已经被删除。
- 先循环删头、再删中间的写法也可以，但逻辑分叉多、容易漏，虚拟头节点是更稳妥的通用套路。

### 复杂度分析

- 时间复杂度：O(n)，每个节点最多被访问一次。
- 空间复杂度：O(1)，只使用了常数个额外指针。`,
    code: `function removeElements(head: ListNode | null, val: number): ListNode | null {
    // 虚拟头节点：统一删除头节点与中间节点的逻辑
    const dummy: ListNode = new ListNode(0, head)
    let cur: ListNode = dummy
    while (cur.next !== null) {
        if (cur.next.val === val) {
            // 跳过值等于 val 的节点，cur 原地不动继续检查下一个
            cur.next = cur.next.next
        } else {
            cur = cur.next
        }
    }
    return dummy.next
}`
  },
  'lc-design-linked-list': {
    desc: `设计链表的实现。单链表中的节点应具备两个属性：val 和 next。选择使用单链表，设计并实现 MyLinkedList 类：

- MyLinkedList() 初始化 MyLinkedList 对象。
- get(index)：获取链表中下标为 index 的节点的值。如果下标无效，返回 -1。
- addAtHead(val)：将一个值为 val 的节点插入到链表中第一个元素之前。
- addAtTail(val)：将一个值为 val 的节点追加到链表中作为最后一个元素。
- addAtIndex(index, val)：将一个值为 val 的节点插入到链表中下标为 index 的节点之前。如果 index 等于链表的长度，该节点会被追加到链表末尾；如果 index 比长度更大，该节点将不会插入。
- deleteAtIndex(index)：如果下标有效，删除链表中下标为 index 的节点。

**示例：**

- 输入：["MyLinkedList", "addAtHead", "addAtTail", "addAtIndex", "get", "deleteAtIndex", "get"], [[], [1], [3], [1, 2], [1], [1], [1]]
- 输出：[null, null, null, null, 2, null, 3]
- 解释：链表依次变为 1；1 -> 3；插入后为 1 -> 2 -> 3；get(1) 返回 2；删除下标 1 后为 1 -> 3；get(1) 返回 3。

**提示：**

- 0 <= index, val <= 1000
- 请不要使用内置的 LinkedList 库
- 最多调用 2000 次 get、addAtHead、addAtTail、addAtIndex 和 deleteAtIndex`,
    analysis: `### 核心思路

设计链表考察对各类边界情况的掌控。推荐使用**虚拟头节点 + size 记录长度**的实现：虚拟头节点让"在头部插入/删除"与"在中间插入/删除"完全统一，size 则让所有下标合法性判断一目了然。

> 关键约定：真实节点的下标从 0 开始，虚拟头节点不算在 size 内。有了这个约定，get、addAtIndex、deleteAtIndex 的合法下标范围都能直接用 size 推导出来。

### 算法步骤

- get(index)：合法范围是 [0, size - 1]。让 cur 从 dummy 出发走 index + 1 步（dummy 本身占一步），返回 cur.val；越界返回 -1。
- addAtHead / addAtTail：分别等价于 addAtIndex(0, val) 和 addAtIndex(size, val)，直接复用，避免重复代码。
- addAtIndex(index, val)：仅当 0 <= index <= size 时插入（index === size 即尾部追加）。让 prev 从 dummy 出发走 index 步，停在待插入位置的**前一个节点**，再接入新节点，size 加一。
- deleteAtIndex(index)：仅当 0 <= index <= size - 1 时删除。同样让 prev 停在前一个节点，执行 prev.next = prev.next.next，size 减一。

### 易错点

- addAtIndex 的合法范围是 [0, size] 两端都闭；deleteAtIndex 的合法范围是 [0, size - 1]，边界条件最容易写错。
- 找前驱的步数：从 dummy 出发走 index 步即可，因为 dummy 相当于下标 -1，多走或少走一步都会错位。
- 插入和删除后务必维护 size，否则后续所有越界判断都会失效。

### 复杂度分析

- 时间复杂度：get、按下标插入和删除均为 O(index)；addAtHead 为 O(1)；addAtTail 不维护尾指针则为 O(size)。
- 空间复杂度：O(1)，不计链表本身占用的节点。`,
    code: `class LinkNode {
    val: number
    next: LinkNode | null
    constructor(val: number, next: LinkNode | null = null) {
        this.val = val
        this.next = next
    }
}

class MyLinkedList {
    private dummy: LinkNode // 虚拟头节点，不计入 size
    private size: number

    constructor() {
        this.dummy = new LinkNode(0)
        this.size = 0
    }

    get(index: number): number {
        if (index < 0 || index >= this.size) return -1
        let cur: LinkNode = this.dummy.next as LinkNode
        for (let i = 0; i < index; i++) cur = cur.next as LinkNode
        return cur.val
    }

    addAtHead(val: number): void {
        this.addAtIndex(0, val)
    }

    addAtTail(val: number): void {
        this.addAtIndex(this.size, val)
    }

    addAtIndex(index: number, val: number): void {
        if (index > this.size) return
        if (index < 0) index = 0
        // prev 停在待插入位置的前一个节点
        let prev: LinkNode = this.dummy
        for (let i = 0; i < index; i++) prev = prev.next as LinkNode
        prev.next = new LinkNode(val, prev.next)
        this.size++
    }

    deleteAtIndex(index: number): void {
        if (index < 0 || index >= this.size) return
        let prev: LinkNode = this.dummy
        for (let i = 0; i < index; i++) prev = prev.next as LinkNode
        prev.next = prev.next!.next
        this.size--
    }
}`
  },
  'lc-reverse-linked-list': {
    desc: `给你单链表的头节点 head，请你反转链表，并返回反转后的链表。

**示例 1：**

- 输入：head = [1,2,3,4,5]
- 输出：[5,4,3,2,1]

**示例 2：**

- 输入：head = [1,2]
- 输出：[2,1]

**示例 3：**

- 输入：head = []
- 输出：[]

**提示：**

- 链表中节点的数目范围是 [0, 5000]
- -5000 <= Node.val <= 5000

**进阶：** 链表可以选用迭代或递归方式完成反转，你能否用两种方法解决这道题？`,
    analysis: `### 核心思路

反转链表的本质是把每个节点的 next 指针从"指向后一个"改为"指向前一个"。指针一旦改向，原来的后继就"断"了，所以必须提前把后继节点保存下来。

> 迭代法用**双指针**：pre 指向已反转部分的头，cur 指向待反转部分的头。每轮循环做三件事——先用临时变量 temp 记下 cur.next，再把 cur.next 指向 pre，最后 pre、cur 依次前移。循环结束时 pre 就是新链表的头。

递归法的思路是"先信任递归的结果"：reverseList(head) 返回已反转好的子链表头（即原链表的尾节点），此时 head.next 正好是新链表的尾节点，执行 head.next.next = head 把 head 接回尾部，再把 head.next 置空防止成环。

### 算法步骤

迭代版本：

1. 初始化 pre = null，cur = head。
2. 每轮循环：temp = cur.next，然后 cur.next = pre，接着 pre = cur，最后 cur = temp。
3. cur 为 null 时结束，返回 pre。

递归版本：

1. 终止条件：head 为 null 或 head.next 为 null，直接返回 head。
2. 用递归反转 head 之后的链表，得到新头 newHead。
3. head.next.next = head，head.next = null，返回 newHead。

### 易错点

- 必须先用 temp 保存 cur.next，否则把 cur.next 改向 pre 之后整条链就断了。
- 返回的是 pre 不是 cur：循环结束时 cur 已经指向 null。
- 递归解法中 head.next = null 不能省略，否则原头节点（新尾节点）仍指向原来的第二个节点，链表会成环。

### 复杂度分析

- 时间复杂度：O(n)，两种方法都恰好访问每个节点一次。
- 空间复杂度：迭代法 O(1)；递归法 O(n)，来自递归调用栈。`,
    code: `function reverseList(head: ListNode | null): ListNode | null {
    let pre: ListNode | null = null
    let cur: ListNode | null = head
    while (cur !== null) {
        // 先保存后继节点，防止指针改向后丢失后续链表
        const temp: ListNode | null = cur.next
        cur.next = pre
        pre = cur
        cur = temp
    }
    return pre
}`
  },
  'lc-swap-nodes-in-pairs': {
    desc: `给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

**示例 1：**

- 输入：head = [1,2,3,4]
- 输出：[2,1,4,3]

**示例 2：**

- 输入：head = []
- 输出：[]

**示例 3：**

- 输入：head = [1]
- 输出：[1]

**提示：**

- 链表中节点的数目在范围 [0, 100] 内
- 0 <= Node.val <= 100`,
    analysis: `### 核心思路

两两交换需要同时操作三个引用：前驱节点，以及当前一对节点中的两个。因为交换后原来的第二个节点会成为这一段的"局部头节点"，整条链表的头也可能变化，所以**虚拟头节点**再次登场。

> 每次交换前，cur 站在待交换一对节点**前一个**的位置上。交换口诀：先让第二个节点顶到前面，再让第一个节点接管后面，最后把后续链表接回去，cur 前进到交换后的第二个节点，为下一对做准备。

当剩下不足两个节点（cur.next 或 cur.next.next 为空）时就停止，不需要交换。

### 算法步骤

设 dummy 指向 head，cur = dummy。当 cur.next 与 cur.next.next 都存在时：

1. 用 first 记下 cur.next（第一个节点），用 third 记下 cur.next.next.next（下一对的入口）。
2. 执行 cur.next = cur.next.next，让第二个节点顶到前面。
3. 让新的 cur.next（原第二个节点）的 next 指回 first。
4. 执行 first.next = third 把后续链表接回，然后 cur = first（即交换后靠后的节点）。

### 易错点

- 四步指针操作的**顺序**极其重要：必须先保存下一对的入口 third，再改动 cur.next，否则后半条链就找不回来了。
- cur 每轮要前进到交换后的**第二个节点**（原第一个节点），走错位置会导致下一对交换错乱。
- 空链表或只有一个节点时直接返回原链表，空指针判断要写在循环条件里，循环体内就不用再判。

### 复杂度分析

- 时间复杂度：O(n)，每个节点只被访问常数次。
- 空间复杂度：O(1)，只使用了几个临时指针。`,
    code: `function swapPairs(head: ListNode | null): ListNode | null {
    const dummy: ListNode = new ListNode(0, head)
    let cur: ListNode = dummy
    while (cur.next !== null && cur.next.next !== null) {
        const first: ListNode = cur.next
        const third: ListNode | null = cur.next.next.next
        // 第二个节点顶到前面
        cur.next = cur.next.next
        cur.next.next = first
        // 把后续链表接回去
        first.next = third
        // cur 前进到交换后靠后的节点，准备下一对交换
        cur = first
    }
    return dummy.next
}`
  },
  'lc-remove-nth-node-from-end-of-list': {
    desc: `给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

**示例 1：**

- 输入：head = [1,2,3,4,5], n = 2
- 输出：[1,2,3,5]

**示例 2：**

- 输入：head = [1], n = 1
- 输出：[]

**示例 3：**

- 输入：head = [1,2], n = 1
- 输出：[1]

**提示：**

- 链表中结点的数目为 sz
- 1 <= sz <= 30
- 0 <= Node.val <= 100
- 1 <= n <= sz

**进阶：** 能尝试使用一趟扫描实现吗？`,
    analysis: `### 核心思路

要删除倒数第 n 个节点，本质上还是要找到它的**前一个节点**。朴素做法是先遍历一遍求出链表长度 sz，再走到第 sz - n - 1 个节点，需要两趟扫描。

> 更优雅的做法是**快慢指针**：让 fast 先走 n 步拉开差距，然后 fast 和 slow 同速前进。当 fast 走到链表末尾时，slow 恰好停在倒数第 n 个节点的前一个位置——因为两个指针之间始终保持着固定的距离差。

再配合虚拟头节点，即使要删除的是头节点，slow 也稳稳停在前驱上，直接返回 dummy.next 即可。

### 算法步骤

1. 建虚拟头节点 dummy 指向 head，令 slow = fast = dummy。
2. fast 先走 n + 1 步（多走一步是为了让 slow 最终停在被删节点的**前驱**上）。
3. fast 与 slow 同时前进，直到 fast 为 null。
4. 此时 slow.next 就是要删除的节点，执行 slow.next = slow.next.next。
5. 返回 dummy.next。

### 易错点

- fast 先走的步数：只走 n 步会让 slow 停在被删节点本身，无法删除；**走 n + 1 步**才能让 slow 停在前驱。
- 引入 dummy 后从 dummy 起步再走 n + 1 步，边界天然正确，尤其能处理"删除唯一头节点"这种特殊情况。
- 循环终止条件与步数写法要配套：先走 n + 1 步的写法对应 fast === null 时结束，换一种步数就要换终止条件，别混用。

### 复杂度分析

- 时间复杂度：O(L)，L 为链表长度，fast 与 slow 各自最多遍历链表一次。
- 空间复杂度：O(1)，只使用了两个指针。`,
    code: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    const dummy: ListNode = new ListNode(0, head)
    let fast: ListNode | null = dummy
    let slow: ListNode = dummy
    // fast 先走 n + 1 步，使 slow 最终停在被删节点的前驱
    for (let i = 0; i <= n; i++) {
        fast = fast.next
    }
    while (fast !== null) {
        fast = fast.next
        slow = slow.next!
    }
    // slow 的下一个节点即倒数第 n 个节点，删除它
    slow.next = slow.next!.next
    return dummy.next
}`
  },
  'lc-intersection-of-two-linked-lists-lcci': {
    desc: `给你两个单链表的头节点 headA 和 headB，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null。题目数据保证整个链式结构中不存在环。函数返回结果后，链表必须保持其原始结构。

**示例 1：**

- 输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
- 输出：Intersected at '8'
- 解释：相交节点的值为 8（注意，如果两个链表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,6,1,8,4,5]。在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。

**示例 2：**

- 输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
- 输出：null
- 解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。这两个链表不相交，因此 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。

**提示：**

- listA 中节点数目为 m，listB 中节点数目为 n
- 1 <= m, n <= 3 * 10^4
- 如果 listA 和 listB 没有交点，intersectVal 为 0
- **进阶：** 你能否设计一个时间复杂度 O(m + n)、仅用 O(1) 内存的解决方案？`,
    analysis: `### 核心思路

两条链表一旦相交，从相交节点开始它们**共享所有后续节点**，所以长度差只出现在前半段。抓住这一点，就能设计出消除长度差的经典解法。

> **双指针浪漫解法**：指针 pA 从 headA 出发，pB 从 headB 出发，每次各走一步；pA 走到头就改走 headB，pB 走到头就改走 headA。这样每个指针走过的总路程都是 a + b + c（a、b 为各自独有部分，c 为公共部分），若相交，两个指针会在**同一时刻**到达相交点；若不相交，则同时到达 null。

另一个思路是先分别统计两条链表的长度，让长链表的指针先走差值步，把两个指针对齐到"距末尾等远"的位置，然后同步前进，第一个相同的节点就是交点。两种方法本质上都是消除长度差。

### 算法步骤

1. 初始化 pA = headA，pB = headB。
2. 每轮先判断：若 pA 与 pB 相等，返回任意一个（包含两者都为 null 的情况）。
3. 否则 pA = pA === null ? headB : pA.next，pB 同理切换到 headA。
4. 循环必然终止：相交时两指针路程之和到达 a + b + c 前必相遇；不相交时第二轮走到末尾会同时为 null。

### 易错点

- 比较的是**节点引用是否相同**，不是节点值是否相同——值相等不代表是同一个节点。
- 切换链表的条件是 pA === null 时跳到 headB，注意先判空再取 next，避免在 null 上访问属性。
- 无交点时为什么不会死循环：pA 走完 a + b 步、pB 走完 b + a 步后同时变成 null，满足相等条件而正常退出。

### 复杂度分析

- 时间复杂度：O(m + n)，最坏情况两个指针各走完两条链表。
- 空间复杂度：O(1)，只使用了两个指针。`,
    code: `function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
    if (headA === null || headB === null) return null
    let pA: ListNode | null = headA
    let pB: ListNode | null = headB
    while (pA !== pB) {
        // pA 走完 A 链就转去走 B 链，pB 同理，用总路程相等消除长度差
        pA = pA === null ? headB : pA.next
        pB = pB === null ? headA : pB.next
    }
    // 相等时要么是相交节点，要么同为 null
    return pA
}`
  },
  'lc-linked-list-cycle-ii': {
    desc: `给定一个链表的头节点 head，返回链表开始入环的第一个节点。如果链表无环，则返回 null。如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达它，则链表中存在环。不允许修改链表。

**示例 1：**

- 输入：head = [3,2,0,-4], pos = 1
- 输出：返回索引为 1 的链表节点
- 解释：链表中有一个环，其尾部连接到第二个节点。

**示例 2：**

- 输入：head = [1,2], pos = 0
- 输出：返回索引为 0 的链表节点
- 解释：链表中有一个环，其尾部连接到第一个节点。

**示例 3：**

- 输入：head = [1], pos = -1
- 输出：返回 null
- 解释：链表中没有环。

**提示：**

- 链表中节点的数目范围在 [0, 10^4] 内
- -10^5 <= Node.val <= 10^5
- pos 的值为 -1 或者链表中的一个有效索引

**进阶：** 你是否可以使用 O(1) 空间解决此题？`,
    analysis: `### 核心思路

先用**快慢指针**判断是否有环：slow 每次走一步，fast 每次走两步。只要链表有环，fast 一定会从后面追上 slow（两者在环内的相对速度为 1，距离每轮缩小 1，必然相遇）；如果 fast 先到达 null，说明无环。

相遇之后如何找到入环点？这里有一段经典的**数学推导**：

> 设头节点到入环点距离为 x，入环点到相遇点为 y，相遇点绕回入环点为 z。相遇时 slow 走了 x + y，fast 走了 x + y + n(y + z)，由 fast 速度是 slow 两倍可得 x + y = n(y + z)，化简得 **x = z + (n - 1)(y + z)**。也就是说，从相遇点出发走 z 步（可能再绕若干整圈）正好落在入环点——这等价于：一个指针从 head 出发，另一个从相遇点出发，同速前进，再次相遇的位置就是入环点。

### 算法步骤

1. slow、fast 从 head 出发，slow 每次一步，fast 每次两步。
2. 若 fast 或 fast.next 变为 null，返回 null，表示无环。
3. 若 slow === fast，说明有环：令 index1 从 head 出发，index2 从相遇点出发，每次各走一步。
4. index1 与 index2 再次相遇的节点即入环点，返回它。

### 易错点

- fast 每次移动前必须判空：循环条件要同时检查 fast 与 fast.next，否则会在 null.next 上崩溃。
- 相遇后第二轮的两个指针**同速**前进（都是一步），不要延续一快一慢。
- 为什么 slow 一定在第一圈内被追上：进环后两者相对速度为 1，fast 每轮只逼近一步，不可能跳过 slow，第一圈必然相遇。

### 复杂度分析

- 时间复杂度：O(n)，slow 进环之前 fast 不会套圈太多，整体线性。
- 空间复杂度：O(1)，只使用了常数个指针。`,
    code: `function detectCycle(head: ListNode | null): ListNode | null {
    let slow: ListNode | null = head
    let fast: ListNode | null = head
    while (fast !== null && fast.next !== null) {
        slow = slow!.next
        fast = fast.next.next
        if (slow === fast) {
            // 相遇后：一个指针从 head 出发，一个从相遇点出发，同速前进
            let index1: ListNode | null = head
            let index2: ListNode | null = slow
            while (index1 !== index2) {
                index1 = index1!.next
                index2 = index2!.next
            }
            // 再次相遇的位置即入环点
            return index1
        }
    }
    return null
}`
  }
}

export default solutions
