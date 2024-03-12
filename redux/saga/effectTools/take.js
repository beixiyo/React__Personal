import { createEffect, effectTypes } from "../effectHelper.js"


/** 
 * 创建 take effect  
 * 这个 actionType 和用户的 redux Action.type 一样
 */
export default function createTakeEffect(actionType) {
    return createEffect(effectTypes.TAKE, { actionType })
}

/**
 * 仅仅监听一次 actionType，然后取消监听
 * 订阅 actionType，这个 actionType 和用户的 redux Action.type 一样  
 * 中间件里每一轮，都会触发 channel.put(action.type, action)
 */
export function runTakeEffect(env, effect, next) {
    const { actionType } = effect.payload,
        /** next 把 action 传回用户的 yield */
        fn = action => next(action)
    // 把监听函数放进`channel` { actionType: [fn] }
    env.channel.take(actionType, fn)
}
