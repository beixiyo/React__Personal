import { useEffect, useState } from '@myReact'
import './index.css'


export function TodoList() {
    const [item, setItem] = useState('')
    const [list, setList] = useState(['吃饭', '学习'])

    useEffect(
        () => {
            console.log('effect')

            return () => {
                console.log('clear effect')
            }
        },
        [list]
    )

    function addBtnHandle() {
        if (item === '') return

        setList([...list, item])
        setItem('')
    }

    function deleteItem(index: number, e: React.MouseEvent) {
        const newList = [...list]
        newList.splice(index, 1)
        setList(newList)

        console.log('del', e)
    }

    return (
        <div className='container'>
            <h1>待办事项</h1>

            <div>
                <input
                    type='text'
                    value={item}
                    onChange={(e) => {
                        setItem(e.target.value)
                    }}
                    placeholder='请输入待办事项'
                    className='input'
                />
                <button className='addBtn' onClick={addBtnHandle}>
                    添加
                </button>
            </div>

            <div>
                {list.map((item, index) => {
                    return (
                        <div
                            className='item'
                            key={index}
                            onClick={(e) => deleteItem(index, e)}
                        >
                            { item }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
