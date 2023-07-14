import * as sagaEffects from "../saga";
import { getAction } from "../utils/getAction";


export default function (saga, modelArr, opts, dispatch) {
    const arr = [];
    // 获取每个`model.effects`
    for (const model of modelArr) {
        const { effects } = model,
            put = getSagaPut(model.namespace);

        for (const key in effects) {
            if (!Object.hasOwnProperty.call(effects, key)) continue;

            const generatorFn = effects[key];
            generatorFn && arr.push({
                type: `${model.namespace}/${key}`,
                generatorFn,
                put,
                model
            });
        }
    }

    saga.run(function* () {
        for (const item of arr) {
            let fn = function* (action) {
                try {
                    yield item.generatorFn(action, { ...sagaEffects, put: item.put });
                } catch (error) {
                    opts.onError(error, dispatch);
                }
            };

            if (opts.onEffect) {
                let oldFn = fn;
                fn = opts.onEffect(oldFn, sagaEffects, item.model, item.type);
            }

            yield sagaEffects.takeEvery(item.type, fn);
        }
    });
}


function getSagaPut(namespace) {
    return (action) => {
        const newAction = getAction(action, namespace);
        return sagaEffects.put(newAction);
    };
}