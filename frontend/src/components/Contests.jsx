import React, { useState, useContext, useEffect } from 'react'
import { useUserContext } from '../useCustomContext'
import moment from 'moment'
import { Link } from 'react-router-dom'
const baseURL = import.meta.env.VITE_baseURL

const Contests = () => {
    const [contests, setContests] = useState([])
    const [upcomingContests, setUpcomingContests] = useState([])
    const [pastContests, setPastContests] = useState([])
    const [currentContests, setCurrentContests] = useState([])
    const divideintotimeContest = (contest) => {
        const currTime = new Date().getTime();
        const start_time = new Date(contest.start_time).getTime()
        if (currTime < start_time) {
            setUpcomingContests((prev) => [...prev, contest])
        } else if (currTime > (start_time + Number(contest.duration) * 60000)) {
            setPastContests((prev) => [...prev, contest])
        } else {
            setCurrentContests((prev) => [...prev, contest])
        }
    }
    useEffect(() => {
        fetch(`${baseURL}/contest/contests`)
            .then(res => res.json())
            .then(data => {
                data.forEach(contest => {
                    console.log(contest.duration)
                    divideintotimeContest(contest)
                })
            })
    }, []);

    return (<>
        <h2 style={{marginTop:'2rem', textAlign: 'left',paddingLeft:'4rem' }}>Current Contests</h2>
        <table className="table table-hover table-striped " style={{ width:'90%',margin:'auto' }}>
            <thead className='table-dark'>
                <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Title</th>
                    <th scope="col">Start</th>
                    <th scope="col">Time remaining</th>
                    <th scope="col">Participants</th>
                </tr>
            </thead>
            <tbody>
                {currentContests?.map((contest, index) => {

                    return (
                        <>
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <td>
                                    <Link to={`/contest/${contest.title.split(' ').join('-')}/live`} className='links'>
                                        {contest.title}
                                    </Link>
                                </td>
                                <td>
                                    {moment(contest.start_time).format('MMMM Do YYYY, h:mm a')}
                                </td>
                                <td>
                                    {parseInt(contest.duration / 60 - (new Date().getTime() - new Date(contest.start_time).getTime()) / 3600000)} : {parseInt(contest.duration - (new Date().getTime() - new Date(contest.start_time).getTime()) / 60000) % 60}
                                </td>
                                <td>
                                    {contest.leaderboard.length}
                                </td>
                            </tr>
                        </>)
                })}
            </tbody>
        </table >

        <h2 style={{ marginTop: '2rem', textAlign: 'left', paddingLeft: '4rem' }}>Upcoming Contests</h2>
        <table className="table table-hover table-striped " style={{ width: '90%', margin: 'auto' }}>
            <thead className='table-dark'>
                <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Title</th>
                    <th scope="col">Start</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Time remaining</th>
                </tr>
            </thead>
            <tbody>
                {upcomingContests?.map((contest, index) => {

                    return (
                        <>
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{contest.title}</td>
                                <td>
                                    {moment(contest.start_time).format('MMMM Do YYYY, h:mm a')}
                                </td>
                                <td>
                                    {contest.duration} mins
                                </td>
                                <td>
                                    {moment(contest.start_time).fromNow()}
                                </td>

                            </tr>
                        </>)
                })}
            </tbody>
        </table >
        <h2 style={{ marginTop: '2rem', textAlign: 'left', paddingLeft: '4rem' }}>Past Contests</h2>
        <table className="table table-hover table-striped " style={{ width: '90%', margin: 'auto' }}>
            <thead className='table-dark'>
                <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Title</th>
                    <th scope="col">Start</th>
                    <th scope="col">Performance</th>
                    <th scope="col">Participants</th>
                </tr>
            </thead>
            <tbody>
                {pastContests?.map((contest, index) => {

                    return (
                        <>
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{contest.title}</td>
                                <td>
                                    {moment(contest.start_time).format('MMMM Do YYYY, h:mm a')}
                                </td>
                                <td>
                                    <Link to={`/contest/${contest.title.split(' ').join('-')}/old`} className='links'>
                                        Leaderboard
                                    </Link>
                                </td>
                                <td>
                                    {contest.leaderboard.length}
                                </td>
                            </tr>
                        </>)
                })}
            </tbody>
        </table >

    </>)
}

export default Contests