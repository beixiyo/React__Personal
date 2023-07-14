export function isPlainObject(obj) {
    return typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
}

export function getRadomStr(num) {
    return Math.random().toString(36).slice(2, num + 2).split('').join('.');
}

export function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

export function isPromise(promise) {
    return typeof promise?.then === 'function';
}