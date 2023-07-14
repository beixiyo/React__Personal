/**
# dva插件

通过```dva对象.use(插件)```，来使用插件，插件本质上就是一个对象，该对象与配置对象相同，dva会在启动时，将传递的插件对象混合到配置中。

## dva-loading

该插件会在仓库中加入一个状态，名称为loading，它是一个对象，其中有以下属性

- global：全局是否正在处理副作用（加载），只要有任何一个模型在处理副作用，则该属性为true
- models：一个对象，对象中的属性名以及属性的值，表示哪个对应的模型是否在处理副作用中（加载中）
- effects：一个对象，对象中的属性名以及属性的值，表示是哪个action触发了副作用
 */


const NAMESPACE = 'loading',
    SHOW = '@@DVA_LOADING/SHOW',
    HIDE = '@@DVA_LOADING/HIDE';

export default function (opts = {}) {
    const namespace = opts.namespace || NAMESPACE;
    const initialState = {
        global: false,
        models: {},
        effects: {}
    };

    function reducer(state = initialState, action) {
        const { namespace, actionType } = action.payload || {};
        switch (action.type) {
            case SHOW:
                return {
                    global: true,
                    models: { ...state.models, [namespace]: true },
                    effects: { ...state.effects, [actionType]: true },
                };
            case HIDE:
                const models = { ...state.models, [namespace]: false },
                    effects = { ...state.effects, [actionType]: false },
                    global = Object.keys(models).some(key => models[key]);

                return {
                    global,
                    models,
                    effects,
                };

            default:
                return state;
        }
    }

    function onEffect(effect, { put }, model, actionType) {
        return function* (action) {
            yield put({
                type: SHOW,
                payload: {
                    namespace: model.namespace,
                    actionType
                }
            });

            yield effect(action);
            yield put({
                type: HIDE,
                payload: {
                    namespace: model.namespace,
                    actionType
                }
            });
        };
    }

    return {
        extraReducers: {
            [namespace]: reducer
        },
        onEffect
    };
}