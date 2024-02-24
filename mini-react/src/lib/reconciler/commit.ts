import { Flags, invokeHooks, isHTMLEl, updateNode } from '../share'
import { Fiber } from '../types'
import { Tag } from '../types/workTags'


/** 把传入 wip 的每个节点加入 DOM */
export function commitWorker(wipRoot: Fiber | null) {
    if (!wipRoot) return

    commitRootNode(wipRoot)
    commitWorker(wipRoot.child)
    commitWorker(wipRoot.sibling)
}

function getParentDOM(wip: Fiber) {
    let temp = wip
    while (temp) {
        if (temp.stateNode) return temp.stateNode
        temp = temp.return
    }
}

/** 更新 DOM 并加入真实节点 再执行 Hook */
function commitRootNode(wip: Fiber) {
    /** 节点可能是一个函数组件或者类组件 所以需要一直往上找到真实 DOM */
    const parentNodeDOM = getParentDOM(wip.return)
    const { flags, stateNode, alternate, props } = wip

    if (isHTMLEl(stateNode)) {
        if (flags & Flags.Placement) {
            parentNodeDOM?.appendChild(stateNode)
        }

        if (flags & Flags.Update && alternate?.props) {
            updateNode(stateNode, alternate.props, props)
        }

        if (wip.deletions) {
            commitDeletion(wip.deletions, stateNode || parentNodeDOM)
        }
    }

    if (wip.tag === Tag.FunctionComponent) {
        invokeHooks(wip)
    }
}

function commitDeletion(deletions: Fiber[], parentNode: HTMLElement) {
    for (let i = 0; i < deletions.length; i++) {
        const child = deletions[i]
        parentNode.removeChild(getStateNode(child))
    }
}

function getStateNode(fiber: Fiber) {
    let temp = fiber
    while (!temp.stateNode) {
        temp = temp.child!
    }
    return temp.stateNode
}
