import {
    bindActionCreators,
    createStore,
    combineReducers,
    applyMiddleware
} from "../index.js"
import takeEvery from "../saga/effectTools/takeEvery.js"
import {
    sagaMiddleWare,
    call,
    delay,
    put,
    select,
    take,
    fork,
    cancel,
    all
} from "../saga/index.js"


/** ===================== action ===================== */
const actionTypes = {
    DECREASE: Symbol('DECREASE'),
    INCREASE: Symbol('INCREASE'),
    LOGIN: Symbol('LOGIN')
}

const decreaseAction = (payload) => ({ type: actionTypes.DECREASE, payload })
const increaseAction = (payload) => ({ type: actionTypes.INCREASE, payload })
const loginAction = (payload) => ({ type: actionTypes.LOGIN, payload })

const actions = {
    decrease: decreaseAction,
    increase: increaseAction,
    login: loginAction
}


/** ===================== reducer ===================== */
const counter = (state = 1, { type, payload }) => {
    switch (type) {
        case actionTypes.DECREASE:
            return state - payload
        case actionTypes.INCREASE:
            return state + payload

        default:
            return state
    }
}
const login = (state = false, { type, payload }) => {
    switch (type) {
        case actionTypes.LOGIN:
            return payload

        default:
            return state
    }
}


/** ===================== 测试中间件 ===================== */
const logger1 = store => dispatch => action => {
    console.log('中间件1 之前的数据')
    console.log({ action, state: store.getState() })
    dispatch(action)
    console.log('中间件1 之后的数据：')
    console.log(store.getState())
}
const logger2 = store => dispatch => action => {
    console.log('中间件2 之前的数据')
    console.log({ action, state: store.getState() })
    dispatch(action)
    console.log('中间件2 之后的数据：')
    console.log(store.getState())
}


/** ===================== sagaMiddleWare ===================== */
const
    saga = sagaMiddleWare(),
    reducers = combineReducers({ counter, login }),
    store = createStore(reducers, applyMiddleware(saga)),
    actionMap = bindActionCreators(actions, store.dispatch)

window.store = store


/** ===================== Test Action ===================== */
actionMap.increase(10)
actionMap.decrease(1)
actionMap.login(true)


/** ===================== Test saga ===================== */
function callTest(...args) {
    console.log('callTest:', this)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(args)
        }, 500)
    })
}

function* forkFn(p1, p2) {
    while (true) {
        yield take(actionTypes.INCREASE)
        yield delay(1000)
        yield put(increaseAction(1))
        console.log(yield select())
        console.log('forkFn: ', { p1, p2 })
    }
}

function* takeEveryFn(p1, p2, action) {
    console.log('takeEveryFn')
    console.log({ p1, p2, action })
    yield put(increaseAction(20))
    console.log(yield select())
}

function* testAll() {
    console.log('all running ... ')
}

const actionArr = [
    (function* () {
        const task = yield takeEvery(actionTypes.INCREASE, testAll)
        yield delay(2000)
        yield cancel(task)
    })(),
    (function* () {
        const task = yield takeEvery(actionTypes.DECREASE, testAll)
        yield delay(2000)
        yield cancel(task)
    })()
]

const rootSaga = function* () {
    /** 等待所有生成器执行完毕，才继续执行，测试 生成器 不阻塞 */
    yield all(actionArr)
    console.log('运行完毕', yield select())

    /**
     * 一直监听某个`actionType`，每次监听到触发函数
     * 后面的多个参数，作为形参传入第二个函数，action 始终是最后一个参数
     */
    const takeEveryTask = yield takeEvery(actionTypes.INCREASE, takeEveryFn, 'p1', 'p2')

    /**
     * 开启一个新的`runSaga` 并调用`next` 不会阻塞
     * 传入一个生成器函数 后面的多个参数作为函数形参
     * 返回一个`task`对象 调用`task.cancel`停止`saga`
     */
    const forkTask = yield fork(forkFn, 'p1', 'p2')
    console.log('fork运行完成', { forkTask })
    window.cancel = forkTask.cancel.bind(forkTask)

    /**
     * `cancel`传入一个任务对象 用于停止任务
     * `cancel`内部调用`task.next(undefined, undefined, true)`
     */
    yield delay(1000)
    yield cancel(forkTask)
    console.log('fork任务已取消')


    // `take` 监听某个`actionType`，执行`action`时调用`next`继续运行迭代器
    const action = yield take(actionTypes.INCREASE)
    console.log('actionTypes.INCREASE运行了', { action })

    // call 遇到`Promise`等待完成，普通函数直接运行
    let a = yield call(['@@this', callTest], 'promise1', 'promise2')
    console.log(a)

    // 封装的`call`函数，内部使用 `Promise` & `setTimeout`
    yield delay(1000)
    console.log('delay ok')

    // `put`用于派发`action`
    yield put(decreaseAction(10))

    // 获取`state`
    const state = yield select(state => state.counter)
    console.log(state)
}
saga.run(rootSaga)


window.add = num => store.dispatch(increaseAction(num))
window.sub = num => store.dispatch(decreaseAction(num))
