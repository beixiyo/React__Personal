export default class Task {
    constructor(next, resolveObj) {
        this.next = next;
        this.resolveObj = resolveObj;
        this.resolveObj.resolve = () => {
            this.resolve && this.resolve();
        };
    }

    cancel() {
        // function next(nextVal, err, isOver)
        this.next(undefined, undefined, true);
    }

    toPromise() {
        return new Promise((resolve) => {
            this.resolve = resolve;
        });
    }
}
