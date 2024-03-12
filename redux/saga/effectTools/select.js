import { createEffect, effectTypes } from "../effectHelper.js"


/** 创建 select effect */
export default function createSelectEffect(func) {
    return createEffect(effectTypes.SELECT, { func })
}

/**
 * select 指令接收一个函数，若有函数  
 * 则根据函数筛选 store 的数据返回
 * 没有则返回 store 的数据
 */
export function runSelectEffect(env, { payload: { func } }, next) {
    let state = env.store.getState()

    if (func && typeof func !== 'function') {
        throw TypeError('param must be undefined or function')
    }
    if (func) {
        state = func(state)
    }
    next(state)
}
