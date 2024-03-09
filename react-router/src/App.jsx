import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Route, withRouter, Switch, NavLink } from './router/Router-DOM'
import PropTypes from 'prop-types'


const config = {
    getUserConfirmation(flag, next) {
        console.log(`阻塞的消息是: ${flag}`)
        next(flag)
    },
    block(location, action) {
        // 只有路径包含 'p1 | p2' 才能放行
        return ['/p1', '/p2'].includes(location.pathname)
    },
    listen(location, action) {
        console.log('路径变为了:', location.pathname, '，跳转方式:', action)
    },
}


export default function () {
    const [show, setShow] = useState(true)
    const toggle = useCallback(() => {
        setShow(!show)
    }, [show])

    return (<>
        {show && <RouterGuard {...config}>
            <Route path={'/'} component={Home} />
            <Switch>
                <Route path="/p1" component={Page1} />
                <Route path="/p2" component={Page2} />
                <Route path="/p3" component={Page3} />
            </Switch>

            <NavLink to="/p1">Link To p1</NavLink>
            <NavLink to="/p2">Link To p2</NavLink>
            <NavLink to="/p3">Link To p3</NavLink>
        </RouterGuard>}

        <button onClick={toggle} style={{ display: 'block', marginTop: 20 }}>
            Toggle Router
        </button>
    </>)
}


function RouterGuard({ getUserConfirmation, block, listen, children }) {
    let unBlock, unlisten
    const Guard = withRouter(_routerGuard)
    useEffect(() => clear, [])

    return (<BrowserRouter getUserConfirmation={getUserConfirmation}>
        <Guard />
        {children}
    </BrowserRouter>)


    /** 记录信息和触发监听用的 */
    function _routerGuard({ history }) {
        useEffect(() => {
            unBlock = history.block(block)
            unlisten = history.listen(listen)

            return clear
        }, [])

        return null
    }

    function clear() {
        unBlock()
        unlisten()
        console.log('clear...')
    }
}

RouterGuard.propTypes = {
    getUserConfirmation: PropTypes.func,
    listen: PropTypes.func,
    block: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}


/** ===================== 组件 ======================== */
function Home() {
    return <h1>Home</h1>
}

function Page1({ history }) {
    return <div>
        <h1 onClick={() => {
            console.log(history)
        }}>Page1</h1>
    </div>
}

function Page2() {
    return <h1>Page2</h1>
}

function Page3() {
    return <h1>Page3</h1>
}

