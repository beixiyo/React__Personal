import React, { useContext } from 'react'
import ctx from '../routerCtx'
import matchPath from '../matchPath'
import PropTypes from 'prop-types'


/** 匹配路由的组件 */
function Route(props) {
    const _ctxVal = useContext(ctx)
    const Comp = consumerFn(props, _ctxVal)
    return <Comp />
}

Route.propTypes = {
    children: PropTypes.node,
    render: PropTypes.func,
    component: PropTypes.elementType,
    exact: PropTypes.bool,
    strict: PropTypes.bool,
    sensitive: PropTypes.bool,
    path: PropTypes.string,
}

/** 消费上下文，提供路由匹配 */
function consumerFn(props, ctxVal) {
    return () => {
        const _ctxVal = {
            history: ctxVal.history,
            location: ctxVal.location,
            match: mathRoute(ctxVal.location, props)
        }

        return (<ctx.Provider value={_ctxVal}>
            {renderChildren(props, _ctxVal)}
        </ctx.Provider>)
    }
}

/** 匹配路由 */
function renderChildren({ children, component, render }, ctx) {
    /** children 一定显示 */
    if (children) {
        if (typeof children === 'function') {
            return children(ctx)
        }
        return children
    }

    if (!ctx.match) {
        return null
    }

    if (typeof render === 'function') {
        return render(ctx)
    }
    
    if (component) {
        const Comp = component
        return <Comp {...ctx} />
    }

    return null
}

function mathRoute(location, props) {
    const {
        exact = false,
        strict = false,
        sensitive = false,
        path = '/',
    } = props

    return matchPath(path, location.pathname, {
        exact, strict, sensitive
    })
}


export default Route