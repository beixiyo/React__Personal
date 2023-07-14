import { isPromise } from "../../utils/reduxHelper.js";
import { createEffect, effectTypes } from "../effectHelper.js";

export default function (fn, ...args) {
    let ctx, func = fn;
    if (Array.isArray(fn)) {
        [ctx, func] = fn;
    }

    return createEffect(effectTypes.CALL, {
        ctx, func, args
    });
}

export function runCallEffect(env, effect, next) {
    const { func, args, ctx } = effect.payload,
        res = func.apply(ctx, args);

    if (isPromise(res)) {
        res.then(v => next(v))
    }
    else {
        next(res)
    }
}