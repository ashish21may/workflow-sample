import React from 'react'
import { NavLink } from 'react-router-dom'

export const Home = () => {
    return (
        <>
            <div>Workflow Management PoC</div>
            <ul>
                <li><NavLink to="/workflows/create">Workflow creation</NavLink></li>
            </ul>
        </>
    )
}