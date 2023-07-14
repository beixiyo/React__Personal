import { isPlainObject } from "./utils/reduxHelper.js";
import types from "./utils/ActionTypes.js";

export default function createStore(reducer, defaultState, middleWare) {
    /**
     * 如果第二个参数是函数 代表开启中间件
     * 中间件返回多层函数 接收`createStore`函数
     * 创建一个`store`对象 通过中间件增加功能
     */
    if (typeof defaultState === 'function') {
        middleWare = defaultState;
        defaultState = undefined;
        return middleWare(createStore)(reducer, defaultState);
    }

    let curState = defaultState;
    const listeners = new Set();

    // 初始化`state` 每个`reducer`默认返回值
    dispatch({ type: types.INIT });
    return {
        dispatch,
        getState,
        subscribe
    };

    function getState() {
        return curState;
    }

    function dispatch(action) {
        if (!isPlainObject(action)) {
            throw new TypeError('action must be a plain Object');
        }
        if (!action.type) {
            throw new TypeError('action must has a property of type');
        }

        curState = reducer(curState, action);
        run();
    }

    function subscribe(fn) {
        listeners.add(fn);
        return () => {
            listeners.delete(fn);
        };
    }

    function run() {
        for (const fn of listeners) {
            fn();
        }
    }
}