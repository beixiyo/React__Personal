import { getType, isPromise } from "../utils/reduxHelper.js";
import Task from "./Task.js";
import Channel from "./Channel.js";
import { isEffect } from "./effectHelper.js";
import runEffect from "./runEffect.js";

export default function () {
    return function sagaMiddleWare(store) {
        const env = {
            store,
            channel: new Channel()
        };
        sagaMiddleWare.run = runSaga.bind(null, env);

        return function (dispatch) {
            return function (action) {
                const res = dispatch(action);
                /**
                 *  检查`action.type`是否在监听
                 *  触发监听函数 传入`action` 调用`next(action)`继续
                 */
                env.channel.put(action.type, action);
                return res;
            };
        };
    };
};

export function runSaga(env, generatorFn, ...args) {
    const iterator = generatorFn(...args);
    if (getType(generatorFn) === 'generatorfunction') {
        return proc(env, iterator);
    }
    else {
        console.log("一个普通函数");
    }
}

export function proc(env, iterator) {
    const resolveObj = { resolve: null };
    next();
    return new Task(next, resolveObj);

    function next(nextVal, err, isOver) {
        let res;
        if (err) {
            res = iterator.throw(err);
        }
        else if (isOver) {
            resolveObj.resolve && resolveObj.resolve()
            res = iterator.return();
        }
        else {
            res = iterator.next(nextVal);
        }

        const { value, done } = res;
        if (done) {
            resolveObj.resolve && resolveObj.resolve();
            return;
        };

        if (isEffect(value)) {
            runEffect(env, value, next);
        }
        else if (isPromise(value)) {
            value.then(val => next(val))
                .catch(err => next(undefined, err));
        }
        else {
            next(value);
        }
    }
}