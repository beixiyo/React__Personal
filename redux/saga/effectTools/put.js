import { createEffect, effectTypes } from "../effectHelper.js";

export default function (action) {
    return createEffect(effectTypes.PUT, { action });
}

export function runPutEffect(env, effect, next) {
    const { action } = effect.payload;
    next(env.store.dispatch(action));
}