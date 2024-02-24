import { Fiber, Hook } from '../types'


export const state: State = {
    /** 当前渲染的 fiber 对象 */
    currentlyRenderingFiber: null,
    /** 当前正在处理的 hook */
    workInProgressHook: null,
    /** 当前处理完的 hook */
    currentHook: null,
}

/**
 * 对 fiber 以及 hooks 初始化
 * @param wip 接收一个 Fiber 对象
 */
export function renderWithHooks(wip: Fiber) {
    state.currentlyRenderingFiber = wip
    state.currentlyRenderingFiber.memorizedState = null
    state.workInProgressHook = null
    /** 存储 effect 对应的副作用函数和依赖项 */
    state.currentlyRenderingFiber.updateQueue = []
}


/**
 * 该方法的作用主要就是返回一个 hook 对象
 * 并且让 workInProgressHook始终指向 hook 链表的最后一个 hook
 */
export function updateWorkInProgressHook() {
    let hook = null
    /** 旧的 fiber 对象 */
    const current = state.currentlyRenderingFiber?.alternate
    if (current) {
        // 不是第一次渲染 存在旧的 fiber 对象
        state.currentlyRenderingFiber!.memorizedState = current.memorizedState
        if (state.workInProgressHook) {
            // 链表已经存在
            state.workInProgressHook = hook = state.workInProgressHook.next
            state.currentHook = state.currentHook?.next
        }
        else {
            // 链表不存在
            state.workInProgressHook = hook = state.currentlyRenderingFiber!.memorizedState
            state.currentHook = current.memorizedState
        }
    }
    else {
        // 是第一次渲染
        hook = {
            memorizedState: null, // 存储数据
            next: null, // 指向下一个 hook
        }
        if (state.workInProgressHook) {
            // 这个链表上面已经有 hook 了
            state.workInProgressHook = state.workInProgressHook.next = hook
        }
        else {
            // hook 链表上面还没有 hook
            state.workInProgressHook = state.currentlyRenderingFiber!.memorizedState = hook
        }
    }

    return hook
}

interface State {
    /** 当前渲染的 fiber 对象 */
    currentlyRenderingFiber: Fiber | null
    /** 当前正在处理的 hook */
    workInProgressHook: Hook | null
    /** 当前处理完的 hook */
    currentHook: Hook | null | undefined
}
