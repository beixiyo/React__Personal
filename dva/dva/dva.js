import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import getStore from './store/store';
import getMiddleWare from './store/getMiddleWare';
import handleSaga from './store/handleSaga';
import handleSubscriptions from './store/handleSubscriptions';
import { setConfig } from './utils/setConfig';


export default function (opts = {}) {
    opts = setConfig(opts);
    const [saga, middleWare] = getMiddleWare(opts);
    const app = {
        model,
        _modelArr: [],
        router,
        _router: null,
        start,
        use
    };

    return app;

    function model(modelObj) {
        app._modelArr.push(modelObj);
    }

    function router(routerFn) {
        app._router = routerFn;
    }

    function start(root) {
        const store = getStore(app._modelArr, middleWare, opts);
        handleSaga(saga, app._modelArr, opts, store.dispatch);
        handleSubscriptions(app._modelArr, {
            dispatch: store.dispatch,
            history: opts.history
        });

        _render(root, store);
    }

    function _render(root, store) {
        const routerConfig = app._router({ history: opts.history }),
            App = (
                <Provider store={store}>
                    {routerConfig}
                </Provider>
            );

        ReactDOM.render(App, document.querySelector(root));
    }

    function use(plugin) {
        opts = {
            ...opts, ...plugin,
        };
    }
}