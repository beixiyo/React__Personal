import { isPlainObject } from "./utils/reduxHelper.js"


/**
 * 接收一个 action 函数或者对象，以及 store.dispatch 函数
 * @param { Record<string, () => { type: string | symbol, payload?: any }> } actionFns 
 * @param { ( action: string | symbol ) => void } dispatch 
 * @returns 返回一个映射表，每个键对应一个 dispatch
 */
export default function (actionFns, dispatch) {
    if (typeof actionFns === 'function') {
        return getDispatcher(actionFns, dispatch)
    }
    else if (isPlainObject(actionFns)) {
        const actionMap = {}
        for (const key in actionFns) {
            if (!Object.hasOwnProperty.call(actionFns, key)) continue

            const action = actionFns[key]
            actionMap[key] = getDispatcher(action, dispatch)
        }
        return actionMap
    }
    else {
        throw new TypeError('actions must be an object or function')
    }
}

/** 处理 action 是单个函数的情况 */
function getDispatcher(genActionFn, dispatch) {
    return function (...args) {
        dispatch(genActionFn(...args))
    }
}
