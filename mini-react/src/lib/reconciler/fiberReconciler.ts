import { renderWithHooks } from '../hooks/hook'
import { updateNode } from '../share'
import { Fiber } from '../types'
import { reconcileChildren } from './childFiber'


export function updateHostComponent(wip: Fiber) {
    // 1. 创建真实的 DOM 节点对象
    if (!wip.stateNode) {
        if (typeof wip.type !== 'string') return

        wip.stateNode = document.createElement(wip.type)
        updateNode(wip.stateNode, {}, wip.props)
    }

    reconcileChildren(wip, wip.props.children)
    // 执行完后 Fiber 链表已形成
}

export function updateHostTextComponent(wip: Fiber) {
    wip.stateNode = document.createTextNode(wip.props.children)
}

export function updateFuncComponent(wip: Fiber) {
    renderWithHooks(wip)

    const { props, type } = wip
    const children = (type as Function)(props)
    reconcileChildren(wip, children)
}
