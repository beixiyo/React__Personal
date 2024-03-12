import { getType, isPromise } from "../utils/reduxHelper.js"
import Task from "./Task.js"
import Channel from "./Channel.js"
import { isEffect } from "./effectHelper.js"
import runEffect from "./runEffect.js"


export default function () {
    return function sagaMiddleWare(store) {
        const env = {
            store,
            channel: new Channel()
        }
        sagaMiddleWare.run = runSaga.bind(null, env)

        return function (dispatch) {
            return function (action) {
                const res = dispatch(action)
                /**
                 *  检查`action.type`是否在监听
                 *  触发监听函数，传入`action`，调用`next(action)`继续
                 */
                env.channel.put(action.type, action)
                return res
            }
        }
    }
}

/**
 * 执行 saga
 * @param {*} env store 仓库的数据
 * @param {*} generatorFn 生成器，里面 yield 一定是 创建指令，在 './effectTools' 包下的默认导出
 * @param  {...any} args 传递给生成器的参数
 */
export function runSaga(env, generatorFn, ...args) {
    const iterator = generatorFn(...args)
    if (getType(generatorFn) === 'generatorfunction') {
        return run(env, iterator)
    }
    else {
        console.log("一个普通函数")
    }
}

export function run(env, iterator) {
    const resolveObj = { resolve: null }
    next()
    return new Task(next, resolveObj)

    /** 把迭代器 递归运行完 */
    function next(nextVal, err, isOver) {
        let res
        if (err) {
            res = iterator.throw(err)
        }
        else if (isOver) {
            resolveObj.resolve?.()
            res = iterator.return()
        }
        else {
            res = iterator.next(nextVal)
        }

        const { value, done } = res
        if (done) {
            resolveObj.resolve?.()
            return
        }

        /** 处理 saga 指令情况，执行指令返回的固定对象，根据不同 type 处理 */
        if (isEffect(value)) {
            /** next 传递下去，让内部继续执行生成器并返回值 */
            runEffect(env, value, next)
        }
        else if (isPromise(value)) {
            value.then(val => next(val))
                .catch(err => next(undefined, err))
        }
        else {
            next(value)
        }
    }
}