import { isPlainObject } from "./utils/reduxHelper.js";

export default function (actions, dispatch) {
    if (typeof actions === 'function') {
        return getDispatcher(actions, dispatch);
    }
    else if (isPlainObject(actions)) {
        const actionMap = {};
        for (const key in actions) {
            if (!Object.hasOwnProperty.call(actions, key)) continue;

            const action = actions[key];
            actionMap[key] = getDispatcher(action, dispatch);
        }
        return actionMap;
    }
    else {
        throw new TypeError('actions must be an object or function');
    }
}

function getDispatcher(actionFn, dispatch) {
    return function (...args) {
        dispatch(actionFn(...args));
    };
}