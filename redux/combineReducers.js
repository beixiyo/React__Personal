import actionTypes from "./utils/actionTypes.js"
import { isPlainObject } from "./utils/reduxHelper.js"


/**
 * 利用闭包，把 reducers 对象的函数保存起来  
 * 返回一个给 store 重新赋值的函数  
 * 该函数会挨个调用 reducers，如果不是对应的 action，就返回 store 原来的值兜底  
 * 如果是对应的 action，就返回 reducer 对应 action 的返回值
 * @param { Record<string, function> } reducers 
 * @returns 一个函数，接收一个 store 和一个 action，返回一个新的 store
 */
export default function (reducers) {
    validateReducers(reducers)

    return function (state = {}, action) {
        const store = {}
        for (const key in reducers) {
            if (!Object.hasOwnProperty.call(reducers, key)) continue

            const reducer = reducers[key]
            /**
             * 找到对应的 reducer，把当前仓库的值传递过去  
             * 默认是 undefined，所以 reducer 必须有兜底值
             * 然后触发 dispatch 更新仓库的值
             */
            store[key] = reducer(state[key], action)
        }
        return store
    }
}

/**
 * 检验`reducers`返回值不为`undefined`  
 * 确保初始化`state`不为`undefined`
 */
function validateReducers(reducers) {
    if (!isPlainObject(reducers)) {
        throw new TypeError('reducers must be a plain object')
    }

    for (const key in reducers) {
        if (!Object.hasOwnProperty.call(reducers, key)) continue

        const reduce = reducers[key]
        if (reduce(undefined, actionTypes.INIT) === undefined) {
            throw new Error('reduce must not return undefined')
        }
    }
}
