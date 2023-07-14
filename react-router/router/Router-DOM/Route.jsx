import React, { useContext } from 'react';
import ctx from '../routerCtx';
import matchPath from '../matchPath';
import PropTypes from 'prop-types'


function Route(props) {
    const _ctxVal = useContext(ctx);
    const Comp = consumerFn(props, _ctxVal)
    return <Comp />
}

Route.propTypes = {
    children: PropTypes.node,
    render: PropTypes.func,
    component: PropTypes.elementType,
    exact: PropTypes.bool,
    strict: PropTypes.bool,
    sensitive: PropTypes.bool
};

function consumerFn(props, _ctxVal) {
    return () => {
        const ctxVal = {
            history: _ctxVal.history,
            location: _ctxVal.location,
            match: mathRoute(_ctxVal.location, props)
        };

        return (<ctx.Provider value={ctxVal}>
            {renderChildren(props, ctxVal)}
        </ctx.Provider>);
    };
}

function renderChildren({ children, component, render }, ctx) {
    if (children) {
        if (typeof children === 'function') {
            return children(ctx);
        }
        return children;
    }

    if (!ctx.match) {
        return;
    }

    if (typeof render === 'function') {
        return render(ctx);
    }
    if (component) {
        const Comp = component;
        return <Comp {...ctx} />;
    }
}

function mathRoute(location, props) {
    const {
        exact = false,
        strict = false,
        sensitive = false,
        path = '/',
    } = props;

    return matchPath(path, location.pathname, {
        exact, strict, sensitive
    });
}


export default Route;