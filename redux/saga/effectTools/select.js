import { createEffect, effectTypes } from "../effectHelper.js";

export default function (func) {
    return createEffect(effectTypes.SELECT, { func });
}

export function runSelectEffect(env, { payload: { func } }, next) {
    let state = env.store.getState();
    if (func && typeof func !== 'function') {
        throw TypeError('param must be undefined or function');
    }
    else if (func) {
        state = func(state);
    }
    next(state);
}