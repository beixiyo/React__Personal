import actionTypes from "./utils/actionTypes.js";
import { isPlainObject } from "./utils/reduxHelper.js";

export default function (reducers) {
    validateReducers(reducers);

    return function (state = {}, action) {
        const _state = {};
        for (const key in reducers) {
            if (!Object.hasOwnProperty.call(reducers, key)) continue;

            const reduce = reducers[key];
            _state[key] = reduce(state[key], action);
        }
        return _state;
    };
}

function validateReducers(reducers) {
    if (!isPlainObject(reducers)) {
        throw new TypeError('reducers must be a plain object');
    }

    for (const key in reducers) {
        if (!Object.hasOwnProperty.call(reducers, key)) continue;

        const reduce = reducers[key];
        if (reduce(undefined, actionTypes.init) === undefined) {
            throw new Error('reduce must not return undefined');
        }
    }
}