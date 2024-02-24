import { ReactElement } from 'react'
import { Flags, isStrOrNum, isFn, isUndefined } from "../share"
import { Tag } from "../types/workTags"
import { Fiber, FiberType, FirstFiber } from '../types'


/**
 * @param vnode 当前的 vnode 节点
 * @param returnFiber 父 Fiber 节点
 */
export function createFiber(vnode: ReactElement | Fiber, returnFiber: FirstFiber): Fiber {
    const fiber = {
        type: vnode.type as FiberType,
        key: vnode.key,
        props: vnode.props,
        /** 存储当前的 fiber 对象所对应的 DOM 节点 */
        stateNode: null,
        child: null,
        sibling: null,
        /** 父 fiber */
        return: returnFiber as any,
        /** 该 fiber 对象要做的具体操作 */
        flags: Flags.Placement,
        index: null,
        /** 存储旧的 fiber 对象 */
        alternate: null,
        tag: Tag.Fragment,
        /** 存储 hook 数据 */
        memorizedState: null
    }

    const type = vnode.type
    if (isStrOrNum(type)) {
        // 原生标签
        fiber.tag = Tag.HostComponent
    }
    else if (isUndefined(type)) {
        // 说明这是一个文本节点
        fiber.tag = Tag.HostText
        // 文本节点是没有 props 属性的 手动的给该 fiber 设置一个 props 属性
        fiber.props = {
            children: vnode,
        }
    }
    else if (isFn(type)) {
        fiber.tag = Tag.FunctionComponent
    }
    else {
        fiber.tag = Tag.Fragment
    }

    return fiber
}
