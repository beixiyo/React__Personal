export default class Task {
    constructor(next, resolveObj) {
        this.next = next
        this.resolveObj = resolveObj

        /** run 函数里结束运行时，会调用 resolve */
        this.resolveObj.resolve = () => {
            this.resolve?.()
        }
    }

    cancel() {
        // function next(nextVal, err, isOver)
        this.next(undefined, undefined, true)
    }

    toPromise() {
        return new Promise((resolve) => {
            this.resolve = resolve
        })
    }
}
