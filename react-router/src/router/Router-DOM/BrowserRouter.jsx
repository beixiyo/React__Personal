import React from 'react'
import { createBrowserHistory } from '../history'
import { Router } from '../Router'


/**
 * 创建整个 Route 容器，接收 history 的属性
 */
export default class BrowserRouter extends React.PureComponent {

    history = createBrowserHistory(this.props)

    render() {
        return (<Router history={this.history}>
            {this.props.children}
        </Router>)
    }
}
