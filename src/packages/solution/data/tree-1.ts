import type { Solution } from './types'

const solutions: Record<string, Solution> = {
  'lc-binary-tree-preorder-traversal': {
    desc: `给你二叉树的根节点 root，返回其节点值的**前序遍历**。前序遍历按照「中 - 左 - 右」的顺序访问：先访问根节点，再递归访问左子树，最后递归访问右子树。它是二叉树三大遍历中最直观的一种，也是学习二叉树递归与栈模拟的入门题。

**示例 1：**

- 输入：root = [1,null,2,3]
- 输出：[1,2,3]
- 解释：先访问根节点 1；左子树为空；再访问右子树的根 2 及其左孩子 3。

**提示：**

- 树中节点数目在范围 [0, 100] 内
- -100 <= Node.val <= 100
- 进阶：递归算法很简单，你可以通过迭代算法完成吗？`,
    analysis: `### 核心思路

前序遍历的访问顺序是「中 - 左 - 右」：每处理一棵子树，都先记录根节点的值，再处理左子树，最后处理右子树。递归与迭代本质相同：递归隐式使用系统调用栈，迭代则显式维护一个栈，两者都要做到访问顺序与压栈顺序互相配合。

> 递归三要素是所有二叉树递归题的通用框架：确定参数与返回值、确定终止条件、确定单层逻辑。建议在这道题上就把它练成本能。

### 算法步骤（递归三要素）

1. 确定参数和返回值：传入当前节点 node 与结果数组 res，无需返回值。
2. 确定终止条件：node 为空直接 return，空节点不需要任何处理。
3. 确定单层逻辑：先 push 当前值（中），再递归左子树（左），最后递归右子树（右）。

### 迭代写法

用栈模拟递归：弹出栈顶节点并记录其值（中）。由于栈是后进先出，为了让左孩子先被处理，必须**先压右孩子、再压左孩子**，这样下一轮弹出的就是左孩子。

> 入栈顺序与访问顺序正好相反，这是前序迭代最容易写反的地方。

### 易错点

- 空树要返回空数组，先判空再操作。
- 迭代时先压左后压右，输出会变成「中 - 右 - 左」。
- 在递归函数内部重复创建 res 数组，导致结果丢失；res 应在外层创建、内层共享。

### 复杂度分析

- 时间复杂度：O(n)，每个节点恰好被访问一次。
- 空间复杂度：O(n)，最坏情况下树退化成链表，递归栈或显式栈深达 n。`,
    code: `// 写法一：递归（按递归三要素展开）
function preorderTraversal(root: TreeNode | null): number[] {
    const res: number[] = []
    const dfs = (node: TreeNode | null): void => {
        if (node === null) return      // 终止条件：空节点直接返回
        res.push(node.val)             // 中：先记录根节点
        dfs(node.left)                 // 左
        dfs(node.right)                // 右
    }
    dfs(root)
    return res
}

// 写法二：迭代（栈模拟；先压右孩子再压左孩子）
function preorderTraversalIterative(root: TreeNode | null): number[] {
    const res: number[] = []
    if (root === null) return res
    const stack: TreeNode[] = [root]
    while (stack.length > 0) {
        const node = stack.pop()!      // 中：弹出即访问
        res.push(node.val)
        if (node.right !== null) stack.push(node.right) // 先压右
        if (node.left !== null) stack.push(node.left)   // 再压左，保证左先出
    }
    return res
}`
  },
  'lc-binary-tree-postorder-traversal': {
    desc: `给你二叉树的根节点 root，返回其节点值的**后序遍历**。后序遍历按照「左 - 右 - 中」的顺序访问：先递归处理左子树，再处理右子树，最后才处理根节点。这种最后访问根的特性，常被用于自底向上收集信息（如求子树高度、销毁整棵树）。

**示例 1：**

- 输入：root = [1,null,2,3]
- 输出：[3,2,1]
- 解释：先走左子树（为空），再走右子树：2 的左孩子 3 先被访问，随后是 2，最后是根 1。

**提示：**

- 树中节点数目在范围 [0, 100] 内
- -100 <= Node.val <= 100`,
    analysis: `### 核心思路

后序遍历顺序为「左 - 右 - 中」，递归写法依旧套用三要素，只是 push 的位置挪到两次递归之后；难点在迭代写法。直接用单栈模拟「左右中」并不顺手，常用技巧是**顺序转换**：后序 = 「中右左」的逆序，而「中右左」只需在前序迭代代码里交换左右孩子的入栈顺序即可得到，最后把结果整体反转。

> 记不住复杂的单栈写法没关系，「中右左再反转」是面试和刷题中最稳的后序迭代方案。

### 算法步骤（递归三要素）

1. 确定参数和返回值：传入节点 node 与结果数组 res，无返回值。
2. 确定终止条件：node 为空直接 return。
3. 确定单层逻辑：先递归左子树（左），再递归右子树（右），最后 push 当前值（中）。

### 迭代写法

1. 每次弹出栈顶节点，把值放入 res（中）。
2. 先压左孩子、再压右孩子，保证下次先弹出右孩子，得到「中 - 右 - 左」序列。
3. 全部处理完后对 res 调用 reverse，得到「左 - 右 - 中」。

### 易错点

- 反转时机：必须在遍历结束后统一反转；边遍历边用 unshift 插头部，会把复杂度拖成 O(n^2)。
- 迭代时入栈顺序写反，得到「中 - 左 - 右」，反转后并非后序。
- 递归版中 push 的位置放错，与前序、中序混淆。

### 复杂度分析

- 时间复杂度：O(n)，每个节点访问一次，最后反转一次。
- 空间复杂度：O(n)，最坏情况下栈深为 n。`,
    code: `// 写法一：递归
function postorderTraversal(root: TreeNode | null): number[] {
    const res: number[] = []
    const dfs = (node: TreeNode | null): void => {
        if (node === null) return
        dfs(node.left)                 // 左
        dfs(node.right)                // 右
        res.push(node.val)             // 中：最后访问根
    }
    dfs(root)
    return res
}

// 写法二：迭代（中右左 + 整体反转）
function postorderTraversalIterative(root: TreeNode | null): number[] {
    const res: number[] = []
    if (root === null) return res
    const stack: TreeNode[] = [root]
    while (stack.length > 0) {
        const node = stack.pop()!      // 中
        res.push(node.val)
        if (node.left !== null) stack.push(node.left)   // 先压左
        if (node.right !== null) stack.push(node.right) // 再压右，右先出
    }
    res.reverse()                      // 中右左 反转得到 左右中
    return res
}`
  },
  'lc-binary-tree-inorder-traversal': {
    desc: `给你二叉树的根节点 root，返回其节点值的**中序遍历**。中序遍历按照「左 - 中 - 右」的顺序访问：先递归处理左子树，再访问根节点，最后处理右子树。对二叉搜索树做中序遍历可以得到升序序列，这让中序遍历成为 BST 相关题目的高频考点。

**示例 1：**

- 输入：root = [1,null,2,3]
- 输出：[1,3,2]
- 解释：根 1 没有左子树，先访问 1；再处理右子树：先访问 2 的左孩子 3，再访问 2。

**提示：**

- 树中节点数目在范围 [0, 100] 内
- -100 <= Node.val <= 100`,
    analysis: `### 核心思路

中序遍历顺序为「左 - 中 - 右」。递归写法依旧套用三要素，只是 push 的位置夹在两次递归之间。迭代写法与前序明显不同：前序弹栈即可访问，而中序必须先沿着左链一路走到底，把沿途节点先入栈暂存，走不动了才弹栈访问，随后再转向右子树。

> 中序迭代的关键是引入一个当前指针 cur，负责沿左链下探；栈只负责记住回头的路。

### 算法步骤（迭代）

1. cur 不为空时，把 cur 入栈，cur 移向左孩子，重复直到走到最左。
2. cur 为空说明左侧已处理完，弹出栈顶节点访问（左链的最底端）。
3. 访问后 cur 转向该节点的右子树，回到步骤 1。
4. 循环条件是 cur 不为空或栈不为空，两者都为空时遍历结束。

### 易错点

- 循环条件漏掉栈不为空的判断，右子树还没处理就提前退出。
- 弹栈后忘记把 cur 转向右孩子，造成死循环。
- 把中序的 push 写在递归调用之前，实际做成了前序。

### 复杂度分析

- 时间复杂度：O(n)，每个节点最多入栈、出栈各一次。
- 空间复杂度：O(n)，最坏情况下左链长度为 n。`,
    code: `// 写法一：递归
function inorderTraversal(root: TreeNode | null): number[] {
    const res: number[] = []
    const dfs = (node: TreeNode | null): void => {
        if (node === null) return
        dfs(node.left)                 // 左
        res.push(node.val)             // 中：夹在两次递归之间
        dfs(node.right)                // 右
    }
    dfs(root)
    return res
}

// 写法二：迭代（指针沿左链下探 + 栈保存回头路）
function inorderTraversalIterative(root: TreeNode | null): number[] {
    const res: number[] = []
    const stack: TreeNode[] = []
    let cur: TreeNode | null = root
    while (cur !== null || stack.length > 0) {
        while (cur !== null) {         // 一路向左，沿途节点全部入栈
            stack.push(cur)
            cur = cur.left
        }
        cur = stack.pop()!             // 左链走到底，弹出访问
        res.push(cur.val)              // 中
        cur = cur.right                // 转向右子树
    }
    return res
}`
  },
  'lc-binary-tree-level-order-traversal': {
    desc: `给你二叉树的根节点 root，返回其节点值的**层序遍历**结果（即逐层地、从左到右访问所有节点），结果用二维数组表示，第 i 个子数组保存第 i 层的所有节点值。层序遍历是广度优先搜索（BFS）在二叉树上的直接应用，也是十几道层序变体题的公共模板。

**示例 1：**

- 输入：root = [3,9,20,null,null,15,7]
- 输出：[[3],[9,20],[15,7]]
- 解释：第一层只有根 3；第二层是 9 和 20；第三层是 15 和 7。

**提示：**

- 树中节点数目在范围 [0, 2000] 内
- -1000 <= Node.val <= 1000`,
    analysis: `### 核心思路

层序遍历要一层一层地处理节点，天然适合用**队列**（先进先出）实现 BFS：出队一个节点时，把它的左右孩子依次入队，就能保证下一层的节点排在本层所有节点之后。难点在于如何区分层的边界——这里的关键技巧是**每层循环前先取队列长度快照**。

> 固定住本层节点数 size，内层循环只出队 size 次，出队的恰好全是本层节点；期间新入队的孩子自动归入下一层。

### 算法步骤

1. 根节点为空直接返回空结果；否则根节点入队。
2. 外层 while 循环，只要队列非空就继续。
3. 记录当前队列长度 size，创建本层结果数组。
4. 内层循环执行 size 次：出队节点，记录值，左右孩子入队。
5. 本层处理完，把本层数组推入最终答案。

### 易错点

- 直接用 queue.length 作内层循环条件：循环中队列长度不断变化，层与层会混在一起。
- 出队节点后先记录值、再入队孩子；顺序反了会导致孩子挤进本层。
- 空树未判空，访问 null 属性报错。

### 复杂度分析

- 时间复杂度：O(n)，每个节点入队、出队各一次。
- 空间复杂度：O(n)，队列最多存放一整层节点，最坏约 n / 2 个。`,
    code: `function levelOrder(root: TreeNode | null): number[][] {
    const res: number[][] = []
    if (root === null) return res
    const queue: TreeNode[] = [root]
    while (queue.length > 0) {
        const size = queue.length      // 本层节点数快照，必须先取
        const level: number[] = []
        for (let i = 0; i < size; i++) {
            const node = queue.shift()!
            level.push(node.val)
            if (node.left !== null) queue.push(node.left)
            if (node.right !== null) queue.push(node.right)
        }
        res.push(level)
    }
    return res
}`
  },
  'lc-binary-tree-level-order-traversal-ii': {
    desc: `给你二叉树的根节点 root，返回其节点值**自底向上的层序遍历**（即按从叶子节点所在层到根节点所在层、逐层从左到右遍历），结果用二维数组表示。它与 102 题唯一的区别是层的输出顺序反了过来。

**示例 1：**

- 输入：root = [3,9,20,null,null,15,7]
- 输出：[[15,7],[9,20],[3]]
- 解释：先输出最底层的 15 和 7，再输出第二层的 9 和 20，最后输出根 3。

**提示：**

- 树中节点数目在范围 [0, 2000] 内
- -1000 <= Node.val <= 1000`,
    analysis: `### 核心思路

本题是 102 层序遍历的换皮题：遍历过程完全一样，仍然是队列 + 每层 size 快照，唯一的区别是结果要自底向上。与其在遍历时刻意从底层开始（需要额外结构），不如**按正常层序收集，最后把结果整体反转**，一行 reverse 解决。

> 不要急着为「自底向上」发明新算法，先想清楚它和已解决的问题只差一个逆序。

### 算法步骤

1. 按标准层序遍历处理：根入队，每层记录 size，出队 size 次，孩子入队。
2. 每完成一层，把该层数组按正序推入结果。
3. 全部层处理完毕后，对结果数组调用 reverse，顶层变底层、底层变顶层。

### 易错点

- 每层用 unshift 插到结果头部：结果正确，但数组整体搬移，时间复杂度退化为层数乘层大小，不如最后统一 reverse。
- 内层循环条件误写成动态变化的 queue.length，导致层边界错乱。
- 空树未判空。

### 复杂度分析

- 时间复杂度：O(n)，遍历每个节点一次，最后反转一次。
- 空间复杂度：O(n)，队列最多存放一层节点。`,
    code: `function levelOrderBottom(root: TreeNode | null): number[][] {
    const res: number[][] = []
    if (root === null) return res
    const queue: TreeNode[] = [root]
    while (queue.length > 0) {
        const size = queue.length      // 本层节点数快照
        const level: number[] = []
        for (let i = 0; i < size; i++) {
            const node = queue.shift()!
            level.push(node.val)
            if (node.left !== null) queue.push(node.left)
            if (node.right !== null) queue.push(node.right)
        }
        res.push(level)
    }
    res.reverse()                      // 自底向上输出
    return res
}`
  },
  'lc-binary-tree-right-side-view': {
    desc: `给定二叉树的根节点 root，想象自己站在树的右侧，从上到下返回你能看到的所有节点值，即**每一层最右边**的那个节点。注意：右视图并不等于永远沿右孩子走。

**示例 1：**

- 输入：root = [1,2,3,null,5,null,4]
- 输出：[1,3,4]
- 解释：逐层看，最右侧节点依次为 1、3、4；第三层左边的 5 被右边的 4 挡住。

**提示：**

- 二叉树的节点个数的范围是 [0,100]
- -100 <= Node.val <= 100`,
    analysis: `### 核心思路

右视图要求返回每一层最后一个节点的值。直觉上「一直往右孩子走」是错的：如果某节点右子树为空而左子树很深，深层可见节点就藏在左子树里。所以必须**老老实实做层序遍历，取每层的最后一个节点**。

> 层序模板里内层循环拿 i 与 size 比较，当 i 等于 size - 1 时，当前出队节点就是本层最右节点。

### 算法步骤

1. 根节点入队，进入标准层序流程。
2. 每层先记录 size，内层循环出队 size 次。
3. 出队节点时，若 i === size - 1，把该节点值加入结果。
4. 照常把左右孩子入队，直至队列为空。

### 易错点

- 用「递归一直走右子树」的贪心写法，在右子树缺失、左子树更深的用例上会漏掉节点。
- 判断本层最后一个的时机写错，比如在入队之后才比较 i 与 size。
- 空树要返回空数组。

### 复杂度分析

- 时间复杂度：O(n)，每个节点进出队列各一次。
- 空间复杂度：O(n)，队列最多存放一层节点。`,
    code: `function rightSideView(root: TreeNode | null): number[] {
    const res: number[] = []
    if (root === null) return res
    const queue: TreeNode[] = [root]
    while (queue.length > 0) {
        const size = queue.length
        for (let i = 0; i < size; i++) {
            const node = queue.shift()!
            if (i === size - 1) res.push(node.val) // 本层最后一个节点
            if (node.left !== null) queue.push(node.left)
            if (node.right !== null) queue.push(node.right)
        }
    }
    return res
}`
  },
  'lc-average-of-levels-in-binary-tree': {
    desc: `给定一个非空二叉树的根节点 root，以数组形式返回**每一层节点值的平均值**。本题是层序遍历模板在「逐层统计」方向上的典型应用：层结构有了，剩下的只是在本层累加求和再除以节点数。

**示例 1：**

- 输入：root = [3,9,20,null,null,15,7]
- 输出：[3.00000,14.50000,11.00000]
- 解释：第 0 层平均值是 3，第 1 层是 (9 + 20) / 2 = 14.5，第 2 层是 (15 + 7) / 2 = 11。

**提示：**

- 树中节点数量在 [1, 10^4] 范围内
- -2^31 <= Node.val <= 2^31 - 1`,
    analysis: `### 核心思路

层序遍历模板解决的是「怎么分层」，本题只需要在分层的基础上做一次**逐层求和**：每层维护一个 sum 累加本层所有节点值，层处理完毕后用 sum 除以本层节点数即可。所有「每层统计」类题目（平均值、最大值、计数）都共用这一个骨架。

> 看到「每层」字样的题目，先默写层序模板，再思考往模板的哪个位置插入统计逻辑。

### 算法步骤

1. 根节点入队，进入层序循环。
2. 每层记录 size，并把 sum 初始化为 0。
3. 出队 size 个节点，累加 sum，同时把孩子入队。
4. 层结束时，结果数组追加 sum / size。

### 易错点

- 用整数除法求平均：JavaScript 的 number 本身是浮点数，直接相除即可；换成其他语言要留意整型截断。
- 溢出顾虑：本题数据范围下累加和不超过 2 乘 10^13，仍在安全整数范围内，直接累加即可。
- 层结束时忘记除以 size，或除错了分母。

### 复杂度分析

- 时间复杂度：O(n)，每个节点访问一次。
- 空间复杂度：O(n)，队列最多存放一层节点。`,
    code: `function averageOfLevels(root: TreeNode | null): number[] {
    const res: number[] = []
    if (root === null) return res
    const queue: TreeNode[] = [root]
    while (queue.length > 0) {
        const size = queue.length
        let sum = 0
        for (let i = 0; i < size; i++) {
            const node = queue.shift()!
            sum += node.val
            if (node.left !== null) queue.push(node.left)
            if (node.right !== null) queue.push(node.right)
        }
        res.push(sum / size)
    }
    return res
}`
  },
  'lc-n-ary-tree-level-order-traversal': {
    desc: `给定一个 N 叉树的根节点 root，返回其节点值的**层序遍历**（即逐层地、从左到右遍历所有节点），结果用二维数组表示。N 叉树的每个节点可以有任意多个孩子，序列化输入中用 null 分隔相邻节点的孩子列表。

**示例 1：**

- 输入：root = [1,null,3,2,4,null,5,6]
- 输出：[[1],[3,2,4],[5,6]]
- 解释：根 1 有三个孩子 3、2、4；节点 3 有两个孩子 5 和 6。

**提示：**

- 树的高度不会超过 1000
- 树的节点总数在 [0, 10^4] 之间`,
    analysis: `### 核心思路

层序遍历的本质是「按层处理队列中的节点」，与树的形态无关：二叉树入队的是 left、right 两个孩子，N 叉树入队的是 children 数组里的所有孩子。把层序模板中的两次入队判断换成**一次循环遍历 children**，本题就完成了。

> 体会「模板不变，只替换扩展孩子的方式」，这是层序题一族最重要的迁移能力。

### 算法步骤

1. 根节点入队，进入层序循环。
2. 每层记录 size，创建本层数组。
3. 出队 size 个节点：值加入本层数组，然后遍历其 children，把所有孩子依次入队。
4. 层结束时把本层数组推入结果。

### 易错点

- 习惯性写 node.left、node.right 的判断，N 叉树没有这两个属性，应遍历 children。
- 空树（root 为 null）要返回空数组，本题输入可以为空。
- 层边界依旧依赖 size 快照，不能用循环中不断变化的队列长度。

### 复杂度分析

- 时间复杂度：O(n)，n 为节点总数，每个节点进出队列各一次。
- 空间复杂度：O(n)，队列最多存放某一层的全部节点，最坏约 n。`,
    code: `// N 叉树节点定义（LeetCode 判题环境已内置，无需声明）：
// class Node { val: number; children: Node[] }

function levelOrder(root: Node | null): number[][] {
    const res: number[][] = []
    if (root === null) return res
    const queue: Node[] = [root]
    while (queue.length > 0) {
        const size = queue.length
        const level: number[] = []
        for (let i = 0; i < size; i++) {
            const node = queue.shift()!
            level.push(node.val)
            for (const child of node.children) { // 与二叉树的唯一区别
                queue.push(child)
            }
        }
        res.push(level)
    }
    return res
}`
  },
  'lc-find-largest-value-in-each-tree-row': {
    desc: `给定一棵二叉树的根节点 root，返回每个树行中的**最大值**，即每一层所有节点值里的最大者，按层序组成数组返回。本题与求层平均值同族，都是在层序模板中插入一段逐层统计逻辑。

**示例 1：**

- 输入：root = [1,3,2,5,3,null,9]
- 输出：[1,3,9]
- 解释：三层依次是 [1]、[3,2]、[5,3,9]，最大值分别为 1、3、9。

**提示：**

- 二叉树的节点个数的范围是 [0,10^4]
- -2^31 <= Node.val <= 2^31 - 1`,
    analysis: `### 核心思路

又是一道「每层统计」题：层序模板负责分层，本题要统计的是本层最大值。每层开始时初始化 max，出队节点时用 Math.max 更新，层结束时把 max 推入结果。实现上与求层平均值几乎逐行相同，只是把「累加求和」换成「取最大」。

> 唯一值得强调的细节是 max 的初值：节点值可能取到负数，必须用 -Infinity（或本层第一个节点的值）初始化，用 0 会在全负用例上出错。

### 算法步骤

1. 根节点入队，进入层序循环。
2. 每层记录 size，max 初始化为 -Infinity。
3. 出队 size 个节点：用 Math.max 更新 max，孩子入队。
4. 层结束时把 max 追加到结果数组。

### 易错点

- max 初始化为 0：当整棵树的值都是负数时，输出全错。
- 忘记每层重置 max，导致下一层继承了上一层的最大值。
- 空树未判空。

### 复杂度分析

- 时间复杂度：O(n)，每个节点访问一次。
- 空间复杂度：O(n)，队列最多存放一层节点。`,
    code: `function largestValues(root: TreeNode | null): number[] {
    const res: number[] = []
    if (root === null) return res
    const queue: TreeNode[] = [root]
    while (queue.length > 0) {
        const size = queue.length
        let max = -Infinity            // 节点值可能为负，不能用 0 初始化
        for (let i = 0; i < size; i++) {
            const node = queue.shift()!
            max = Math.max(max, node.val)
            if (node.left !== null) queue.push(node.left)
            if (node.right !== null) queue.push(node.right)
        }
        res.push(max)
    }
    return res
}`
  },
  'lc-populating-next-right-pointers-in-each-node': {
    desc: `给定一个**完美二叉树**：所有叶子节点都在同一层，每个父节点都有两个孩子。每个节点额外带一个 next 指针（初始为 null），要求把每个节点的 next 填充为同层右侧相邻节点；本层最右节点没有右侧节点，next 保持 null。序列化输出中用 # 标记每层末尾。

**示例 1：**

- 输入：root = [1,2,3,4,5,6,7]
- 输出：[1,#,2,3,#,4,5,6,7,#]
- 解释：每个节点的 next 都指向同层右侧相邻节点，每层最后一个节点的 next 为 null，# 即层的结束标记。

**提示：**

- 树中节点的数量在 [0, 2^12 - 1] 范围内
- -1000 <= node.val <= 1000`,
    analysis: `### 核心思路

把 next 看作「同层链表」的 next 指针，问题就变成：**在层序遍历的同时，把同一层的节点串成一条链**。利用队列有个巧妙写法：出队当前节点后，只要它不是本层最后一个（i < size - 1），队首此刻恰好就是它的同层右邻，直接令 node.next 指向 queue[0] 即可。

> 出队后先别急着处理孩子，此刻队首还是「自己人」；孩子入队后队首才可能变成下一层节点——顺序不能乱。

### 算法步骤

1. 根节点入队，进入层序循环。
2. 每层记录 size，内层循环出队 size 次。
3. 若 i < size - 1，令当前节点的 next 指向 queue[0]（本层右邻）；本层最后一个节点不设置，保持 null。
4. 将左右孩子入队，进入下一层。

### 易错点

- 设置 next 与孩子入队的顺序写反：孩子先入队会让 queue[0] 变成下一层节点，next 就连错了。
- 把本层最后一个节点误连到下一层第一个节点。
- 空树直接返回 null，注意判空。

### 复杂度分析

- 时间复杂度：O(n)，每个节点进出队列各一次。
- 空间复杂度：O(n)，队列最多存最后一层的约 n / 2 个节点；进阶的 O(1) 空间做法可利用已建立的 next 指针逐层串接。`,
    code: `// 节点定义（LeetCode 已内置，无需声明）：
// class Node {
//     val: number
//     left: Node | null
//     right: Node | null
//     next: Node | null
// }

function connect(root: Node | null): Node | null {
    if (root === null) return null
    const queue: Node[] = [root]
    while (queue.length > 0) {
        const size = queue.length
        for (let i = 0; i < size; i++) {
            const node = queue.shift()!
            if (i < size - 1) {
                node.next = queue[0]   // 出队后队首正是本层右邻
            }
            if (node.left !== null) queue.push(node.left)
            if (node.right !== null) queue.push(node.right)
        }
    }
    return root
}`
  },
  'lc-populating-next-right-pointers-in-each-node-ii': {
    desc: `与 116 题不同，这次给的是**普通二叉树**：不保证每个父节点都有两个孩子，叶子也不一定在同一层。任务相同——把每个节点的 next 指针填充为同层右侧相邻节点，没有则保持 null。

**示例 1：**

- 输入：root = [1,2,3,4,5,null,7]
- 输出：[1,#,2,3,#,4,5,7,#]
- 解释：第三层从左到右是 4、5、7，因此 4 的 next 指向 5，5 的 next 指向 7，7 没有右侧节点。

**提示：**

- 树中的节点数小于 6000
- -100 <= node.val <= 100`,
    analysis: `### 核心思路

116 题的层序解法完全不依赖「完美二叉树」这个条件——队列天然按从左到右的顺序排布节点，出队时队首就是本层右邻。所以本题可以直接复用同一套代码。与 116 不同的是，利用 next 指针做 O(1) 空间的逐层递推在普通二叉树上会复杂很多：需要在层内跳跃寻找下一个非空孩子，通常要借助哑节点（dummy）标记下一层的起点。

> 先掌握普适的层序解法；O(1) 空间写法记住「哑节点」这个技巧即可，面试追问时能讲清思路就是加分项。

### 算法步骤

1. 根节点入队，进入层序循环。
2. 每层记录 size，内层循环出队 size 次。
3. 若 i < size - 1，令当前节点的 next 指向 queue[0]。
4. 将非空的左右孩子入队，进入下一层。

### 易错点

- 普通二叉树的 left、right 都可能为 null，入队前必须判空。
- 照搬 116 的递归写法而没有处理孩子缺失的情况，导致指针悬空或漏连。
- 空树返回 null。

### 复杂度分析

- 时间复杂度：O(n)，每个节点进出队列各一次。
- 空间复杂度：O(n)，队列最多存放一层节点。`,
    code: `function connect(root: Node | null): Node | null {
    if (root === null) return null
    const queue: Node[] = [root]
    while (queue.length > 0) {
        const size = queue.length
        for (let i = 0; i < size; i++) {
            const node = queue.shift()!
            if (i < size - 1) {
                node.next = queue[0]   // 出队后队首正是本层右邻
            }
            if (node.left !== null) queue.push(node.left)
            if (node.right !== null) queue.push(node.right)
        }
    }
    return root
}`
  },
  'lc-maximum-depth-of-binary-tree': {
    desc: `给定一个二叉树 root，找出其**最大深度**：从根节点到最远叶子节点的最长路径上的节点数。叶子节点是没有孩子的节点。树的最大深度是许多子问题（判断平衡、求最小深度、求直径等）的基石。

**示例 1：**

- 输入：root = [3,9,20,null,null,15,7]
- 输出：3
- 解释：路径 3 -> 20 -> 15（或 3 -> 20 -> 7）经过 3 个节点，为最长路径。

**提示：**

- 树中节点的数量在 [0, 10^4] 区间内
- -100 <= Node.val <= 100`,
    analysis: `### 核心思路

求深度有两种视角：**前序**向下带信息走（每深入一层深度加一，回溯时取最大），或者**后序**向上收结果（子树深度汇总给父节点）。推荐后序写法：一棵树的最大深度 = 较深的那棵子树的深度 + 1，把大问题拆成两个结构相同的小问题，代码极简。

> 求深度用前序、求高度用后序——而根节点的高度恰等于树的最大深度，所以本题用后序求高度即可。

### 算法步骤（递归三要素）

1. 确定参数和返回值：传入节点，返回以它为根的子树的最大深度。
2. 确定终止条件：节点为空，深度为 0。
3. 确定单层逻辑：分别求出左右子树深度，取较大者加 1 返回。

### 迭代写法

层序遍历数层数：每完整处理一层，深度加一，遍历结束时的层数就是最大深度。适合不想写递归、或需要按层附带处理其他信息的场景。

### 易错点

- 返回 Math.max(left, right) 时忘记加 1，或对空节点返回了 1。
- 根节点为空的边界要返回 0。
- 误以为求的是边的数量：本题深度按节点数计。

### 复杂度分析

- 时间复杂度：O(n)，每个节点访问一次。
- 空间复杂度：O(h)，h 为树高即递归栈深，最坏 O(n)。`,
    code: `// 写法一：递归（后序求高度，根的高度即最大深度）
function maxDepth(root: TreeNode | null): number {
    if (root === null) return 0
    const leftDepth = maxDepth(root.left)          // 左
    const rightDepth = maxDepth(root.right)        // 右
    return Math.max(leftDepth, rightDepth) + 1     // 中：取较大者加一
}

// 写法二：层序遍历，统计层数
function maxDepthLevelOrder(root: TreeNode | null): number {
    if (root === null) return 0
    let depth = 0
    const queue: TreeNode[] = [root]
    while (queue.length > 0) {
        depth++
        const size = queue.length
        for (let i = 0; i < size; i++) {
            const node = queue.shift()!
            if (node.left !== null) queue.push(node.left)
            if (node.right !== null) queue.push(node.right)
        }
    }
    return depth
}`
  },
  'lc-minimum-depth-of-binary-tree': {
    desc: `给定一个二叉树，找出其**最小深度**：从根节点到最近叶子节点的最短路径上的节点数。注意，**叶子节点是指没有左右孩子的节点**——只有一个孩子的节点不算叶子，路径必须继续往下走。这个定义正是本题最大的陷阱。

**示例 1：**

- 输入：root = [3,9,20,null,null,15,7]
- 输出：2
- 解释：根 3 的左孩子 9 是叶子节点，最短路径为 3 -> 9，深度为 2。

**提示：**

- 树中节点数的范围在 [0, 10^5] 内
- -1000 <= Node.val <= 1000`,
    analysis: `### 核心思路

本题看着像 104 的镜像，把 Math.max 换成 Math.min 是**错的**。例如根节点只有右子树且很深、左子树为空：直接取 min(0, 右深度) 会误认为深度是 1，但根不是叶子，路径必须延伸到真正的叶子。所以递归时要对「单侧子树为空」特判：哪边为空，就沿另一边继续算。

> 叶子节点的定义是「左右孩子都为空」，最小深度只能终止在叶子上，这是与最大深度最大的区别。

### 算法步骤（递归）

1. 节点为空，返回 0。
2. 节点左右孩子都为空，它是叶子，返回 1。
3. 只有一侧孩子为空：返回非空一侧的最小深度加 1，绝不能取 min 撞上 0。
4. 两侧都非空：返回 Math.min(左深度, 右深度) 加 1。

### 迭代写法

层序遍历遇到**第一个叶子节点**立即返回当前层数，对链状歪树效率极高，而且天然避开了上述陷阱。

### 易错点

- 直接把 104 的代码里 max 改成 min，单孩子用例必错。
- 混淆「空节点」与「叶子节点」，把空孩子当成路径终点。
- 链状歪树上递归栈很深，层序写法更稳。

### 复杂度分析

- 时间复杂度：O(n)，每个节点访问一次。
- 空间复杂度：递归为 O(h)；层序为 O(n)。`,
    code: `// 写法一：递归（注意单侧子树为空的特判）
function minDepth(root: TreeNode | null): number {
    if (root === null) return 0
    if (root.left === null && root.right === null) return 1 // 叶子节点
    if (root.left === null) return minDepth(root.right) + 1 // 只能沿非空一侧走
    if (root.right === null) return minDepth(root.left) + 1
    return Math.min(minDepth(root.left), minDepth(root.right)) + 1
}

// 写法二：层序遍历，遇到第一个叶子节点立即返回
function minDepthLevelOrder(root: TreeNode | null): number {
    if (root === null) return 0
    const queue: TreeNode[] = [root]
    let depth = 1
    while (queue.length > 0) {
        const size = queue.length
        for (let i = 0; i < size; i++) {
            const node = queue.shift()!
            if (node.left === null && node.right === null) {
                return depth           // 第一个叶子即最小深度
            }
            if (node.left !== null) queue.push(node.left)
            if (node.right !== null) queue.push(node.right)
        }
        depth++
    }
    return depth
}`
  },
  'lc-invert-binary-tree': {
    desc: `给你一棵二叉树的根节点 root，**翻转**这棵二叉树，并返回其根节点。翻转即把每个节点的左子树和右子树整体交换。这道题有一段著名往事：Homebrew 作者 Max Howell 面试谷歌时，因在白板上没写出它而被拒。

**示例 1：**

- 输入：root = [4,2,7,1,3,6,9]
- 输出：[4,7,2,9,6,3,1]
- 解释：每个节点的左右子树都被交换，例如 2 和 7 互换，9 和 1 互换。

**提示：**

- 树中节点数目范围在 [0, 100] 内
- -100 <= Node.val <= 100`,
    analysis: `### 核心思路

翻转的直觉是**遍历每个节点，把它的左右孩子交换**。用哪种遍历都行，但要小心：中序遍历会把部分节点交换两次（交换孩子后，原本的左孩子变成右孩子又被访问到），容易写出错误结果；前序和后序都安全。代码随想录习惯用前序（中左右）讲解，把交换动作放在「中」的位置。

> 这道题考的不是难度而是熟练度：三行交换加两次递归，五分钟内写对才算过关。

### 算法步骤（前序递归）

1. 确定参数和返回值：传入节点，返回翻转后的子树根，方便父节点接住。
2. 确定终止条件：节点为空返回 null。
3. 确定单层逻辑：交换当前节点的左右孩子，再分别递归翻转左右子树，返回当前节点。

### 易错点

- 用中序遍历，某些节点被翻转两次，结果错误。
- 交换时丢失引用：先递归再交换，或临时变量用错，翻错对象。
- 空树返回 null 即可，不要访问空节点的属性。

### 复杂度分析

- 时间复杂度：O(n)，每个节点处理一次。
- 空间复杂度：O(h)，递归栈深，最坏 O(n)。`,
    code: `function invertTree(root: TreeNode | null): TreeNode | null {
    if (root === null) return null
    // 前序位置：先交换当前节点的左右孩子
    const tmp: TreeNode | null = root.left
    root.left = root.right
    root.right = tmp
    invertTree(root.left)      // 递归翻转左子树
    invertTree(root.right)     // 递归翻转右子树
    return root
}`
  },
  'lc-symmetric-tree': {
    desc: `给你一个二叉树的根节点 root，检查它是否**轴对称**：即这棵树沿中轴线左右折叠后能否完全重合。注意比较的对象不是左右子树本身，而是「左子树」与「右子树」是否互为镜像。

**示例 1：**

- 输入：root = [1,2,2,3,4,4,3]
- 输出：true
- 解释：节点 1 的左右子树互为镜像：外侧的 3 与 3 对应，内侧的 4 与 4 对应。

**示例 2：**

- 输入：root = [1,2,2,null,3,null,3]
- 输出：false
- 解释：左子树的 3 是右孩子，右子树的 3 是左孩子，内侧对应关系被破坏。

**提示：**

- 树中节点数目在范围 [1, 1000] 内
- -100 <= Node.val <= 100`,
    analysis: `### 核心思路

对称不是「左子树等于右子树」，而是**互为镜像**：左子树的外侧要对应右子树的外侧，左子树的内侧要对应右子树的内侧。因此递归函数要同时接收两个节点——left 和 right，比较它们的值，并递归比较（left.left 与 right.right）和（left.right 与 right.left）这两组镜像位置。

> 本题只能算后序：必须先拿到两个孩子的分支是否对称（孩子返回的信息），才能决定当前这对节点是否对称——自底向上收集信息正是后序的舞台。

### 算法步骤（递归）

1. 确定参数和返回值：传入镜像位置上的两个节点，返回这一对是否对称。
2. 确定终止条件：都为空返回 true；一空一非空返回 false；值不等返回 false。
3. 确定单层逻辑：递归比较外侧对与内侧对，两者都对称本对才对称。

### 易错点

- 只比较根节点左右孩子的值，漏掉整棵子树的镜像比较。
- 外侧、内侧配对写反，如 left.left 去对应 right.left。
- 终止条件漏掉「一空一非空」分支，导致访问空指针。

### 复杂度分析

- 时间复杂度：O(n)，每个节点最多被比较一次。
- 空间复杂度：O(h)，递归栈深，最坏 O(n)。`,
    code: `function isSymmetric(root: TreeNode | null): boolean {
    if (root === null) return true
    const compare = (left: TreeNode | null, right: TreeNode | null): boolean => {
        if (left === null && right === null) return true  // 都为空，对称
        if (left === null || right === null) return false // 一空一非空
        if (left.val !== right.val) return false          // 值不同
        const outside = compare(left.left, right.right)   // 外侧：左的左 对 右的右
        const inside = compare(left.right, right.left)    // 内侧：左的右 对 右的左
        return outside && inside
    }
    return compare(root.left, root.right)
}`
  },
  'lc-count-complete-tree-nodes': {
    desc: `给你一棵**完全二叉树**的根节点 root，求出该树的节点个数。完全二叉树中，除最底层外每层都填满，且最底层节点都集中在左侧。普通遍历是 O(n)，进阶要求设计复杂度**低于 O(n)** 的算法——这正是要利用完全二叉树性质的原因。

**示例 1：**

- 输入：root = [1,2,3,4,5,6]
- 输出：6

**提示：**

- 树中节点的数目范围是 [0, 5 * 10^4]
- 题目数据保证输入是一个完全二叉树`,
    analysis: `### 核心思路

普通前中后序遍历对任何树都是 O(n)，没有利用题目给的「完全二叉树」这个额外信息。关键性质是：**对任意节点，若从它出发的最左链深度等于最右链深度，则以它为根的子树是一棵满二叉树**，节点数直接用公式 2^h - 1 算出，不必再遍历。不满足时才递归处理两棵子树。由于完全二叉树每层只会缺一侧，递归深度与链深度统计都是对数级别。

> 用公式一次吃掉整棵满子树，是复杂度从 O(n) 降到 O(log n * log n) 的全部来源。

### 算法步骤

1. 从当前节点分别沿 left、right 指针下探，统计最左深度与最右深度。
2. 两者相等：该子树为满二叉树，直接返回 2^h - 1。
3. 否则返回 1 + 左子树节点数 + 右子树节点数，继续递归。

### 易错点

- 求链深度的计数起点要一致（从孩子开始累计），两边的统计方式必须相同。
- 用 Math.pow 得到的是浮点数，本题数据范围内无精度问题；也可以用位运算 1 左移 h 位。
- 「最左最右深度相等即为满」只对完全二叉树成立，不要推广到普通二叉树。

### 复杂度分析

- 时间复杂度：O(log n * log n)，每次递归做 O(log n) 的链深度统计，递归深度为 O(log n)。
- 空间复杂度：O(log n)，递归栈深。`,
    code: `function countNodes(root: TreeNode | null): number {
    if (root === null) return 0
    let leftDepth = 0
    let rightDepth = 0
    let cur: TreeNode | null = root.left
    while (cur !== null) {             // 统计最左链深度
        leftDepth++
        cur = cur.left
    }
    cur = root.right
    while (cur !== null) {             // 统计最右链深度
        rightDepth++
        cur = cur.right
    }
    if (leftDepth === rightDepth) {
        return Math.pow(2, leftDepth) - 1 // 满二叉树：直接用公式
    }
    return 1 + countNodes(root.left) + countNodes(root.right)
}`
  },
  'lc-balanced-binary-tree': {
    desc: `给定一个二叉树，判断它是否是**高度平衡**的二叉树：树上任意节点的左右子树高度差的绝对值不超过 1。注意这是对「每一个节点」的要求，而不是只看根节点。

**示例 1：**

- 输入：root = [3,9,20,null,null,15,7]
- 输出：true
- 解释：每个节点的左右子树高度差都不超过 1。

**示例 2：**

- 输入：root = [1,2,2,3,3,null,null,4,4]
- 输出：false
- 解释：根节点 1 的左右子树高度分别为 3 和 1，差值超过 1。

**提示：**

- 树中的节点数范围 [0, 5000]
- -10^4 <= Node.val <= 10^4`,
    analysis: `### 核心思路

判断平衡需要每个节点的左右子树高度。若用前序自顶向下：对每个节点求左右高度再检查，而求高度本身要 O(n)，整体退化到 O(n^2)。正确姿势是**后序自底向上求高度**：先把左右子树高度算出来（孩子信息汇总给父节点），再在当前节点判断差值。为了让「发现失衡」能一路向上传播，让函数在失衡时返回特殊值 -1 代替真实高度。

> 返回值身兼二职：正常时返回高度，-1 表示已失衡。这是把判断结果编码进高度计算的经典手法。

### 算法步骤

1. 空节点高度为 0。
2. 后序先求左子树高度，若为 -1 直接向上返回 -1，提前剪枝。
3. 同样处理右子树。
4. 左右高度差大于 1 返回 -1；否则返回较大高度加 1。
5. 主函数判断根的高度是否为 -1。

### 易错点

- 前序写法对每个节点重复求高度，大用例会超时。
- 发现某侧为 -1 后仍继续计算右子树，剪枝失效。
- 混淆高度（到最远叶子）与深度（到根）的定义。

### 复杂度分析

- 时间复杂度：O(n)，每个节点只被计算一次高度。
- 空间复杂度：O(h)，递归栈深，最坏 O(n)。`,
    code: `function isBalanced(root: TreeNode | null): boolean {
    const height = (node: TreeNode | null): number => {
        if (node === null) return 0
        const lh = height(node.left)            // 左：先算左子树高度
        if (lh === -1) return -1                // 左子树已失衡，直接传播
        const rh = height(node.right)           // 右
        if (rh === -1) return -1
        if (Math.abs(lh - rh) > 1) return -1    // 中：高度差超过 1，标记失衡
        return Math.max(lh, rh) + 1
    }
    return height(root) !== -1
}`
  },
  'lc-binary-tree-paths': {
    desc: `给你一个二叉树的根节点 root，按**任意顺序**返回所有从根节点到叶子节点的路径，路径用字符串表示，节点值之间以 -> 连接。叶子节点是没有孩子的节点。本题是「前序遍历 + 回溯」的入门范例。

**示例 1：**

- 输入：root = [1,2,3,null,5]
- 输出：["1->2->5","1->3"]
- 解释：两条路径分别经过 1、2、5 与 1、3。

**提示：**

- 树中的节点数在范围 [1, 100] 内
- -100 <= Node.val <= 100`,
    analysis: `### 核心思路

路径需要记录「从根一路走来的所有节点」，因此必须用**前序遍历**：进入节点时先把它的值记入 path，保证父节点一定排在孩子前面。递归到叶子节点时把 path 拼成字符串存入结果。关键在于**回溯**：当前节点处理完左右子树后，要把它从 path 中弹出，否则兄弟分支会带着别人的路径继续走。

> 递归和回溯一一对应：递归深入前做了什么，递归返回后就要撤销什么。这个意识在所有回溯题里通用。

### 算法步骤

1. 确定参数：当前节点、path 数组（引用共享）、结果数组。
2. 节点为空直接返回。
3. 把节点值加入 path；若是叶子节点，把 path 拼接为字符串写入结果。
4. 递归左子树、右子树。
5. 回溯：从 path 弹出当前节点的值。

### 易错点

- 忘记回溯，path 被所有分支共享，输出串味。
- 叶子判断的时机放错，导致路径重复或遗漏。
- 拼接 -> 的位置写错，比如叶子节点后面多出一个箭头。

### 复杂度分析

- 时间复杂度：O(n * h)，每个节点访问一次，每条到叶子的路径拼接需要 O(h)。
- 空间复杂度：O(h)，path 与递归栈的深度。`,
    code: `function binaryTreePaths(root: TreeNode | null): string[] {
    const res: string[] = []
    const path: number[] = []
    const dfs = (node: TreeNode | null): void => {
        if (node === null) return
        path.push(node.val)                       // 中：先加入路径
        if (node.left === null && node.right === null) {
            res.push(path.join('->'))             // 叶子节点：拼接完整路径
        }
        dfs(node.left)                            // 左
        dfs(node.right)                           // 右
        path.pop()                                // 回溯：撤销当前节点
    }
    dfs(root)
    return res
}`
  }
}

export default solutions
