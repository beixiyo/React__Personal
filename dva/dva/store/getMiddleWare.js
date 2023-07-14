import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "connected-react-router";


export default function (opts) {
    const saga = createSagaMiddleware(),
        midArr = [saga, routerMiddleware(opts.history), opts.onAction];

    return [
        saga,
        // `composeWithDevTools`开启`redux`浏览器插件
        composeWithDevTools(applyMiddleware(...midArr))
    ];
}