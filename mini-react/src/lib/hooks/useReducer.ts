import { scheduleUpdateOnFiber } from '../reconciler/fiberWorkLoop'
import { Fiber, Hook } from '../types'
import { state, updateWorkInProgressHook } from './hook'


/**
 * @param reducer 改变状态的纯函数 返回值作为状态; 传入 null 则变成 useState
 * @param initialState 初始化状态
 */
export function useReducer<T>(
    reducer: Function | null,
    initialState: T,
): [T, Function] {
    // 首先拿到最新的 hook
    // 这里的 hook 是一个对象 里面存储了一些数据
    // hook --> { memorizedState: xxx, next: xxx }
    // hook 对象里面有两个属性 一个 memorizedState; 存储数据 一个 next 用于下一个 hook
    const hook = updateWorkInProgressHook()

    if (!state.currentlyRenderingFiber?.alternate && hook) {
        // 首次渲染
        hook.memorizedState = initialState
    }

    const dispatch = dispatchReducerAction.bind(
        null,
        state.currentlyRenderingFiber,
        hook,
        reducer
    )

    return [hook?.memorizedState as T, dispatch]
}


/**
 * 根据用户传入的 reducer 计算最新的状态 然后处理一下 Fiber 对象
 * 这个状态可以在 action 中获取到
 * @param fiber 当前正在处理的 Fiber 对象
 * @param hook 当前正在处理的 hook
 * @param reducer 如果是 useState 调用 则没有 reducer
 * @param action 如果是 useState 调用 则为 setState 传入的值
 */
function dispatchReducerAction(
    fiber: Fiber | null,
    hook: Hook | null,
    reducer: Function | null,
    action: any
) {
    if (!fiber) return
    // 得到一个最新的状态
    if (hook) {
        hook.memorizedState = reducer
            ? reducer(hook.memorizedState)
            : action
    }

    // 状态更新完毕 该 fiber 就是旧的 fiber 需要对这个 fiber 处理
    fiber.alternate = { ...fiber }
    // 将相邻的 fiber 节点置为 null 不去更新相邻的节点
    fiber.sibling = null
    scheduleUpdateOnFiber(fiber)
}
