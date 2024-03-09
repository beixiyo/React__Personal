import ListenerManager from "./ListenerManager"
import BlockManager from "./BlockManager"

/**
 * 创建一个history api的history对象
 * @param {*} options 
 */
export default function createBrowserHistory(options = {}) {
    const {
        basename = "",
        forceRefresh = false,
        keyLength = 6,
        getUserConfirmation = (msg, next) => next(window.confirm(msg))
    } = options
    const listenerManager = new ListenerManager()
    const blockManager = new BlockManager(getUserConfirmation)

    addDomListener()

    const history = {
        action: "POP",
        createHref,
        block,
        length: window.history.length,
        go,
        goBack,
        goForward,
        push,
        replace,
        listen,
        location: createLocation(basename)
    }

    return history


    function go(step) {
        window.history.go(step)
    }
    function goBack() {
        window.history.back()
    }
    function goForward() {
        window.history.forward()
    }

    /**
     * 向地址栈中加入一个新的地址
     * @param {*} path 新的地址，可以是字符串，也可以是对象
     * @param {*} state 附加的状态数据，如果第一个参数是对象，该参数无效
     */
    function push(path, state) {
        changePage(path, state, true)
    }

    function replace(path, state) {
        changePage(path, state, false)
    }

    /**
     * 可用于实现 push 或 replace 功能的方法
     * @param {*} path 
     * @param {*} state 
     * @param {*} isPush 
     */
    function changePage(path, state, isPush) {
        let action = "PUSH"
        if (!isPush) {
            action = "REPLACE"
        }
        const pathInfo = handlePathAndState(path, state, basename)
        const location = createLoactionFromPath(pathInfo)

        // 让阻塞决定是否跳转
        blockManager.triggerBlock(location, action, () => {
            if (isPush) {
                window.history.pushState({
                    key: createKey(keyLength),
                    state: pathInfo.state
                }, null, pathInfo.path)
            }
            else {
                window.history.replaceState({
                    key: createKey(keyLength),
                    state: pathInfo.state
                }, null, pathInfo.path)
            }

            // pushState 或 replaceState不会触发 popstate 事件，所以需要手动触发
            listenerManager.triggerListener(location, action)
            history.action = action
            history.location = location

            if (forceRefresh) {
                // 强制刷新
                window.location.href = pathInfo.path
            }
        })
    }

    /**
     * 添加对地址变化的监听
     */
    function addDomListener() {
        // popstate 事件，仅能监听前进、后退、用户对地址hash的改变
        // 无法监听到pushState、replaceState
        window.addEventListener("popstate", () => {
            const location = createLocation(basename)
            const action = "POP"
            blockManager.triggerBlock(location, action, () => {
                listenerManager.triggerListener(location, action)
                history.location = location
            })
        })
    }

    /**
     * 添加一个监听器，并且返回一个可用于取消监听的函数
     * @param {*} listener 
     */
    function listen(listener) {
        return listenerManager.addListener(listener)
    }

    function block(prompt) {
        return blockManager.block(prompt)
    }

    function createHref(location) {
        let { pathname = "/", search = "", hash = "" } = location
        if (search.charAt(0) === "?" && search.length === 1) {
            search = ""
        }
        if (hash.charAt(0) === "#" && hash.length === 1) {
            hash = ""
        }
        return basename + pathname + search + hash
    }
}

/**
 * 根据path和state，得到一个统一的对象格式
 * @param {*} path 
 * @param {*} state 
 */
function handlePathAndState(path, state, basename) {
    if (typeof path === "string") {
        return {
            path,
            state
        }
    }
    else if (typeof path === "object") {
        let pathResult = basename + path.pathname
        let { search = "", hash = "" } = path
        if (search.charAt(0) !== "?") {
            search = "?" + search
        }
        if (hash.charAt(0) !== "#") {
            hash = "#" + hash
        }
        pathResult += search
        pathResult += hash
        return {
            path: pathResult,
            state: path.state
        }
    }
    else {
        throw new TypeError("path must be string or object")
    }
}

/**
 * 创建一个location对象
 */
function createLocation(basename = "") {
    let pathname = window.location.pathname
    // 处理 basename 的情况
    const reg = new RegExp(`^${basename}`)
    pathname = pathname.replace(reg, "")
    const location = {
        hash: window.location.hash,
        search: window.location.search,
        pathname
    }

    let state, historyState = window.history.state
    if (historyState === null) {
        state = undefined
    }
    else if (typeof historyState !== "object") {
        state = historyState
    }
    else {
        if ("key" in historyState) {
            location.key = historyState.key
            state = historyState.state
        }
        else {
            state = historyState
        }
    }
    location.state = state
    return location
}

/**
 * 根据pathInfo得到一个location对象
 * @param {*} pathInfo  {path:"/news/asdf#aaaaaa?a=2&b=3", state:状态}
 * @param {*} basename 
 */
function createLoactionFromPath(pathInfo, basename) {
    let pathname = pathInfo.path.replace(/[#?].*$/, "")
    let reg = new RegExp(`^${basename}`)
    pathname = pathname.replace(reg, "")

    // search
    let questionIndex = pathInfo.path.indexOf("?")
    let sharpIndex = pathInfo.path.indexOf("#")
    let search
    if (questionIndex === -1 || questionIndex > sharpIndex) {
        search = ""
    }
    else {
        search = pathInfo.path.slice(questionIndex, sharpIndex)
    }
    // hash
    let hash
    if (sharpIndex === -1) {
        hash = ""
    }
    else {
        hash = pathInfo.path.slice(sharpIndex)
    }
    return {
        hash,
        pathname,
        search,
        state: pathInfo.state
    }
}


/**
 * 产生一个指定长度的随机字符串，随机字符串中可以包含数字和字母
 * @param {*} keyLength 
 */
function createKey(keyLength) {
    return Math.random().toString(36).slice(2, keyLength)
}