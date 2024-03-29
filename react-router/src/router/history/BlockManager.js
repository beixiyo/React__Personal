export default class BlockManager {
    /** 该属性是否有值，决定了是否有阻塞 */
    prompt = null

    /**
     * @param {function} getUserConfirmation 如果设置了阻塞，则会调用这个函数。该函数返回值决定是否继续执行下一步
     */
    constructor(getUserConfirmation) {
        this.getUserConfirmation = getUserConfirmation
    }

    /**
     * 设置一个阻塞，传递一个提示消息
     * @param {*} prompt 可以是字符串，也可以一个函数，函数返回一个消息字符串
     */
    block(prompt) {
        if (
            typeof prompt !== "string"
            && typeof prompt !== "function"
        ) {
            throw new TypeError("block must be string or function")
        }
        this.prompt = prompt
        return () => {
            this.prompt = null
        }
    }

    /**
     * 触发阻塞
     * @param {function} next 当阻塞完成之后要做的事情（一般是跳转页面）
     */
    triggerBlock(location, action, next) {
        if (!this.prompt) {
            next()
            return
        }

        let message
        if (typeof this.prompt === "string") {
            message = this.prompt
        }
        else if (typeof this.prompt === "function") {
            message = this.prompt(location, action)
        }
      
        this.getUserConfirmation(message, canNext => {
            if (canNext === true) {
                next()
            }
        })
    }
}