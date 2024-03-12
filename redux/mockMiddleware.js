/**
 * 简单模拟中间件传递运行原理
 */

const middleware1 = store => dispatch => action => {
    console.log('fn1', store.getState())
    dispatch(action)
}
const middleware2 = store => dispatch => action => {
    console.log('fn2', store.getState())
    dispatch(action)
}

const reducer = (state = 0, action) => {
    switch (action.type) {
        case 'fn1':
            return 'fn1'
        case 'fn2':
            return 'fn2'
        default:
            return state
    }
}

function compose(fn1, fn2) {
    return (...args) => {
        /**
         * 这里的每个函数，是传递`store`之后的函数
         * 利用函数参数，把每个参数存起来，现在的函数结构如下
         * dispatch => action => { .... }
         * 也就是双层函数，外面可以拿到 store
         * 现在这个 compose 返回了一个函数，这个函数再接收一次 dispatch，那么就会把 dispatch 存起来传递给每个函数
         * 
         * 那么最后的函数结构就是 action => { ... }
         * 由于参数是 dispatch 函数，所以外面的函数需要等待里面的 dispatch 运行完毕，才能继续运行
         * 于是就形成了中间件逐层传递的效果
         * 
         * 这仅仅是简单的模拟，如果需要不限数量的中间件，可以使用循环，或者一个 Array.reduce 函数也行
         */
        return fn1(fn2(...args))
    }
}

function createStore(reducer, defaultState) {
    let curState = defaultState
    const dispatch = (action) => {
        curState = reducer(curState, action)
    }

    dispatch({ type: '@@INIT' })

    return {
        dispatch,
        getState: () => curState
    }
}

function applyMiddleware(...middlewares) {
    return function (createStore) {
        return function (reducer, defaultState) {
            const
                store = createStore(reducer, defaultState),
                middleWareArr = middlewares.map(middleware => middleware(store)),
                dispatch = compose(...middleWareArr)(store.dispatch)

            return {
                ...store,
                dispatch
            }
        }
    }
}


const store = applyMiddleware(middleware1, middleware2)(createStore)(reducer)
store.dispatch({ type: 'fn2' })
store.dispatch({ type: 'fn1' })
