import { scheduleCallback } from '../scheduler'
import { Fiber } from '../types'

export enum Flags {
    /** 没有任何操作 */
    NoFlags = 0b00000000000000000000,
    /** 节点新增、插入、移动 */
    Placement = 0b0000000000000000000010, // 2
    /** 节点更新属性 */
    Update = 0b0000000000000000000100, // 4
    /** 删除节点 */
    Deletion = 0b0000000000000000001000, // 8
}

export function isStrOrNum(s: any) {
    return typeof s === 'string' || typeof s === 'number'
}

export function isHTMLEl(el: any): el is HTMLElement {
    return el instanceof HTMLElement
}

export function isFn(fn: any) {
    return typeof fn === 'function'
}

export function isUndefined(s: any) {
    return s == undefined
}


/**
 * 更新 DOM 节点上的 props
 * @param node 真实的 DOM 节点
 * @param prevVal 旧值
 * @param nextVal 新值
 */
export function updateNode(
    node: HTMLElement,
    prevVal: Record<string, any>,
    nextVal: Record<string, any>
) {
    // 对旧值进行处理
    Object.keys(prevVal).forEach((k) => {
        const val = prevVal[k]

        if (k === 'children') {
            // 这里需要判断一下 children 是否是字符串
            // 如果是字符串 说明是文本节点 需要将其设置为空字符串
            if (isStrOrNum(val)) {
                node.textContent = ''
            }
        }
        else if (k.startsWith('on')) {
            let eventName = k.slice(2).toLowerCase()
            // 如果是 change 事件 那么背后绑定的是 input 事件
            if (eventName === 'change') {
                eventName = 'input'
            }
            node.removeEventListener(eventName, val)
        }
        else {
            // 普通的属性
            // 这里不能无脑的直接去除 应该检查一下新值中是否还有这个属性
            // 如果没有 再移除掉
            if (!(k in nextVal)) {
                (node as any)[k] = ''
            }
        }
    })

    // 对新值进行处理 流程基本和上面一样 只不过是反着操作
    Object.keys(nextVal).forEach((k) => {
        const val = nextVal[k]
        // 文本节点
        if (k === 'children') {
            if (isStrOrNum(val)) {
                node.textContent = val
            }
        }
        else if (k.startsWith('on')) {
            let eventName = k.slice(2).toLowerCase()
            if (eventName === 'change') {
                eventName = 'input'
            }

            node.addEventListener(eventName, val)
        } else {
            if (/^(classname|class)$/.test(k)) {
                k = 'className'
            }

            (node as any)[k] = val
        }
    })
}

/**
 * 比较两个依赖项数组的每一项是否相同
 * @param nextDeps 新的依赖项数组
 * @param prevDeps 旧的依赖项数组
 */
export function hookIsEqual<T extends any[]>(nextDeps: T, prevDeps: T) {
    if (prevDeps == null) return false

    for (
        let i = 0;
        i < prevDeps.length && i < nextDeps.length;
        i++
    ) {
        if (Object.is(nextDeps[i], prevDeps[i])) {
            continue
        }
        return false
    }
    return true
}

/**
 * 依次执行 fiber 对象中的 updateQueue 的副作用函数
 */
export function invokeHooks(wip: Fiber) {
    const { updateQueue } = wip
    if (!updateQueue) return

    for (let i = 0; i < updateQueue.length; i++) {
        const effect = updateQueue[i]

        if (effect.destroy) {
            effect.destroy()
        }

        scheduleCallback(() => {
            effect.destroy = effect.create()
        })
    }
}
