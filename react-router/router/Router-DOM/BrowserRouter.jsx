import React from 'react';
import { createBrowserHistory } from '../history';
import Router from '../Router/Router';


export default class BrowserRouter extends React.PureComponent {

    history = createBrowserHistory(this.props);

    render() {
        return (<Router history={this.history}>
            {this.props.children}
        </Router>);
    }
}