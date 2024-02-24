import { Fiber } from '../types'
import { Tag } from '../types/workTags'
import { updateFuncComponent, updateHostComponent, updateHostTextComponent } from './fiberReconciler'


/**
 * 根据 fiber 不同的 tag 值，调用不同的方法来处理
 */
export function beginWork(wip: Fiber) {
    const tag = wip.tag

    switch (tag) {
        case Tag.HostComponent: {
            updateHostComponent(wip)
            break
        }
        case Tag.FunctionComponent: {
            updateFuncComponent(wip)
            break
        }
        case Tag.HostText: {
            updateHostTextComponent(wip)
            break
        }
        case Tag.Fragment: {
            break
        }
    }
}
