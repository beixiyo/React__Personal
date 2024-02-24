import React from 'react'
import { useEffect, useState } from '@myReact'


export function FuncComp({ id, onClick, compName }: IProps) {
    const [val, setVal] = useState(1)

    useEffect(() => {
        console.log('effect')

        return () => {
            console.log('clear')
        }
    }, [val])

    return (
        <div className="container" id={id} onClick={onClick}>
            <p>{ compName }</p>
            <p>{ val }</p>
            <button onClick={ () => setVal(val + 1) }> val + </button>
            <div className="one">
                <ul className="two">
                    <li>苹果</li>
                    <li>橙子</li>
                </ul>
                <ul className="three">
                    <li>香蕉</li>
                    <li>西瓜</li>
                </ul>
            </div>
        </div>
    )
}


interface IProps {
    id: string
    compName: string
    onClick: (value: React.MouseEvent<HTMLDivElement>) => void
}
