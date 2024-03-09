import React from 'react'
import PropTypes from 'prop-types'
import ctx from '../routerCtx'
import matchPath from '../matchPath'


/**
 * 接收一个 history 对象，返回一个 Router 上下文组件
 */
export default class extends React.Component {
    static displayName = 'Router';
    static propTypes = {
        history: PropTypes.object.isRequired
    }

    state = {
        location: this.props.history.location
    }

    componentDidMount() {
        /**
         * 监听路由变化，更新路由组件
         */
        this.unListen = this.props.history.listen((location, action) => {
            this.props.history.action = action
            this.setState({
                location
            })
        })
    }

    componentWillUnmount() {
        this.unListen()
    }

    render() {
        const ctxVal = {
            history: this.props.history,
            location: this.state.location,
            match: matchPath('/', this.state.location.pathname),
        }

        return (<ctx.Provider value={ctxVal}>
            {this.props.children}
        </ctx.Provider>)
    }
}