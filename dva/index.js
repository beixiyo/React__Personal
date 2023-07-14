import React, { useCallback, useState } from "react";
import { dva, connect } from "./dva1";
import { routerRedux, NavLink, Route, Switch } from "./dva1/router";
import dvaLoading from "./dva1/dvaLoading";


const counterModel = {
    namespace: "counter",
    state: 0,
    reducers: {
        increase(state) {
            return state + 1;
        },
        decrease(state) {
            return state - 1;
        },
        add(state, { payload }) {
            return state + payload;
        }
    },
    effects: {
        *asyncIncrease(action, { call, put }) {
            yield call(delay, 1000);
            // throw new Error("错误，测试");
            yield put({ type: "increase" });
        },
        *asyncDecrease(action, { call, put }) {
            yield call(delay, 1000);
            yield put({ type: "decrease" });
        }
    },
    subscriptions: {
        resizeIncrease({ dispatch }) {
            window.onresize = () => {
                dispatch({ type: "increase" });
            };
        },
        // `history`库有bug 会触发多次
        // resizeDecrease({ dispatch, history }) {
        //     history.listen(() => {
        //         dispatch({ type: "decrease" });
        //     });
        // }
    }
};

function delay(duration) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), duration);
    });
}

const Modal = () => (<div style={{
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    fontSize: '3em',
    textAlign: 'center',
    lineHeight: '100vh'
}}>加载中</div>);

const Home = () => <h1>首页</h1>;
const CounterComp = (props) => {
    const [num, setNum] = useState(0);
    const changeNum = useCallback((e) => {
        setNum(e.target.value);
    }, []);
    const onAdd = useCallback(() => {
        props.onAdd(+num);
    }, [num]);
    const onAsyncAdd = useCallback(() => {
        props.onAsyncAdd();
    }, [num]);

    return (<>
        <h3>{props.num}</h3>
        <input onChange={changeNum} defaultValue={num} type="number" />
        <button onClick={onAdd}>+</button>
        <button onClick={onAsyncAdd}>异步+</button>
        {props.isLoading && <Modal />}
    </>);
};

const mapState = (store) => ({
    num: store.counter,
    isLoading: store.loading.models.counter
});
const mapDispatch = (dispatch) => ({
    onAdd(payload) {
        dispatch({ type: 'counter/add', payload });
    },
    onAsyncAdd() {
        dispatch({ type: 'counter/asyncIncrease' });
    }
});
const Counter = connect(mapState, mapDispatch)(CounterComp);

const Router = ({ history }) => (
    <routerRedux.ConnectedRouter history={history}>
        <div>
            <p><NavLink to="/">首页</NavLink></p>
            <p><NavLink to="/counter">计数器</NavLink></p>
        </div>

        <div>
            <Switch>
                <Route path="/counter" component={Counter} />
                <Route path="/" component={Home} />
            </Switch>
        </div>
    </routerRedux.ConnectedRouter>
);



const app = dva({
    onError(err, dispatch) {
        console.log('错误详情:', { err, dispatch });
    },
    onAction: store => dispatch => action => {
        console.log('logger中间件上一次的值:', store.getState());
        dispatch(action);
        console.log('logger中间件新值', store.getState());
    },
    onStateChange(state, action) {
        console.log('onStateChange 改变前的值', { state, action });
    },
    onReducer(reducer) {
        return (state, action) => {
            console.log('重写onReducer');
            return reducer(state, action);
        };
    },
    // onEffect(effect, sagaEffects, model, actionType) {
    //     return function* (action) {
    //         console.log("重写onEffect");
    //         console.log({ effect, sagaEffects, model, actionType });
    //         yield effect(action);
    //     };
    // },
    // extraReducers: {
    //     extraReducer: (state = 'extraReducer', action) => state
    // },
    extraEnhancers: [
        (createStore) => (...args) => {
            console.log("重写createStore");
            return createStore(...args);
        }
    ]
});
app.router(Router);
app.model(counterModel);
app.use(dvaLoading());

app.start('#root');