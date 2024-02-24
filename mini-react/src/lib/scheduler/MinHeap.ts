/** 最小堆算法 */
export class MinHeap<T extends {
    sortIndex: number
}> {
    readonly data: T[]

    constructor() {
        this.data = []
    }

    push(item: T) {
        const { data } = this
        data.push(item)

        // 向上交换
        let curIndex = data.length - 1
        while (curIndex > 0) {
            const [parent, parentIndex] = this.getParent(curIndex)

            if (item.sortIndex < parent.sortIndex) {
                this.swap(curIndex, parentIndex)
                curIndex = parentIndex
            }
            else {
                break
            }
        }
    }

    pop() {
        const { data } = this
        if (data.length <= 1) {
            return data.pop()
        }

        const first = data[0],
            last = data.pop()!
        data[0] = last

        if (first.sortIndex === last.sortIndex) {
            return last
        }

        let curIndex = 0
        while (curIndex < data.length) {
            let minIndex = curIndex
            const
                [left, leftIndex] = this.getLeft(curIndex),
                [right, rightIndex] = this.getRight(curIndex),
                curItem = data[curIndex]

            if (
                leftIndex < data.length &&
                left.sortIndex < curItem.sortIndex
            ) {
                minIndex = leftIndex
            }

            if (
                rightIndex < data.length &&
                right.sortIndex < data[minIndex].sortIndex
            ) {
                minIndex = rightIndex
            }

            if (minIndex === curIndex) {
                break
            }

            this.swap(curIndex, minIndex)
            curIndex = minIndex
        }

        return last
    }

    private getParent(index: number): [T, number] {
        const i = Math.floor((index - 1) / 2)
        return [this.data[i], i]
    }

    private getLeft(index: number): [T, number] {
        const i = index * 2 + 1
        return [this.data[i], i]
    }

    private getRight(index: number): [T, number] {
        const i = index * 2 + 2
        return [this.data[i], i]
    }

    private swap(i: number, j: number) {
        let temp = this.data[i]
        this.data[i] = this.data[j]
        this.data[j] = temp
    }

    get size() {
        return this.data.length
    }

    isEmpty() {
        return this.data.length === 0
    }

    peek() {
        return this.data[0]
    }
}
