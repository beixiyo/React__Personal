import { createEffect, effectTypes } from "../effectHelper.js";

export default function (actionType) {
    return createEffect(effectTypes.TAKE, { actionType });
}

export function runTaskEffect(env, effect, next) {
    const { actionType } = effect.payload,
        fn = action => next(action);
    // 把监听函数放进`channel` { actionType: [fn] }
    env.channel.take(actionType, fn)
}