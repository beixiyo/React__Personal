import { MinHeap } from './MinHeap'


/** 过期时间 这里模拟一下 */
const TIME_OUT = -1,
    TICK = 1000 / 60

let taskIdCounter = 1
const taskQueue = new MinHeap<Task>()
const { port1, port2 } = new MessageChannel()


port2.onmessage = function () {
    hasIdleRun(runTask)
}

/**
 * 生成一个宏任务 在空闲时执行
 * @param callback 更新 DOM 执行的回调
 */
export function scheduleCallback(callback: Task['callback']) {
    const task = genTask(callback)
    taskQueue.push(task)
    /** 接下来请求调度 这样会产生一个宏任务 */
    port1.postMessage(null)
}

/** 执行任务 直到没有空闲时间 */
function runTask(hasIdle: HasIde) {
    let curTask = taskQueue.peek()
    const now = performance.now()

    while (curTask) {
        if (!hasIdle(now)) {
            return
        }

        curTask.callback()
        taskQueue.pop()
        curTask = taskQueue.peek()
    }
}

/** 根据开始时间 算出当前是否空闲 */
function hasIdleRun(runTask: (hasIdle: HasIde) => void) {
    runTask((st) => performance.now() - st < TICK)
}

function genTask(callback: Task['callback']) {
    const expirationTime = performance.now() + TIME_OUT

    return {
        id: taskIdCounter++,
        callback,
        expirationTime,
        sortIndex: expirationTime, // 根据这个 sortIndex 决定执行优先级
    }
}

interface Task {
    id: number
    callback: Function
    expirationTime: number
    sortIndex: number
}

type HasIde = (st: number) => boolean
