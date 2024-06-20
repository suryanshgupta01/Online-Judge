import React, { useState, useContext, useEffect } from 'react'
import { useUserContext } from '../useCustomContext'
const baseURL = 'http://localhost:4000'

const Contests = () => {
    const [contests, setContests] = useState([])

    useEffect(() => {
        fetch(`${baseURL}/contest/contests`)
            .then(res => res.json())
            .then(data => {
                setContests(data)
            })
    }, []);

    return (<>
        {contests?.map((contest) => {
            return <>
                <div className='makerow contestdate'>
                    <span>
                        {contest.title}
                    </span>
                    <span>
                        {new Date(contest.start_time).toDateString()}
                    </span>
                    <span>
                        {new Date(contest.start_time).toTimeString()}
                    </span>
                    <span>
                        {contest.duration} minutes
                    </span>
                </div>
                <table class="table table-hover table-dark" style={{ marginBottom: '2rem' }}>
                    <thead>
                        <tr>
                            <th scope="col">S.No.</th>
                            <th scope="col">Question</th>
                            <th scope="col">Rating</th>
                            <th scope="col">Author?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contest.problems?.map((problem, index) => {
                            return (
                                <>
                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{problem.title}</td>
                                        <td>{problem.rating}</td>
                                        <td>{problem.author || 'suryansh'}</td>
                                    </tr>
                                </>)
                        })}
                    </tbody>
                </table>
            </>
        })
        }
    </>)
}

export default Contests