import { hookIsEqual } from '../share'
import { updateWorkInProgressHook, state } from './hook'

/** 收集副作用 在每次更新时执行
 * @param create 要执行的副作用函数
 * @param deps 依赖项
 */
export function useEffect<T extends any[]>(create: Function, deps: T) {
    /** 获取最后一个 hook */
    const hook = updateWorkInProgressHook()
    /** 存储销毁函数 */
    let destroy = null

    if (state.currentHook) {
        const prevEffect = state.currentHook.memorizedState
        destroy = prevEffect.destroy

        if (deps) {
            const prevDeps = prevEffect.deps
            if (hookIsEqual(deps, prevDeps)) {
                return
            }
        }
    }

    /** 组装要存储到 memorizedState 中的数据 */
    const effect = { create, deps, destroy }
    hook && (hook.memorizedState = effect)
    /** 这里先加入队列 在`commitNode`函数会执行副作用函数 */
    state.currentlyRenderingFiber?.updateQueue?.push(effect)
}
