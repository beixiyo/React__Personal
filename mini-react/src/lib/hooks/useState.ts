import { useReducer } from './useReducer'


/**
 * @param initialState 初始化状态
 */
export function useState<T>(initialState: T) {
    return useReducer(null, initialState)
}
