import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, withRouter, Switch } from './router/Router-DOM';
import PropTypes from 'prop-types';
import NavLink from './router/Router-DOM/NavLink';


const Button = withRouter(_Button);
const config = {
    getUserConfirmation,
    block,
    listen,
};


export default function () {
    const [show, setShow] = useState(true);
    const toggle = useCallback(() => {
        setShow(!show);
    }, [show]);

    return (<>
        {show && <RouterGuard {...config}>
            <Switch>
                <Route path="/p1" component={Page1} />
                <Route path="/p2" component={Page2} />
            </Switch>

            <Button></Button>
            <NavLink to="/p1">Link To p1</NavLink>
        </RouterGuard>}

        <button onClick={toggle} style={{ display: 'block', marginTop: 20 }}>
            Toggle Router
        </button>
    </>);
}


function RouterGuard({ getUserConfirmation, block, listen, children }) {
    let unBlock, unlisten;
    const Guard = withRouter(_routerGuard);
    useEffect(() => clear, []);

    return (<BrowserRouter getUserConfirmation={getUserConfirmation}>
        <Guard />
        {children}
    </BrowserRouter>);


    function _routerGuard({ history }) {
        useEffect(() => {
            unBlock = history.block(block);
            unlisten = history.listen(listen);

            return clear;
        }, []);

        return null;
    }

    function clear() {
        unBlock();
        unlisten();
        console.log('clear...');
    }
}

RouterGuard.propTypes = {
    getUserConfirmation: PropTypes.func,
    listen: PropTypes.func,
    block: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};

function getUserConfirmation(flag, next) {
    next(flag);
}

function block(location, action) {
    // 只有路径包含'p2' 才能放行
    return ['/p1', '/p2'].includes(location.pathname);
}

function listen(location, action) {
    console.log('路径变了:', location.pathname, '跳转方式:', action);
}


function _Button({ history }) {
    return (<>
        <button onClick={() => {
            history.push('/p1');
        }}>p1</button>

        <button onClick={() => {
            history.push('/p2');
        }}>p2</button>
    </>);
}

function Page1({ history }) {
    return <div>
        <h1 onClick={() => {
            console.log(history);
        }}>Page1</h1>
    </div>;
}

function Page2() {
    return <h1>Page2</h1>;
}

