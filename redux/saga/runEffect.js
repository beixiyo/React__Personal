import { effectTypes } from "./effectHelper.js"
import { runAllEffect } from "./effectTools/all.js"
import { runCallEffect } from "./effectTools/call.js"
import { runCancelEffect } from "./effectTools/cancel.js"
import { runForkEffect } from "./effectTools/fork.js"
import { runPutEffect } from "./effectTools/put.js"
import { runSelectEffect } from "./effectTools/select.js"
import { runTakeEffect } from "./effectTools/take.js"


/**
 * 用户 yield 模块里面的 createEffect  
 * 当 iterator.next 遇到 effect，则执行对应的 runEffect
 */
const effectFnMap = {
    [effectTypes.CALL]: runCallEffect,
    [effectTypes.PUT]: runPutEffect,
    [effectTypes.SELECT]: runSelectEffect,
    [effectTypes.TAKE]: runTakeEffect,
    [effectTypes.FORK]: runForkEffect,
    [effectTypes.CANCEL]: runCancelEffect,
    [effectTypes.ALL]: runAllEffect
}

export default function (env, effect, next) {
    const execEffect = effectFnMap[effect.type]
    if (!execEffect) {
        throw new Error('type invalid')
    }

    execEffect(env, effect, next)
}
