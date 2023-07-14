export default function (...middleWares) {
    return function (createStore) {
        return function (reducer, defaultState) {
            const store = createStore(reducer, defaultState),
            middleWareArr = middleWares.map(fn => fn(store)),
            dispatch = compose(middleWareArr, store.dispatch)

            return {
                ...store,
                dispatch
            }
        };
    };
}


/**
 * 组合每个中间件
 * @param {Array} middleWareArr 
 * @param {function} dispatch 
 * @returns {function}
 */
function compose(middleWareArr, dispatch) {
    if (middleWareArr.length === 1) {
        return middleWareArr[0](dispatch)
    }
    /**
     * const logger = store => dispatch => action => {
     *     console.log({ action, state: store.getState() });
     *     dispatch(action);
     *     console.log('之后的数据：', store.getState());
     * };
     * 
     * 这里得到的每个函数 是传递`store`之后的函数
     * 把每个函数组合传递 再把`dispatch`传给这个函数
     * 得到的每一个函数 就都是同一个`dispatch`分发的
     * 最终的函数结果仅需要传递`action`
     */
    return middleWareArr.reduce((a, b) => (...args) => a(b(...args)))(dispatch)
}