import { createEffect, effectTypes } from "../effectHelper.js"


export default function (task) {
    return createEffect(effectTypes.CANCEL, { task })
}

export function runCancelEffect(_env, { payload: { task } }, next) {
    task.cancel()
    next()
}
