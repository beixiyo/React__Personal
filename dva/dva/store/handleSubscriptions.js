import { getAction } from "../utils/getAction";

export default function (modelArr, fns) {
    for (const model of modelArr) {
        const { subscriptions } = model;
        for (const key in subscriptions) {
            if (!Object.hasOwnProperty.call(subscriptions, key)) continue;

            const fn = subscriptions[key],
            dispatch = getDispatch(fns.dispatch, model.namespace)
            fn && fn({...fns, dispatch});
        }
    }
}


function getDispatch(dispatch, namespace) {
    return (action) => {
        const newAction = getAction(action, namespace)
        dispatch(newAction)
    }
}