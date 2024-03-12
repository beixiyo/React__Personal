export default class {
    listeners = {}

    /** 添加监听 */
    take(actionType, func) {
        this.listeners[actionType]
            ? this.listeners[actionType].add(func)
            : this.listeners[actionType] = new Set([func])

        return () => {
            this.listeners[actionType].delete(func)
        }
    }

    /** 触发监听 */
    put(actionType, ...args) {
        const tasks = this.listeners[actionType]
        if (!tasks) {
            return
        }

        // 必须先删除再执行回调，否则`takeEvery`产生的回调会一直添加新函数
        delete this.listeners[actionType]
        for (const fn of tasks) {
            fn(...args)
        }
    }
}