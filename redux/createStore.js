import { isPlainObject } from "./utils/reduxHelper.js"
import types from "./utils/actionTypes.js"


/**
 * @param { Function } reducer reducer
 * @param { any } defaultState 默认的状态值或者中间件
 * @param { Function } enhanced 中间件
 */
export default function createStore(reducer, defaultState, enhanced) {
    /**
     * 如果第二个参数是函数 代表开启中间件
     * 中间件返回多层函数 接收`createStore`函数
     * 创建一个`store`对象 通过中间件增加功能
     */
    if (typeof defaultState === 'function') {
        enhanced = defaultState
        defaultState = undefined
    }
    if (typeof enhanced === 'function') {
        return enhanced(createStore)(reducer, defaultState)
    }

    let curState = defaultState
    const listeners = new Set()

    // 初始化`state`，获取仓库的所有初始值
    dispatch({ type: types.INIT })

    return {
        dispatch,
        getState,
        subscribe
    }

    function getState() {
        return curState
    }

    function dispatch(action) {
        if (!isPlainObject(action)) {
            throw new TypeError('action must be a plain Object')
        }
        if (!action.type) {
            throw new TypeError('action must has a property of type')
        }
        
        curState = reducer(curState, action)
        runListener()
    }

    function subscribe(fn) {
        listeners.add(fn)
        return () => {
            listeners.delete(fn)
        }
    }

    function runListener() {
        for (const fn of listeners) {
            fn()
        }
    }
}