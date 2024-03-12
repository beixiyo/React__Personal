import { createEffect, effectTypes } from "../effectHelper.js"
import { runSaga } from "../sagaMiddleWare.js"


export default function createForkEffect(generatorFn, ...args) {
    return createEffect(effectTypes.FORK, { generatorFn, args })
}

/**
 * fork 实际上是创建一个新的 **生成器**，不会阻塞
 */
export function runForkEffect(env, { payload: { generatorFn, args } }, next) {
    const task = runSaga(env, generatorFn, ...args)
    next(task)
}
