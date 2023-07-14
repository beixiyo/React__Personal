import fork from "./fork.js";
import take from "./take.js";

export default function (actionType, func, ...args) {
    // 用`fork`先包装成`effect`对象 然后yield到`forkEffect` 
    // 开启新的`saga` 不阻塞运行
    return fork(function* () {
        // 持续监听某个`action`
        while (true) {
            const action = yield take(actionType);
            // 用`fork`开启新的`saga`任务 
            // 函数内部可以执行任意`saga`函数 而不阻塞
            yield fork(func, ...args.concat(action))
        }
    })
}
