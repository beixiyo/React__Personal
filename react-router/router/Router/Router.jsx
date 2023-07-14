import React from 'react';
import PropTypes from 'prop-types';
import ctx from '../routerCtx';
import matchPath from '../matchPath';


export default class extends React.Component {
    static displayName = 'Router';
    static propTypes = {
        history: PropTypes.object.isRequired
    };

    state = {
        location: this.props.history.location
    };

    componentDidMount() {
        this.unListen = this.props.history.listen((location, action) => {
            this.props.history.action = action;
            this.setState({
                location
            });
        });
    }

    componentWillUnmount() {
        this.unListen();
    }

    render() {
        const ctxVal = {
            history: this.props.history,
            location: this.state.location,
            match: matchPath('/', this.state.location.pathname),
        };

        return (<ctx.Provider value={ctxVal}>
            {this.props.children}
        </ctx.Provider>);
    }
}