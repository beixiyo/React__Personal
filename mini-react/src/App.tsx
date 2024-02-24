import { FuncComp } from './lib/components/Test'
import { TodoList } from './lib/components/TodoList'


export function App() {
    return (
        <div>
            <FuncComp id='testId' compName='函数组件' onClick={onClick} />
            <TodoList />
        </div>
    )
}

function onClick() {
    console.log('click')
}
