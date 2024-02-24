import { ReactElement } from 'react'
import { createFiber } from './fiber'
import { Flags, isStrOrNum } from '../share'
import { Fiber } from '../types'

/**
 * 协调子节点的 diff 算法
 * @param returnFiber 因为是处理子节点 因此传入的这个 fiber 就会成为父 fiber
 * @param children 子节点的 vnode 数组
 */
export function reconcileChildren(returnFiber: Fiber, children: Fiber[] | Fiber) {
    // 文本节点在 updateNode 方法中处理过了
    if (isStrOrNum(children)) return

    const newChildren = Array.isArray(children) ? children : [children]
    /** 上一个 children Fiber */
    let previousNewFiber: null | Fiber = null,
        /** 父 fiber 对应的旧 fiber */
        oldFiber = returnFiber.alternate?.child,
        /** 该变量有两个作用
          * 1. 存储下一个旧的 fiber 对象
          * 2. 临时存储当前的旧的 fiber 对象 */
        nextOldFiber = null,
        i = 0,
        /** 上一次 fiber 节点插入的最远位置 */
        lastPlacedIndex: number | null = 0,
        /** 是否需要追踪副作用
          * true 代表组件更新
          * false 代表组件初次渲染 */
        shouldTrackSideEffects = !!returnFiber.alternate

    /**
     * 接下来就是整个 diff 核心的算法思想：
     * 整体来讲分为 5 个大的步骤：
     * 1. 第一轮遍历 从左往右遍历新节点（vnode） 在遍历的同时比较新旧节点（旧节点是 fiber 对象）
     * 如果节点可以复用 那么复用 循环继续往右边走
     * 如果节点不能够复用 那么就跳出循环 结束第一轮遍历
     * 2. 检查 newChildren 是否完成了遍历 因为从上面第一步出来 就两种：
     * 要么是提前跳出来的
     * 要么是遍历完了跳出来 如果新节点完成了整个遍历 但是旧节点（fiber对象）还存在 那么就将旧节点删除
     * 3. 还有一种情况也是属于初次渲染：旧节点遍历完了 新节点还有剩余 那么这些新节点就是属于初次渲染
     * 4. 处理新旧节点都还有剩余的情况
     * （1）将剩下旧节点放入到一个 map 结构里面 方便之后使用
     * （2）遍历剩余的新节点 通过新节点的 key 去 map 里面进行查找 看有没有能够复用的旧节点 如果有 拿来复用 并且会从 map 中删除对应的旧节点
     * 5. 整个新节点遍历完成后 如果 map 中还有剩余的旧节点 这些旧节点也就没有用了 直接删除即可
     */


    // 第一轮遍历 会尝试复用节点
    for (; oldFiber && i < newChildren.length; i++) {
        // 第一次是不会进入到这个循环的 因为一开始没有 oldFiber
        const newChild = newChildren[i]
        if (newChild == null) continue

        // 在判断是否能够复用之前 我们先给 nextOldFiber 赋值
        // 这里有一种情况
        // old 一开始是 1 2 3 4 5 进行了一些修改 现在只剩下 5 和 4
        // old >> 5(4) 4(3)
        // new >> 4(3) 1 2 3 5(4)
        // 此时旧的节点的 index 是大于 i 因此我们需要将 nextOldFiber 暂存为 oldFiber
        if (oldFiber.index && oldFiber.index > i) {
            nextOldFiber = oldFiber
            oldFiber = null
        } else {
            nextOldFiber = oldFiber.sibling
        }

        const isSame = isSameNode(newChild, oldFiber)
        if (!isSame) {
            if (oldFiber == null) {
                // 将 oldFiber 原本的值还原 方便后面使用
                oldFiber = nextOldFiber
            }
            break
        }

        const newFiber = createFiber(newChild, returnFiber)
        Object.assign(newFiber, {
            stateNode: oldFiber?.stateNode,
            alternate: oldFiber,
            flags: Flags.Update,
        })

        lastPlacedIndex = placeChild(
            newFiber,
            lastPlacedIndex,
            i,
            shouldTrackSideEffects
        )

        linkSibling(newFiber)
        oldFiber = nextOldFiber
    }

    // 从上面的 for 循环出来 有两种情况
    // 1. oldFiber 为 null 说明是初次渲染
    // 2. i === newChildren.length 说明是更新
    if (i === newChildren.length) {
        // 如果还剩余有旧的 fiber 节点 那么就需要将其删除掉
        deleteRemainingChildren(returnFiber, oldFiber)
        return
    }

    // 初次渲染
    if (!oldFiber) {
        // 将 newChildren 数组中的每一个元素都生成一个 fiber 对象
        // 然后将这些 fiber 对象串联起来
        for (; i < newChildren.length; i++) {
            const newChildVnode = newChildren[i]

            if (newChildVnode == null) continue

            // 下一步就应该根据 vnode 生成新的 fiber
            const newFiber = createFiber(newChildVnode as ReactElement, returnFiber)

            lastPlacedIndex = placeChild(
                newFiber,
                lastPlacedIndex,
                i,
                shouldTrackSideEffects
            )

            linkSibling(newFiber)
        }
    }

    // 处理新旧节点都还有剩余的情况
    const existingChildren = mapRemainingChildren(oldFiber)
    for (; i < newChildren.length; i++) {
        const newChild = newChildren[i]
        if (newChild == null) continue

        const newFiber = createFiber(newChild, returnFiber)
        // 寻找可以复用的节点
        const matchedFiber = existingChildren.get(newFiber.key || newFiber.index)

        if (matchedFiber) {
            Object.assign(newFiber, {
                stateNode: matchedFiber.stateNode,
                alternate: matchedFiber,
                flags: Flags.Update,
            })
            existingChildren.delete(newFiber.key || newFiber.index)
        }

        lastPlacedIndex = placeChild(
            newFiber,
            lastPlacedIndex,
            i,
            shouldTrackSideEffects
        )

        linkSibling(newFiber)
        if (shouldTrackSideEffects) {
            existingChildren.forEach((child) => {
                deleteChild(returnFiber, child)
            })
        }
    }

    /** 形成兄弟节点链表 */
    function linkSibling(newFiber: Fiber) {
         if (previousNewFiber == null) {
            // 说明是第一个子节点
            returnFiber.child = newFiber
        }
        else {
            // 形成兄弟节点链表
            previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
    }
}

/**
 * 用于更新 flags 状态  
 * `old: 1 2 3 4 5`  
 * `new: 5 1 2 3 4`  
 * 5 之前的索引为 4，通过判断索引决定是更新还是移动  
 * @param newFiber  上面刚刚创建的新的 fiber 对象
 * @param lastPlacedIndex 上一次的 lastPlacedIndex 也就是上一次插入的最远位置 初始值是 0
 * @param newIndex 当前的下标 初始值也是 0
 * @param shouldTrackSideEffects 判断 returnFiber 是初次渲染还是更新
 */
function placeChild(
    newFiber: Fiber,
    lastPlacedIndex: number | null,
    newIndex: number,
    shouldTrackSideEffects: boolean
) {
    // fiber 对象上面的 index 记录当前 fiber 节点在当前层级下的位置
    newFiber.index = newIndex

    // 初次渲染
    if (!shouldTrackSideEffects) {
        return lastPlacedIndex
    }

    const current = newFiber.alternate
    if (current) {
        const oldIndex = current.index
        
        if (
            oldIndex &&
            lastPlacedIndex &&
            oldIndex < lastPlacedIndex
        ) {
            // 当前节点需要移动
            newFiber.flags |= Flags.Placement
            return lastPlacedIndex
        }
        else {
            // oldIndex 应该作为最新的 lastPlacedIndex
            return oldIndex
        }
    }
    else {
        // 当前的 fiber 是初次渲染
        newFiber.flags |= Flags.Placement
        return lastPlacedIndex
    }
}

function isSameNode(a: Fiber | null, b: Fiber | null) {
    return a && b &&
        a.type === b.type &&
        a.key === b.key
}

/**
 * 标记要删除的 Fiber
 * @param returnFiber 父 Fiber
 * @param childToDelete 需要删除的子 Fiber
 */
function deleteChild(returnFiber: Fiber, childToDelete: Fiber) {
    // 这里的删除仅标记 真正的删除在 commit 阶段
    const deletions = returnFiber.deletions
    if (deletions) {
        deletions.push(childToDelete)
    }
    else {
        returnFiber.deletions = [childToDelete]
    }
}

/**
 * @param returnFiber 父 Fiber
 * @param currentFirstChild 旧的第一个待删除的子 Fiber
 */
function deleteRemainingChildren(returnFiber: Fiber, currentFirstChild?: Fiber | null) {
    let childToDelete = currentFirstChild
    while (childToDelete) {
        deleteChild(returnFiber, childToDelete)
        childToDelete = childToDelete.sibling
    }
}

/**
 * 将旧的子节点构建到一个 map 结构里面
 * @param currentFirstChild
 */
function mapRemainingChildren(currentFirstChild?: Fiber | null) {
    const existingChildren = new Map()
    let existingChild = currentFirstChild

    while (existingChild) {
        existingChildren.set(
            existingChild.key || existingChild.index,
            existingChild
        )
        // 切换到下一个兄弟节点
        existingChild = existingChild.sibling
    }

    return existingChildren
}
