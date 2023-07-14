import React, { useContext } from 'react';
import ctx from '../routerCtx';
import Route from './Route';
import matchPath from '../matchPath';


function Switch({ children }) {
    const val = useContext(ctx);
    !Array.isArray(children) && (children = [children]);

    for (const c of children) {
        if (c.type !== Route) {
            throw TypeError('the children of Switch component must be type of Route');
        }

        const {
            path = "/",
            exact = false,
            strict = false,
            sensitive = false } = c.props;

        const res = matchPath(path, val.location.pathname, { exact, strict, sensitive });
        if (res) {
            return c
        }
    }
}


export default React.memo(Switch);