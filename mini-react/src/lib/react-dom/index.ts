import { ReactElement } from 'react'
import { createFiber } from "../reconciler/fiber"
import { HTMLTag } from '../types'
import { scheduleUpdateOnFiber } from '../reconciler/fiberWorkLoop'


class ReactDOMRoot {
    constructor(private container: HTMLElement) {
    }

    render(vnode: ReactElement) {
        const fiber = createFiber(
            vnode,
            {
                type: this.container.nodeName.toLowerCase() as HTMLTag,
                stateNode: this.container,
            }
        )
        scheduleUpdateOnFiber(fiber)
    }
}

export const ReactDOM = {
    createRoot(container: HTMLElement) {
        return new ReactDOMRoot(container)
    },
}
