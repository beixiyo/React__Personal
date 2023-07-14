export function getAction(action, namespace) {
    let newAction = action;
    if (!newAction.type.includes('/')) {
        newAction = {
            ...action,
            type: `${namespace}/${action.type}`,
        };
    }
    return newAction;
}