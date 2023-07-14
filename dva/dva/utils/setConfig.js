import { createHashHistory } from "history";


export function setConfig(opts) {
    let onAction;
    if (opts.onAction) {
        onAction = Array.isArray(opts.onAction)
            ? opts.onAction
            : [opts.onAction];
    }

    const defaultObj = {
        history: createHashHistory(),
        onError() { },
        onStateChange() { },
        onReducer: (reducer) => (state, action) => reducer(state, action)
    };
    onAction && (defaultObj.onAction = onAction);

    return Object.assign(defaultObj, opts);
}