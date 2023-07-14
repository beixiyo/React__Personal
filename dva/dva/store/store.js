import { createStore, combineReducers } from 'redux';
import { connectRouter } from "connected-react-router";


export default function getStore(modelArr, middleWare, opts) {
    let rootReducer = {};

    // 遍历每一个`model` 用每个`model`的命名空间 给对象赋值
    for (const model of modelArr) {
        const reducerObj = getReducer(model);
        rootReducer[reducerObj.name] = reducerObj.reducer;
    }

    rootReducer = combineReducers({ ...rootReducer, ...getExtraReducers(opts) });
    const oldReducer = rootReducer;
    rootReducer = (state, action) => {
        const newState = oldReducer(state, action);
        opts.onStateChange(state, action);
        return newState;
    };

    const oldReducer2 = rootReducer;
    rootReducer = opts.onReducer(oldReducer2);


    let newCreateStore = createStore;
    if (opts.extraEnhancers.length > 0) {
        const oldCreateStore = createStore;
        newCreateStore = opts.extraEnhancers.reduce((fn1, fn2) => fn2(fn1), oldCreateStore);
    }
    const store = newCreateStore(rootReducer, middleWare);
    window.store = store;

    return store;
}


function getReducer(model) {
    const { namespace, state: _state } = model;
    if (!namespace) {
        throw new Error('model must has a namespace property');
    }

    const mutationArr = [],
        { reducers } = model;
    // `model.reducers`的每个函数名 对应着`action.type`
    for (const actionType in reducers) {
        if (!Object.hasOwnProperty.call(reducers, actionType)) continue;

        let type = actionType;
        if (!type.includes('/')) {
            type = `${namespace}/${actionType}`;
        }
        mutationArr.push({
            type,
            reducer: reducers[actionType]
        });
    }

    return {
        name: namespace,
        reducer(state = _state, action) {
            // 找到`action.type`对应的`reducer` 返回执行结果
            const temp = mutationArr.find((item) => item.type === action.type);
            if (temp) {
                return temp.reducer(state, action);
            }
            else {
                return state;
            }
        }
    };
}


function getExtraReducers(opts) {
    return {
        router: connectRouter(opts.history),
        /* eslint-disable */
        ["@@dva"](state = 0, action) {
            return state;
        },
        ...opts.extraReducers
    };
}