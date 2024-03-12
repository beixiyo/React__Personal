import { createEffect, effectTypes } from "../effectHelper.js"
import { run } from "../sagaMiddleWare.js"


export default function createAllEffect(generatorFns) {
    if (!Array.isArray(generatorFns)) {
        throw new TypeError('param must be an Array<Generator>')
    }
    return createEffect(effectTypes.ALL, { generatorFns })
}

export function runAllEffect(env, effect, next) {
    const { generatorFns } = effect.payload
    if (generatorFns.length === 0) {
        next()
    }

    const tasks = generatorFns.map(g => run(env, g)),
        proArr = tasks.map(t => t.toPromise())
    /** 所有生成器完成后，才继续执行 主生成器 */
    Promise.all(proArr).then(() => next())
}
