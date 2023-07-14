import { effectTypes } from "./effectHelper.js";
import { runAllEffect } from "./effectTools/all.js";
import { runCallEffect } from "./effectTools/call.js";
import { runCancelEffect } from "./effectTools/cancel.js";
import { runForkEffect } from "./effectTools/fork.js";
import { runPutEffect } from "./effectTools/put.js";
import { runSelectEffect } from "./effectTools/select.js";
import { runTaskEffect } from "./effectTools/take.js";


const effectFnMap = {
    [effectTypes.CALL]: runCallEffect,
    [effectTypes.PUT]: runPutEffect,
    [effectTypes.SELECT]: runSelectEffect,
    [effectTypes.TAKE]: runTaskEffect,
    [effectTypes.FORK]: runForkEffect,
    [effectTypes.CANCEL]: runCancelEffect,
    [effectTypes.ALL]: runAllEffect
};

export default function (env, effect, next) {
    const task = effectFnMap[effect.type];
    if (!task) {
        throw new Error('type invalid')
    }

    task(env, effect, next)
}