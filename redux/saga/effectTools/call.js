import { isPromise } from "../../utils/reduxHelper.js"
import { createEffect, effectTypes } from "../effectHelper.js"


/** 创建 call effect */
export default function createCallEffect(fnOrCtxAndFn, ...args) {
    let ctx, func = fnOrCtxAndFn
    if (Array.isArray(fnOrCtxAndFn)) {
        [ctx, func] = fnOrCtxAndFn
    }

    const payload = { ctx, func, args }
    return createEffect(effectTypes.CALL, payload)
}

/** 执行 异步 */
export function runCallEffect(_env, effect, next) {
    const { func, args, ctx } = effect.payload,
        res = func.apply(ctx, args)

    if (isPromise(res)) {
        res
            .then(v => next(v))
            .catch(err => next(undefined, err))
    }
    else {
        next(res)
    }
}