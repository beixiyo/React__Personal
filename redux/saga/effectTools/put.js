import { createEffect, effectTypes } from "../effectHelper.js"


/** 创建 put effect */
export default function createPutEffect(action) {
    return createEffect(effectTypes.PUT, { action })
}

/** 执行 action */
export function runPutEffect(env, effect, next) {
    const { action } = effect.payload
    next(env.store.dispatch(action))
}
