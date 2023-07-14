import React, { useContext } from 'react';
import ctx from '../routerCtx';


function withRouter(Comp) {
    const RouterWrapper = (props) => {
        const val = useContext(ctx);
        return <Comp {...val} {...props} />;
    };

    RouterWrapper.displayName = `withRouter(${RouterWrapper.displayName || Comp.name || 'RouterWrapper'})`;

    return RouterWrapper;
}


export default withRouter;