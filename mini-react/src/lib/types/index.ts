import { Flags } from '../share'
import { Tag } from './workTags'


export interface Fiber {
    type?: FiberType
    key: string | null
    /** 添加的`DOM`属性  以及一个`children` 类型为 `string | Fiber[]` */
    props: FiberProp
    /** 存储当前的 fiber 对象所对应的 DOM 节点 */
    stateNode: null | HTMLElement | Text
    child: null | Fiber
    sibling: null | Fiber
    /** 父 fiber */
    return: Fiber
    /** 该 fiber 对象要做的具体操作 */
    flags: Flags
    index: null | number
    /** 存储旧的 fiber 对象 */
    alternate: null | Fiber
    tag: Tag
    deletions?: Fiber[] | null
    /** 存储 hook 数据 */
    memorizedState: null | Hook
    /** 副作用函数数组 */
    updateQueue?: Effect[]
}

export interface FiberProp {
    /** 类型为 `string | Fiber[]` */
    children?: any
    [K: string]: any
}

export interface Hook {
    next: null | Hook
    memorizedState: any
}

export interface Effect {
    /** 回调函数 */
    create: Function
    /** 清理函数 */
    destroy: Function
    /** 依赖数组 */
    deps: any[]
}

export type FirstFiber = Pick<Fiber, 'type' | 'stateNode'>

export type HTMLTag = keyof HTMLElementTagNameMap

export type FiberType = HTMLTag | React.JSXElementConstructor<any>