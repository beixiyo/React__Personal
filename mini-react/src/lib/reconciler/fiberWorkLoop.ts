import { scheduleCallback } from '../scheduler'
import { Fiber } from '../types'
import { beginWork } from './beginWork'
import { commitWorker } from './commit'


/** work in progress 表示正在进行的工作 */
let wip: Fiber | null = null,
    wipRoot: Fiber | null = null

/**
 * 每次更新视图需要执行的函数
 * @param fiber 要处理的 Fiber
 */
export function scheduleUpdateOnFiber(fiber: Fiber) {
    wip = fiber
    wipRoot = fiber

    scheduleCallback(workLoop)
}

/**
 * 处理每个节点 在每一帧有剩余时间的时候执行
 */
function workLoop() {
    while (wip) {
        performUnitOfWork()
    }

    // 代码到这里 要么是没时间 这个不需要管
    // 要么是整个 fiber 树都处理完了
    if (!wip && wipRoot) {
        commitRoot()
    }
}

/**
 * 该函数主要负责处理一个 fiber 节点
 * 有下面的事情要做：
 * 1. 处理当前的 fiber 对象
 * 2. 通过深度优先遍历子节点 生成子节点的 fiber 对象 然后继续处理
 * 3. 提交副作用
 * 4. 进行渲染
 */
function performUnitOfWork() {
    beginWork(wip!)

    if (wip?.child) {
        wip = wip.child
        return
    }

    // 若没有子节点 就找兄弟节点
    let next = wip
    while (next) {
        if (next.sibling) {
            wip = next.sibling
            return
        }
        // 说明没有兄弟节点 向外查找父节点
        next = next.return
    }

    // 没有节点需要处理了
    wip = null
}

/**
 * 执行该方法时 说明整个节点的协调工作已经完成
 * 接下来进入到渲染阶段
 */
function commitRoot() {
    commitWorker(wipRoot)
    wipRoot = null
}

