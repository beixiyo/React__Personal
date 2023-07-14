import { createEffect, effectTypes } from "../effectHelper.js";
import { proc } from "../sagaMiddleWare.js";

export default function (generatorFns) {
    if (!Array.isArray(generatorFns)) {
        throw new TypeError('param must be an Array<Generator>');
    }
    return createEffect(effectTypes.ALL, { generatorFns });
}

export function runAllEffect(env, effect, next) {
    const { generatorFns } = effect.payload;
    if (generatorFns.length === 0) {
        next();
    }

    const tasks = generatorFns.map(g => proc(env, g)),
        proArr = tasks.map(t => t.toPromise());
    Promise.all(proArr).then(() => next());
}