import React, { useContext } from 'react'
import ctx from '../routerCtx'
import './style/link.css'


function NavLink(props) {
    const val = useContext(ctx)
    if (typeof props.to === 'object') {
        props.to = val.history.createHref(props.to)
    }
    else if (typeof props.to !== 'string') {
        throw TypeError('prop to must be an object or string')
    }

    let className = ''
    if (val.location.pathname === props.to) {
        className = props.activeClass || 'active'
    }

    return (<a className={className} onClick={push} {...props}>
        {props.children}
    </a>)

    function push(e) {
        e.preventDefault()
        val.history.push(props.to)
    }
}


export default NavLink
