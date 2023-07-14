import { createEffect, effectTypes } from "../effectHelper.js";
import { runSaga } from "../sagaMiddleWare.js";

export default function (generatorFn, ...args) {
    return createEffect(effectTypes.FORK, { func: generatorFn, args });
}

export function runForkEffect(env, { payload: { func, args } }, next) {
    const task = runSaga(env, func, ...args);
    next(task);
}