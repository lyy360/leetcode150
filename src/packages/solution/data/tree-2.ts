import type { Solution } from './types'

const solutions: Record<string, Solution> = {
  'lc-sum-of-left-leaves': {
    desc: `给定一棵二叉树的根节点 root，计算所有「左叶子」的节点值之和。左叶子指的是既是叶子节点（没有左右孩子），又是其父节点左孩子的节点。

**示例 1：**

- 输入：root = [3,9,20,null,null,15,7]
- 输出：24
- 解释：9 是根的左孩子且为叶子，15 是节点 20 的左孩子且为叶子，二者之和为 24。

**提示：**

- 树中节点数目在范围 [1, 1000] 内
- -1000 <= Node.val <= 1000`,
    analysis: `### 核心思路

左叶子必须同时满足两个条件：它是**叶子节点**（左右孩子都为空），并且它是父节点的**左孩子**。这意味着单看某个节点自己无法判断它是不是左叶子，必须站在父节点的视角判断——如果当前节点的左孩子存在，且左孩子没有左右子树，这个左孩子的值才是要累加的对象。

采用后序遍历：先收集左子树的左叶子之和，再收集右子树的左叶子之和，最后补上当前节点能确定的左叶子值，三部分相加即为整棵树的答案。

### 算法步骤

1. 递归遍历，空节点返回 0。
2. 分别递归求出左子树、右子树的左叶子之和 leftSum 与 rightSum。
3. 检查当前节点的左孩子：若存在且是叶子节点，把它的值记入 midVal。
4. 返回 leftSum + rightSum + midVal。

### 易错点

- 只判断「是叶子」不判断「是左孩子」，会把右叶子也误算进去；只判断「是左孩子」不判断「是叶子」，会把整棵左子树都算进去。
- 判断的主体是**当前节点的左孩子**，不是当前节点自己。
- 空树直接返回 0，递归终止条件不能省。

### 复杂度分析

- 时间复杂度：O(n)，每个节点访问一次。
- 空间复杂度：O(h)，h 为树高，来自递归栈，最坏情况下为 O(n)。`,
    code: `function sumOfLeftLeaves(root: TreeNode | null): number {
    if (root === null) return 0
    // 后序遍历：先收集左右子树中的左叶子之和
    const leftSum = sumOfLeftLeaves(root.left)
    const rightSum = sumOfLeftLeaves(root.right)
    // 站在父节点视角：左孩子存在且是叶子，才是左叶子
    let midVal = 0
    if (root.left !== null && root.left.left === null && root.left.right === null) {
        midVal = root.left.val
    }
    return leftSum + rightSum + midVal
}`
  },
  'lc-find-bottom-left-tree-value': {
    desc: `给定一棵二叉树的根节点 root，返回树中「最底层最左边」节点的值，即深度最大的那一层中最左侧的节点值。

**示例 1：**

- 输入：root = [2,1,3]
- 输出：1
- 解释：最底层是第 2 层，包含节点 1 和 3，最左边的值是 1。

**提示：**

- 树中节点数目在范围 [1, 10^4] 内
- -2^31 <= Node.val <= 2^31 - 1`,
    analysis: `### 核心思路

「最底层最左边」可以拆成两个条件：深度最大、同层中最靠左。最直观的做法是**层序遍历（BFS）**：按层处理队列，每层开始时队首元素就是该层最左节点，把它记录下来，遍历结束后最后一次记录的就是最底层的最左值。

也可以用递归求深度：维护历史最大深度 maxDepth 和对应答案，**优先遍历左子树**，只有遇到「严格更深」的层时才更新答案，这样天然保证同一深度先访问到的是最左节点。

### 算法步骤

1. 根节点入队，答案初始化为根节点值。
2. 每轮循环先取当前队列长度 size，并把队首节点的值记录到答案中。
3. 依次弹出 size 个节点，把各自非空的左右孩子入队。
4. 队列为空时结束，答案即最底层最左值。

### 易错点

- 递归写法更新答案的条件必须是 depth **严格大于** maxDepth，写成大于等于会让答案偏向同层右侧节点。
- 递归必须先左后右，顺序反了同一深度的最左节点会被右侧覆盖。
- 题目保证至少一个节点，但代码仍应处理空树，避免取值时报空指针。

### 复杂度分析

- 时间复杂度：O(n)，每个节点入队、出队各一次。
- 空间复杂度：O(n)，队列最多存储一整层节点；递归写法为 O(h)。`,
    code: `function findBottomLeftValue(root: TreeNode | null): number {
    if (root === null) return 0
    let ans = root.val
    const queue: TreeNode[] = [root]
    while (queue.length > 0) {
        const size = queue.length
        // 队首元素即本层最左节点
        ans = queue[0].val
        for (let i = 0; i < size; i++) {
            const node = queue.shift() as TreeNode
            if (node.left !== null) queue.push(node.left)
            if (node.right !== null) queue.push(node.right)
        }
    }
    return ans
}`
  },
  'lc-path-sum': {
    desc: `给定二叉树的根节点 root 和一个表示目标和的整数 targetSum，判断该树中是否存在从根节点到叶子节点的路径，这条路径上所有节点值相加等于目标和 targetSum。叶子节点是指没有子节点的节点。

**示例 1：**

- 输入：root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
- 输出：true
- 解释：路径 5 → 4 → 11 → 2 的节点值之和等于 22。

**提示：**

- 树中节点数目在范围 [0, 5000] 内
- -1000 <= Node.val <= 1000
- -1000 <= targetSum <= 1000`,
    analysis: `### 核心思路

从根节点出发向下递归，用一个巧妙技巧：每经过一个节点，就把 targetSum 减去该节点的值，相当于**目标值不断被扣除**。这样走到叶子节点时，只需判断剩余的 targetSum 是否恰好为 0，为 0 说明这条根到叶子的路径和等于目标值。整个过程不需要显式维护路径上的节点集合，也无需回溯，逻辑非常简洁。

> 关键约束是「路径必须从根到叶子」：判断只能发生在叶子节点上，中途某段路径和恰好等于目标值并不能返回 true。

### 算法步骤

1. 当前节点为空，返回 false。
2. targetSum 减去当前节点值。
3. 若当前节点是叶子（左右孩子都为空），返回 targetSum 是否等于 0。
4. 否则递归左子树和右子树，任一侧返回 true 即表示存在满足条件的路径。

### 易错点

- 「到叶子才算数」：非叶子节点上即使已经凑齐也不能提前返回 true。
- 空树没有任何路径，应返回 false 而不是 true。
- 递归传下去的是**减完之后的 targetSum**，注意不要在叶子处重复减当前节点值。

### 复杂度分析

- 时间复杂度：O(n)，最坏遍历所有节点。
- 空间复杂度：O(h)，递归栈深度为树高，最坏 O(n)。`,
    code: `function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
    if (root === null) return false
    // 目标值不断扣除当前节点值
    targetSum -= root.val
    // 必须走到叶子节点才能下结论
    if (root.left === null && root.right === null) {
        return targetSum === 0
    }
    return hasPathSum(root.left, targetSum) || hasPathSum(root.right, targetSum)
}`
  },
  'lc-construct-binary-tree-from-preorder-and-inorder-traversal': {
    desc: `给定两个整数数组 preorder 和 inorder，分别代表同一棵二叉树的前序遍历和中序遍历序列，请根据它们构造出这棵二叉树并返回其根节点。题目保证节点值无重复，且构造结果是唯一的。

**示例 1：**

- 输入：preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
- 输出：[3,9,20,null,null,15,7]
- 解释：前序首元素 3 是根；中序中 3 左侧的 9 属于左子树，右侧的 15、20、7 属于右子树。

**提示：**

- 1 <= preorder.length <= 3000
- inorder.length === preorder.length
- -3000 <= preorder[i], inorder[i] <= 3000
- preorder 和 inorder 均无重复元素`,
    analysis: `### 核心思路

前序遍历的顺序是「根 → 左 → 右」，因此 preorder 的第一个元素一定是当前树的**根**；中序遍历是「左 → 根 → 右」，用根值在中序中定位分割点，分割点左侧是左子树的所有节点，右侧是右子树的所有节点。对左右区间递归执行同样的划分，就能唯一重建整棵树。

为了快速完成「根值 → 中序下标」的查找，先用哈希表记录 inorder 中每个值的位置，把每次查找从 O(n) 降到 O(1)。

### 算法步骤

1. 用 Map 记录 inorder 中值到下标的映射。
2. 递归函数维护前序、中序各一对左右闭区间的边界。
3. 区间为空时返回 null；否则取前序区间的首个元素建根。
4. 查表得到根在中序中的位置 idx，左子树长度 len = idx - inLeft。
5. 递归构造左子树（前序 [preLeft + 1, preLeft + len]、中序 [inLeft, idx - 1]）与右子树（前序 [preLeft + len + 1, preRight]、中序 [idx + 1, inRight]）。

### 易错点

- 区间边界必须与「左子树长度 = 中序分割点左侧元素个数」严格对应，写错一位就会构错树或数组越界。
- 全程统一使用一种区间约定（推荐左闭右闭），前后不一致是此类题最常见的事故来源。
- 哈希表定位根依赖于「节点值无重复」这一前提，有重复值时此法失效。

### 复杂度分析

- 时间复杂度：O(n)，每个节点建一次，哈希查找 O(1)。
- 空间复杂度：O(n)，哈希表加递归栈。`,
    code: `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    // 中序值 -> 下标，加速定位根节点
    const indexMap = new Map<number, number>()
    inorder.forEach((v, i) => indexMap.set(v, i))

    function build(preLeft: number, preRight: number, inLeft: number, inRight: number): TreeNode | null {
        if (preLeft > preRight) return null
        // 前序区间第一个元素即根
        const rootVal = preorder[preLeft]
        const root = new TreeNode(rootVal)
        const idx = indexMap.get(rootVal) as number
        const leftLen = idx - inLeft
        root.left = build(preLeft + 1, preLeft + leftLen, inLeft, idx - 1)
        root.right = build(preLeft + leftLen + 1, preRight, idx + 1, inRight)
        return root
    }

    return build(0, preorder.length - 1, 0, inorder.length - 1)
}`
  },
  'lc-construct-binary-tree-from-inorder-and-postorder-traversal': {
    desc: `给定两个整数数组 inorder 和 postorder，分别代表同一棵二叉树的中序遍历和后序遍历序列，请根据它们构造出这棵二叉树并返回其根节点。题目保证节点值无重复，构造结果唯一。

**示例 1：**

- 输入：inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
- 输出：[3,9,20,null,null,15,7]
- 解释：后序末尾的 3 是根；中序中 3 左侧的 9 属于左子树，右侧的 15、20、7 属于右子树。

**提示：**

- 1 <= postorder.length <= 3000
- inorder.length === postorder.length
- -3000 <= postorder[i], inorder[i] <= 3000
- inorder 和 postorder 均无重复元素`,
    analysis: `### 核心思路

后序遍历是「左 → 右 → 根」，**最后一个元素是根**；中序遍历中根把序列切成左右两半。本题与「前序 + 中序构造二叉树」完全同构，只是根的位置从序列头部换到了尾部。用哈希表在中序中定位根的下标，再按左子树长度换算出后序中左右子树的区间，递归构造即可。

> 换算关系是核心：左子树长度 len = 中序中根左侧元素个数。后序区间里，左子树是 [postLeft, postLeft + len - 1]，右子树是 [postLeft + len, postRight - 1]，结尾要排除根本身。

### 算法步骤

1. 建 inorder 值到下标的 Map。
2. 递归函数维护中序、后序各一对闭区间的边界，区间为空返回 null。
3. 取后序区间最后一个元素建根，查表得到中序分割点 idx。
4. 计算左子树长度 len = idx - inLeft。
5. 先构造左子树，再构造右子树，把结果挂到根的左右孩子上。

### 易错点

- 根在后序区间的**末尾**，右子树区间的右边界是 postRight - 1，忘记排除根是高频错误。
- 若改用「从尾部向前消耗后序」的下标写法，必须先递归右子树再递归左子树，因为倒着读后序是「根 → 右 → 左」。
- 区间闭开约定要全程一致，建议统一为左闭右闭。

### 复杂度分析

- 时间复杂度：O(n)，每个节点建一次，哈希查找 O(1)。
- 空间复杂度：O(n)，哈希表加递归栈。`,
    code: `function buildTree(inorder: number[], postorder: number[]): TreeNode | null {
    // 中序值 -> 下标，加速定位根节点
    const indexMap = new Map<number, number>()
    inorder.forEach((v, i) => indexMap.set(v, i))

    function build(inLeft: number, inRight: number, postLeft: number, postRight: number): TreeNode | null {
        if (inLeft > inRight) return null
        // 后序区间最后一个元素即根
        const rootVal = postorder[postRight]
        const root = new TreeNode(rootVal)
        const idx = indexMap.get(rootVal) as number
        const leftLen = idx - inLeft
        root.left = build(inLeft, idx - 1, postLeft, postLeft + leftLen - 1)
        root.right = build(idx + 1, inRight, postLeft + leftLen, postRight - 1)
        return root
    }

    return build(0, inorder.length - 1, 0, postorder.length - 1)
}`
  },
  'lc-maximum-binary-tree': {
    desc: `给定一个不含重复元素的整数数组 nums，按以下规则递归构造「最大二叉树」：创建根节点，值为当前数组中的最大值；用最大值左边的子数组递归构造左子树；用最大值右边的子数组递归构造右子树。返回构造出的二叉树的根节点。

**示例 1：**

- 输入：nums = [3,2,1,6,0,5]
- 输出：[6,3,5,null,2,0,null,null,1]
- 解释：最大值 6 作为根；左侧 [3,2,1] 递归构造左子树，右侧 [0,5] 递归构造右子树。

**提示：**

- 1 <= nums.length <= 1000
- 0 <= nums[i] <= 1000
- nums 中所有整数互不相同`,
    analysis: `### 核心思路

题目的构造规则本身就是递归定义，照着定义写即可：每一层取当前区间的**最大值**作为根，最大值左右两侧的子区间分别递归构造左右子树。实现时不真的切割数组，而是传区间下标，避免每次 slice 带来的额外开销。

> 本题与「前序中序构造二叉树」属于同一族：每一层先确定根，再把序列划分成左右两份递归处理，区别只是「确定根」的方式不同——一个靠前序首元素，一个靠区间最大值。

### 算法步骤

1. 递归函数接收闭区间 [left, right]，left 大于 right 时返回 null。
2. 扫描当前区间，找出最大值及其下标 idx。
3. 以最大值建根节点。
4. 递归 [left, idx - 1] 构造左子树，递归 [idx + 1, right] 构造右子树。
5. 返回根节点。

### 易错点

- 递归终止条件是 left > right，漏写会无限递归直到栈溢出。
- 找最大值必须限定在**当前区间**内，对整个数组找会构出错树。
- 区间只剩一个元素时也要正常建根，靠终止条件自然结束递归，无需特判。

### 复杂度分析

- 时间复杂度：最坏 O(n^2)（数组接近有序时每层都要扫描大区间），平均 O(n log n)。
- 空间复杂度：O(h)，最坏 O(n)。`,
    code: `function constructMaximumBinaryTree(nums: number[]): TreeNode | null {
    function build(left: number, right: number): TreeNode | null {
        if (left > right) return null
        // 在当前区间内寻找最大值
        let idx = left
        for (let i = left + 1; i <= right; i++) {
            if (nums[i] > nums[idx]) idx = i
        }
        const root = new TreeNode(nums[idx])
        root.left = build(left, idx - 1)
        root.right = build(idx + 1, right)
        return root
    }
    return build(0, nums.length - 1)
}`
  },
  'lc-merge-two-binary-trees': {
    desc: `给定两棵二叉树的根节点 root1 和 root2，将它们合并为一棵新二叉树。合并规则是：如果两个位置上的节点重叠，新节点的值为二者之和；否则不为空的那个节点直接作为新节点。返回合并后二叉树的根节点。

**示例 1：**

- 输入：root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]
- 输出：[3,4,5,5,4,null,7]
- 解释：重叠位置的节点值相加，单侧存在的子树原样保留。

**提示：**

- 两棵树中的节点数目在范围 [0, 2000] 内
- -10^4 <= Node.val <= 10^4`,
    analysis: `### 核心思路

两棵树**同步遍历**：重叠位置的节点值相加，单侧存在的子树整体保留。最简洁的写法是原地复用 root1——两个节点都存在时把 root2 的值加到 root1 上，然后递归合并各自的左右子树并把结果挂回 root1；任一节点为空时直接返回另一个节点，它的整棵子树连结构一起被接过去，无需再逐个遍历。

### 算法步骤

1. root1 为空返回 root2，root2 为空返回 root1，二者都是递归终止条件。
2. 两个节点都存在：root1.val 加上 root2.val。
3. 递归合并左子树，结果赋给 root1.left。
4. 递归合并右子树，结果赋给 root1.right。
5. 返回 root1。

### 易错点

- 终止条件是「任一为空就返回另一个」，只写「两个都空才返回」会导致对空节点取值报错。
- 递归结果必须**接回** root1 的左右孩子，否则合并结果断链丢失。
- 原地写法会修改输入的树；如需保留原树，可改为每次新建节点。

### 复杂度分析

- 时间复杂度：O(min(m, n))，两棵树同步向下，遇到空子树即停。
- 空间复杂度：O(min(h1, h2))，递归深度由较浅的那棵树决定。`,
    code: `function mergeTrees(root1: TreeNode | null, root2: TreeNode | null): TreeNode | null {
    if (root1 === null) return root2
    if (root2 === null) return root1
    // 重叠位置值相加，原地复用 root1
    root1.val += root2.val
    root1.left = mergeTrees(root1.left, root2.left)
    root1.right = mergeTrees(root1.right, root2.right)
    return root1
}`
  },
  'lc-search-in-a-binary-search-tree': {
    desc: `给定二叉搜索树（BST）的根节点 root 和一个整数值 val，在 BST 中查找节点值等于 val 的节点，返回以该节点为根的子树；如果不存在这样的节点，返回 null。

**示例 1：**

- 输入：root = [4,2,7,1,3], val = 2
- 输出：[2,1,3]
- 解释：值为 2 的节点连同它的子树即为查找结果。

**提示：**

- 树中节点数目在范围 [1, 5000] 内
- 1 <= Node.val <= 10^7
- root 是二叉搜索树
- 1 <= val <= 10^7`,
    analysis: `### 核心思路

BST 的核心性质是「左子树所有节点 < 根 < 右子树所有节点」，这让搜索变成**定向下潜**：当前值比目标大就往左走，比目标小就往右走，相等即命中。每比较一次就排除掉一整棵不可能的子树，路径是一条从根到目标的单一路径，而不像普通二叉树那样需要遍历整棵树。

> 普通二叉树的搜索要靠遍历加回溯兜底；BST 搜索利用有序性只走一条路径，这正是 BST 这种数据结构存在的意义。

### 算法步骤

1. 当前节点为空，说明树中不存在目标值，返回 null。
2. 节点值等于 val，返回当前节点（以它为根的整棵子树）。
3. val 小于节点值，递归搜索左子树。
4. val 大于节点值，递归搜索右子树。

### 易错点

- 返回值是**命中的节点**，调用方拿到的是以它为根的子树，不是单个数值。
- 递归终止的空节点判断不能省，它同时承担「找不到」的语义。
- 迭代写法注意循环条件是节点非空，不要在空节点上访问 val。

### 复杂度分析

- 时间复杂度：平衡树 O(log n)，最坏（链状树）O(n)。
- 空间复杂度：递归为 O(h)；改成迭代可做到 O(1)。`,
    code: `function searchBST(root: TreeNode | null, val: number): TreeNode | null {
    if (root === null || root.val === val) return root
    // 利用 BST 有序性定向搜索：小往左，大往右
    if (val < root.val) return searchBST(root.left, val)
    return searchBST(root.right, val)
}`
  },
  'lc-validate-binary-search-tree': {
    desc: `给定二叉树的根节点 root，判断它是否是一棵有效的二叉搜索树。有效 BST 的定义是：左子树中所有节点值小于根节点值，右子树中所有节点值大于根节点值，且左右子树也分别是有效的二叉搜索树。

**示例 1：**

- 输入：root = [2,1,3]
- 输出：true

**示例 2：**

- 输入：root = [5,1,4,null,null,3,6]
- 输出：false
- 解释：根节点 5 的右子树中存在值 3，违反了右子树所有值大于 5 的约定。

**提示：**

- 树中节点数目在范围 [1, 10^4] 内
- -2^31 <= Node.val <= 2^31 - 1`,
    analysis: `### 核心思路

BST 的**中序遍历结果是严格递增序列**，这是本题最优雅的判定方式：中序遍历整棵树，维护前驱值 pre，一旦发现当前节点值不大于前驱，立刻断定不是 BST。

> 只比较「节点与它的左右孩子」是经典错误：BST 要求的是整个子树的范围约束。例如 [5,4,6,null,null,3,7]，节点 3 在根的右子树里，逐对比较永远发现不了 3 小于 5 的违规。

递归实现中让中序遍历在发现违规时立即短路返回，避免无意义的全树扫描。前驱用 null 表示「还没有访问过节点」，不能用某个固定哨兵值，因为本题节点值范围覆盖全部 32 位整数。

### 算法步骤

1. 维护变量 pre（前驱值），初始为 null。
2. 递归中序遍历：先进入左子树，若左子树已判定非法，直接返回 false。
3. 访问当前节点：pre 非空且当前值小于等于 pre 时返回 false。
4. 把 pre 更新为当前值，再递归右子树，汇总两侧结果。

### 易错点

- 相等值也不合法，BST 要求**严格**小于 / 严格大于。
- 不能只做父子两两比较，必须借助中序全局有序或上下界传递。
- 短路返回能节省时间，注意递归结果的传递写法。

### 复杂度分析

- 时间复杂度：O(n)，每个节点访问一次。
- 空间复杂度：O(h)，来自递归栈，最坏 O(n)。`,
    code: `function isValidBST(root: TreeNode | null): boolean {
    // pre 记录中序遍历的前驱值，null 表示尚未访问任何节点
    let pre: number | null = null
    function inorder(node: TreeNode | null): boolean {
        if (node === null) return true
        if (!inorder(node.left)) return false
        // 中序必须严格递增，出现逆序即不是 BST
        if (pre !== null && node.val <= pre) return false
        pre = node.val
        return inorder(node.right)
    }
    return inorder(root)
}`
  },
  'lc-minimum-absolute-difference-in-bst': {
    desc: `给定一棵二叉搜索树的根节点 root，返回树中任意两个不同节点值之间的最小差值。差值必须是正数，等于两节点值之差的绝对值。

**示例 1：**

- 输入：root = [4,2,6,1,3]
- 输出：1
- 解释：最小差值出现在相邻的中序值之间，例如 1 与 2。

**示例 2：**

- 输入：root = [1,0,48,null,null,12,49]
- 输出：1

**提示：**

- 树中节点数目在范围 [2, 10^4] 内
- 0 <= Node.val <= 10^5`,
    analysis: `### 核心思路

朴素做法是把所有节点值收集到数组里再两两比较，代价 O(n^2)。BST 的**中序遍历得到递增序列**，而有序数组中任意两数的最小差一定出现在「相邻两个元素」之间，所以只需一遍中序遍历，维护前驱节点，用「当前值 - 前驱值」实时更新答案。

> 遇到「BST + 最小差值 / 众数 / 出现次数」这类问题，第一反应应当是中序遍历的有序性：它把树上的无序比较转化成有序序列上的一次线性扫描。

### 算法步骤

1. 维护前驱节点 pre 与答案 ans，ans 初始为无穷大。
2. 递归中序遍历：先进入左子树。
3. 访问当前节点：若前驱存在，用当前值减前驱值更新 ans 的最小值。
4. 把 pre 更新为当前节点，再进入右子树。
5. 遍历结束，返回 ans。

### 易错点

- 只需比较中序序列中**相邻两数**，把所有节点两两比较是多余的开销。
- ans 初始值要足够大，更新时取最小，节点值范围较大时用 Number.MAX_SAFE_INTEGER 之类的安全初值。
- pre 保存节点或数值都可以，访问时注意判空。

### 复杂度分析

- 时间复杂度：O(n)，每个节点访问一次。
- 空间复杂度：O(h)，来自递归栈，最坏 O(n)。`,
    code: `function getMinimumDifference(root: TreeNode | null): number {
    let ans = Number.MAX_SAFE_INTEGER
    let pre: TreeNode | null = null
    function inorder(node: TreeNode | null): void {
        if (node === null) return
        inorder(node.left)
        // 中序有序，最小差值只可能出现在相邻两数之间
        if (pre !== null) {
            ans = Math.min(ans, node.val - pre.val)
        }
        pre = node
        inorder(node.right)
    }
    inorder(root)
    return ans
}`
  },
  'lc-find-mode-in-binary-search-tree': {
    desc: `给定二叉搜索树（BST）的根节点 root，找出其中出现次数最多的节点值（众数）。树中相同值的节点可能不止一个，众数也可能有多个，以任意顺序返回包含所有众数的数组。

**示例 1：**

- 输入：root = [1,null,2,2]
- 输出：[2]

**示例 2：**

- 输入：root = [0]
- 输出：[0]

**提示：**

- 树中节点数目在范围 [1, 10^4] 内
- -10^5 <= Node.val <= 10^5
- 进阶：能否不使用额外空间？（递归产生的隐式调用栈不计入）`,
    analysis: `### 核心思路

众数关心的是「相同值连续出现的次数」，而 BST 的**中序遍历恰好把相等的值排在一起**。于是不必用哈希表统计全部频次：中序遍历时维护前驱节点，当前值等于前驱值则计数加一，否则重置为一。再用一个全局最大计数 maxCount 决定收录策略——超过则清空结果重新收录，等于则追加，一遍扫描完成统计。

> 这是中序有序性的又一次经典应用：把「统计频次」转化为「统计连续相等段」，空间开销只花在结果数组上。

### 算法步骤

1. 维护 pre 节点、当前值出现次数 count、最大次数 maxCount 和结果数组。
2. 中序遍历：先进入左子树。
3. 与前驱值相等则 count 加一，否则 count 重置为 1。
4. count 大于 maxCount：更新 maxCount，清空结果数组并收录当前值。
5. count 等于 maxCount：追加当前值。
6. 更新 pre，进入右子树。

### 易错点

- 出现「更大的新众数」时要**先清空**结果数组再收录，否则旧的众数会残留。
- count 等于 maxCount 时要追加而不是忽略，因为众数可能不止一个。
- pre 的更新放在「访问当前节点」逻辑之后，顺序颠倒计数会错乱。

### 复杂度分析

- 时间复杂度：O(n)，每个节点访问一次。
- 空间复杂度：O(1)（不计结果数组和递归栈），满足本题进阶要求。`,
    code: `function findMode(root: TreeNode | null): number[] {
    let pre: TreeNode | null = null
    let count = 0
    let maxCount = 0
    const res: number[] = []
    function inorder(node: TreeNode | null): void {
        if (node === null) return
        inorder(node.left)
        // 中序遍历中相同值连续出现，据此维护计数
        if (pre !== null && pre.val === node.val) {
            count++
        } else {
            count = 1
        }
        if (count > maxCount) {
            // 出现更大的新众数：清空重收
            maxCount = count
            res.length = 0
            res.push(node.val)
        } else if (count === maxCount) {
            // 并列众数：追加
            res.push(node.val)
        }
        pre = node
        inorder(node.right)
    }
    inorder(root)
    return res
}`
  },
  'lc-lowest-common-ancestor-of-a-binary-tree': {
    desc: `给定一棵二叉树的根节点 root 和树中两个节点 p、q，找到它们的最近公共祖先节点。最近公共祖先的定义为：同时拥有 p 和 q 作为后代（允许节点是自身的后代）且深度最大的节点。

**示例 1：**

- 输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
- 输出：3
- 解释：节点 5 和节点 1 的最近公共祖先是节点 3。

**提示：**

- 树中节点数目在范围 [2, 10^5] 内
- 所有节点值互不相同
- p 和 q 均存在于树中`,
    analysis: `### 核心思路

用**后序遍历（左右根）自底向上**查找。递归函数的语义是「在以 node 为根的子树中寻找 p 或 q，返回找到的节点或公共祖先」：node 为空、或等于 p、或等于 q 时直接返回 node。之后分别递归左右子树——两侧都不为空，说明 p、q 分居当前节点两侧，当前节点就是最近公共祖先；只有一侧不为空，把该侧结果向上传递即可。

> 为什么命中 p 或 q 就可以直接返回而不继续向下找？因为题目保证 p、q 一定在树中：若另一个不在这棵子树里，那么当前命中的节点本身就是它们的最近公共祖先。

### 算法步骤

1. node 为空或等于 p 或 q，返回 node。
2. 递归左子树得 left，递归右子树得 right。
3. left 与 right 都非空，返回 node。
4. 只有一侧非空，返回该侧；两侧都空返回 null。

### 易错点

- 必须用**后序遍历**，先拿左右子树的信息再决定当前层返回什么，这是自底向上汇聚的关键。
- 返回值语义是节点而不是布尔值，改成布尔会丢失「祖先是谁」的信息。
- 「节点可以是自己的祖先」：p 是 q 的祖先时返回 p，步骤 1 已天然覆盖。

### 复杂度分析

- 时间复杂度：O(n)，每个节点最多访问一次。
- 空间复杂度：O(h)，来自递归栈，最坏 O(n)。`,
    code: `function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    if (root === null || root === p || root === q) return root
    // 后序遍历：先在左右子树中查找，再由当前节点汇总
    const left = lowestCommonAncestor(root.left, p, q)
    const right = lowestCommonAncestor(root.right, p, q)
    // p、q 分居两侧，当前节点即最近公共祖先
    if (left !== null && right !== null) return root
    return left !== null ? left : right
}`
  },
  'lc-lowest-common-ancestor-of-a-binary-search-tree': {
    desc: `给定二叉搜索树（BST）的根节点 root 和树中两个节点 p、q，找到它们的最近公共祖先。最近公共祖先是同时拥有 p、q 作为后代且深度最大的节点；一个节点也可以是它自己的祖先。

**示例 1：**

- 输入：root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
- 输出：6
- 解释：节点 2 和节点 8 的最近公共祖先是 6。

**示例 2：**

- 输入：root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
- 输出：2
- 解释：节点自身可以是自己的祖先，2 既是 p 也是公共祖先。

**提示：**

- 树中节点数目在范围 [2, 10^5] 内
- 所有节点值互不相同
- p 和 q 为树中存在的不同节点`,
    analysis: `### 核心思路

普通二叉树求 LCA 需要后序遍历自底向上汇聚信息，而 BST 的**有序性**让问题退化成一次定向下潜：若 p、q 的值都小于当前节点，说明二者都在左子树，向左走；都大于则向右走；一旦出现「一大一小」或其中一个等于当前节点值，当前节点就是把 p、q 分开的第一个节点，也就是它们的最近公共祖先。

> 从根到答案只需走一条路，第一个「落在 p、q 值区间之间（含端点）」的节点就是 LCA，不需要任何回溯。

### 算法步骤

1. 从根开始，用指针 cur 表示当前节点。
2. p、q 的值都小于 cur.val，cur 移到左孩子。
3. p、q 的值都大于 cur.val，cur 移到右孩子。
4. 其余情况（分居两侧或命中其一），返回 cur。

### 易错点

- 判断顺序是「同时小、同时大」优先，剩下的一切情况都直接返回，不要漏掉「p 或 q 等于当前节点」的场景。
- 不需要后序遍历，写成自底向上反而把 O(h) 的问题做复杂了。
- 迭代写法用局部变量移动指针，不要破坏 root 引用。

### 复杂度分析

- 时间复杂度：平衡 BST 为 O(log n)，最坏链状 O(n)。
- 空间复杂度：O(1)，迭代写法不需要递归栈。`,
    code: `function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    const pv = p!.val
    const qv = q!.val
    let cur = root
    while (cur !== null) {
        if (pv < cur.val && qv < cur.val) {
            // 都小：公共祖先在左子树
            cur = cur.left
        } else if (pv > cur.val && qv > cur.val) {
            // 都大：公共祖先在右子树
            cur = cur.right
        } else {
            // 首个把 p、q 分开（或命中其一）的节点即最近公共祖先
            return cur
        }
    }
    return null
}`
  },
  'lc-insert-into-a-binary-search-tree': {
    desc: `给定二叉搜索树（BST）的根节点 root 和要插入树中的值 val，将 val 插入 BST 并返回插入后的根节点。输入数据保证新值和原始 BST 中的任意节点值都不同；可行的插入方式可能不唯一，返回任意一种合法结果即可。

**示例 1：**

- 输入：root = [4,2,7,1,3], val = 5
- 输出：[4,2,7,1,3,5]
- 解释：5 介于 4 和 7 之间，最终插入到 7 的左孩子位置。

**提示：**

- 树中节点数目在范围 [0, 10^4] 内
- -10^8 <= Node.val, val <= 10^8
- 保证树中不存在值等于 val 的节点`,
    analysis: `### 核心思路

BST 插入的本质是「为新值寻找一个空位」：从根开始，值小往左走、值大往右走，一路比较到空节点，这个空位就是新节点的归宿。插入永远发生在**叶子位置**，已有节点的相对结构不变。递归写法有个优雅技巧：让递归函数返回「插入完成后该子树的根」，走到空位就新建节点并返回，父节点用 root.left 或 root.right 接住返回值，这样完全不需要记录父节点指针。

> BST 插入不涉及旋转和结构调整，这是它比 AVL、红黑树简单得多的地方；代价是多次插入可能让树退化成链表。

### 算法步骤

1. 当前节点为空：新建 TreeNode(val) 并返回，这就是插入点。
2. val 小于当前节点值：root.left 接住左子树递归插入的结果。
3. val 大于当前节点值：root.right 接住右子树递归插入的结果。
4. 返回当前节点 root。

### 易错点

- 递归返回值必须被父节点**接住**（root.left = ...），漏写接住语句会导致插入丢失。
- 空树插入时，新建节点就是整棵树的根，递归第一步就完成返回。
- 插入位置由一路比较决定，不能在中途「看着合适」就落地，会破坏 BST 性质。

### 复杂度分析

- 时间复杂度：平衡树 O(log n)，最坏 O(n)。
- 空间复杂度：O(h)，可改写为迭代实现做到 O(1)。`,
    code: `function insertIntoBST(root: TreeNode | null, val: number): TreeNode | null {
    if (root === null) {
        // 走到空位，新建节点即为插入点
        return new TreeNode(val)
    }
    if (val < root.val) {
        root.left = insertIntoBST(root.left, val)
    } else {
        root.right = insertIntoBST(root.right, val)
    }
    return root
}`
  },
  'lc-delete-node-in-a-bst': {
    desc: `给定二叉搜索树（BST）的根节点 root 和一个值 key，删除 BST 中节点值等于 key 的节点，并保证删除后整棵树仍满足 BST 性质。一般可以用该节点的中序前驱（左子树最大节点）或中序后继（右子树最小节点）来补位。返回删除后二叉树的根节点。

**示例 1：**

- 输入：root = [5,3,6,2,4,null,7], key = 3
- 输出：[5,4,6,2,null,null,7]
- 解释：删除值为 3 的节点后，可用其中序后继 4 补位；结果不唯一，满足 BST 性质即可。

**提示：**

- 树中节点数目在范围 [0, 10^4] 内
- -10^5 <= Node.val, key <= 10^5
- 节点值互不相同`,
    analysis: `### 核心思路

删除比插入复杂，难点在于被删节点可能带有孩子。总体框架仍是**递归定位**：key 小于当前值往左找，大于往右找；找到后按孩子情况分类处理。一个实用技巧可以把「左右孩子都在」的最复杂情况大幅简化——找到右子树最左节点（中序后继），把被删节点的左子树整体挂到后继的左孩子上，然后直接返回右子树作为新的子树根。

> 技巧成立的根本原因：后继是右子树中的最小节点，它必然没有左孩子，把左子树挂到它的左孩子位置不会与任何节点冲突，BST 性质依然完好。

### 算法步骤

1. 当前节点为空返回 null，说明树中没有 key。
2. 命中 key 且左子树为空：返回右子树（右也为空时返回 null，自动覆盖）。
3. 否则若右子树为空：返回左子树。
4. 左右都在：找到右子树最左节点，把左子树挂到它的左孩子上，返回右子树。
5. 未命中则向左或向右递归，并把返回值接回 root.left / root.right。

### 易错点

- 递归结果必须**接回父节点**，否则删除不会真正生效。
- 先判断左空再判断右空的顺序不可颠倒，二者同时为空时走「左空」分支返回 null 恰好正确。
- 左子树要挂在**后继的左孩子**上，不是挂在后继节点原本的位置。

### 复杂度分析

- 时间复杂度：O(h)，查找与找后继都不超过树高。
- 空间复杂度：O(h)，来自递归栈。`,
    code: `function deleteNode(root: TreeNode | null, key: number): TreeNode | null {
    if (root === null) return null
    if (root.val === key) {
        // 左子树为空：用右子树顶替（右为空则返回 null，天然覆盖）
        if (root.left === null) return root.right
        // 右子树为空：用左子树顶替
        if (root.right === null) return root.left
        // 左右都在：把左子树整体挂到右子树最左节点（后继）的左孩子上
        let cur = root.right
        while (cur.left !== null) cur = cur.left
        cur.left = root.left
        return root.right
    }
    if (key < root.val) {
        root.left = deleteNode(root.left, key)
    } else {
        root.right = deleteNode(root.right, key)
    }
    return root
}`
  },
  'lc-trim-a-binary-search-tree': {
    desc: `给定二叉搜索树的根节点 root，以及整数 low 和 high，修剪这棵树，使得所有节点的值都落在闭区间 [low, high] 中。修剪不应改变保留在树中的元素之间的相对结构（即没有被移除的节点，其父子关系保持），可以证明答案唯一。返回修剪后二叉树的根节点。

**示例 1：**

- 输入：root = [1,0,2], low = 1, high = 2
- 输出：[1,null,2]
- 解释：值为 0 的节点小于下界，被移除。

**示例 2：**

- 输入：root = [3,0,4,null,2,null,null,1], low = 1, high = 3
- 输出：[3,2,null,1]
- 解释：0 和 4 超出范围被移除，2 和 1 保留并重新挂载。

**提示：**

- 树中节点数目在范围 [1, 10^4] 内
- -10^4 <= low <= high <= 10^4
- 树中所有节点值互不相同`,
    analysis: `### 核心思路

利用 BST「左小右大」的有序性做递归修剪，分三种情况：节点值小于 low，说明它和它的**整棵左子树**都越界（左子树的值只会更小），直接返回修剪后的右子树作为替代；节点值大于 high 同理，返回修剪后的左子树；值落在 [low, high] 内则保留当前节点，左右孩子分别接住两侧递归修剪的结果。

> 第一种情况不能简单地返回 null：虽然当前节点和左子树都该删，但右子树里可能还藏着合法节点，必须递归修剪右子树后再返回。

### 算法步骤

1. 空节点返回 null，递归终止。
2. root.val 小于 low：返回 trimBST(root.right, low, high)。
3. root.val 大于 high：返回 trimBST(root.left, low, high)。
4. 值在区间内：root.left、root.right 分别接住左右子树的修剪结果。
5. 返回 root。

### 易错点

- 越界分支必须返回**另一侧修剪后的子树**，返回 null 会误删合法节点。
- 区间内分支要把递归结果接回 root.left / root.right，否则断链。
- 返回值语义是「修剪完成的子树根」，整棵树的根也可能被替换，主调用直接用返回值。

### 复杂度分析

- 时间复杂度：O(n)，每个节点最多被访问常数次。
- 空间复杂度：O(h)，来自递归栈，最坏 O(n)。`,
    code: `function trimBST(root: TreeNode | null, low: number, high: number): TreeNode | null {
    if (root === null) return null
    if (root.val < low) {
        // 根和左子树全部越界，用修剪后的右子树顶替
        return trimBST(root.right, low, high)
    }
    if (root.val > high) {
        // 根和右子树全部越界，用修剪后的左子树顶替
        return trimBST(root.left, low, high)
    }
    root.left = trimBST(root.left, low, high)
    root.right = trimBST(root.right, low, high)
    return root
}`
  },
  'lc-convert-sorted-array-to-binary-search-tree': {
    desc: `给定一个严格升序排列的整数数组 nums，将它转换为一棵高度平衡的二叉搜索树。高度平衡指每个节点的左右两个子树的高度差的绝对值不超过 1。返回任意一种符合条件的答案。

**示例 1：**

- 输入：nums = [-10,-3,0,5,9]
- 输出：[0,-3,9,-10,null,5]
- 解释：取中间元素 0 作为根，左右两半分别递归构造，即得平衡 BST。

**提示：**

- 1 <= nums.length <= 10^4
- -10^4 <= nums[i] <= 10^4
- nums 已按严格递增顺序排列`,
    analysis: `### 核心思路

有序数组恰好是一棵 BST 的**中序遍历**结果，反过来由中序构造 BST 时，只要控制「根」的选取就能控制平衡性：每次取数组**中间元素**作为根，中点左侧的元素全部进入左子树，右侧全部进入右子树。由于左右两半的长度最多相差 1，递归下去每个节点的左右子树规模始终接近，整棵树的高度差自然不超过 1。

> 「有序数组 + 取中点」之所以必然得到平衡 BST：根把数组近似等分成两半，左右子树的节点个数几乎相同，这是自顶向下逐层均衡的结构性保证。

### 算法步骤

1. 递归函数接收闭区间 [left, right]，left 大于 right 时返回 null。
2. 取 mid 为区间中点（向下取整），以 nums[mid] 建根节点。
3. 递归 [left, mid - 1] 构造左子树。
4. 递归 [mid + 1, right] 构造右子树。
5. 返回根。

### 易错点

- 终止条件是 left **大于** right，写成 left 大于等于 right 会漏掉只剩一个元素的区间。
- mid 向下取整与向上取整都是合法答案，LeetCode 只要求平衡，不要求唯一形态。
- 数组本身有序，不要多余地排序；用下标区间代替真正的数组切割更高效。

### 复杂度分析

- 时间复杂度：O(n)，每个元素恰好用来建一个节点。
- 空间复杂度：O(log n)，递归深度即树高（不计返回的树本身）。`,
    code: `function sortedArrayToBST(nums: number[]): TreeNode | null {
    function build(left: number, right: number): TreeNode | null {
        if (left > right) return null
        // 取中点作为根，保证左右子树规模均衡
        const mid = Math.floor((left + right) / 2)
        const root = new TreeNode(nums[mid])
        root.left = build(left, mid - 1)
        root.right = build(mid + 1, right)
        return root
    }
    return build(0, nums.length - 1)
}`
  },
  'lc-convert-bst-to-greater-tree': {
    desc: `给定二叉搜索树的根节点 root，将其转换为「累加树」：每个节点的新值等于原树中所有大于或等于 node.val 的节点值之和。转换后树仍是二叉搜索树。返回转换完成的根节点。

**示例 1：**

- 输入：root = [4,1,6,0,2,5,7,null,null,null,3,null,null,null,8]
- 输出：[30,36,21,36,35,26,15,null,null,null,33,null,null,null,8]
- 解释：例如值为 4 的节点更新为 4+5+6+7+8 = 30。

**示例 2：**

- 输入：root = [0,null,1]
- 输出：[1,null,1]

**提示：**

- 树中节点数目在范围 [0, 10^4] 内
- -10^4 <= Node.val <= 10^4
- 树中所有节点值互不相同`,
    analysis: `### 核心思路

「大于等于自己」的累加方向，恰好是中序遍历的**反方向**：中序从小到大，逆中序（右 → 根 → 左）从大到小。按逆中序遍历并维护一个全局累加变量 sum，走到某个节点时，sum 里恰好已经累加了所有比它大的节点值，再加上它自身就是答案，直接把节点值更新为累加结果。

> 这是 BST 中序有序性的又一次经典应用：中序不仅支持从小到大扫描，反着用就是从大到小，配合一个前缀和变量即可一遍完成，无需任何额外数据结构。

### 算法步骤

1. 维护全局累加变量 sum，初始为 0。
2. 递归遍历：先进入右子树。
3. 访问当前节点：sum 加上当前节点值，再把节点值更新为 sum。
4. 进入左子树。
5. 全部遍历完成后返回根节点。

### 易错点

- 遍历顺序必须是**右 → 根 → 左**，写成普通中序会从小往大累加，方向完全颠倒。
- 节点值要在累加之后再更新为 sum（累加值包含自身），先更新会少算自己。
- 节点值可能为负数，逻辑不受影响，但不要基于「值的大小」做提前终止的假设。

### 复杂度分析

- 时间复杂度：O(n)，每个节点访问一次。
- 空间复杂度：O(h)，来自递归栈，最坏 O(n)。`,
    code: `function convertBST(root: TreeNode | null): TreeNode | null {
    let sum = 0
    // 逆中序遍历：右 -> 根 -> 左，从大到小累加
    function reverseInorder(node: TreeNode | null): void {
        if (node === null) return
        reverseInorder(node.right)
        sum += node.val
        node.val = sum
        reverseInorder(node.left)
    }
    reverseInorder(root)
    return root
}`
  }
}

export default solutions
