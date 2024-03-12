export const SAGA_FLAG = Symbol('@@redux-saga/IO')

export const effectTypes = {
    CALL: Symbol('CALL'),
    TAKE: Symbol('TAKE'),
    FORK: Symbol('FORK'),
    ALL: Symbol('ALL'),
    PUT: Symbol('PUT'),
    SELECT: Symbol('SELECT'),
    CANCEL: Symbol('CANCEL'),
    TAKE_EVERY: Symbol('TAKE_EVERY')
}

export function isEffect(obj) {
    return !!obj?.[SAGA_FLAG]
}

/** 创建统一格式的 effect */
export function createEffect(type, payload) {
    if (!Object.values(effectTypes).includes(type)) {
        throw new TypeError('type is invalid')
    }

    return {
        [SAGA_FLAG]: true,
        type,
        payload
    }
}

