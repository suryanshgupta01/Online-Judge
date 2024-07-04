import axios from 'axios'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Avatar1 from '../UI/Avatar'
const baseURL = import.meta.env.VITE_baseURL
function Contest() {
    const { ID } = useParams()
    const [contest, setContest] = useState({})
    const langMap = {
        'cpp': 'C++',
        'c': 'C',
        'py': 'Python',
        'java': 'Java',
        'php': 'PHP',
        'rb': 'Ruby'
    };
    useEffect(() => {
        axios.post(`${baseURL}/contest/getcontest`, {
            ID: ID.split('-').join(' ')
        })
            .then(data => {
                // const sortedprob = data.data.problems.sort(function (a, b) { return a["rating"] - b["rating"] })
                setContest(data.data)
            })
            .catch(err => console.log(err))
    }, [])
    useEffect(() => {
        const tabs = document.querySelector(".wrapper");
        const tabButton = document.querySelectorAll(".tab-button");
        const contents = document.querySelectorAll(".content1");

        tabs.onclick = e => {
            const id = e.target.dataset.id;
            if (id) {
                tabButton.forEach(btn => {
                    btn.classList.remove("active");
                });
                e.target.classList.add("active");

                contents.forEach(content => {
                    content.classList.remove("active");
                });
                const element = document.getElementById(id);
                element.classList.add("active");
            }
        }
    }, []);
    if (!contest) return <h1>Contest not found</h1>
    const timeremain = Math.floor((new Date(contest.start_time).getTime() + contest.duration * 60000 - new Date().getTime()) / 1000)
   return (
        <div>
            <div className='makerow' style={{ justifyContent: 'space-between', paddingLeft: '14rem', paddingRight: '14rem', marginTop: '0.5rem' }}>

                <h1>{contest.title}</h1>
                <div>
                    {timeremain > 0 &&
                        <div>
                            Time remaining:
                        </div>
                    }
                    <div><b>{timeremain > 0 ? `${Math.floor(timeremain / 60)}:${timeremain % 60}` : <h3>Contest ended</h3>}</b></div>
                </div>
            </div>
            <div className="wrapper">
                <div className="buttonWrapper">
                    <button className="tab-button active" style={{ borderTopLeftRadius: '10px' }} data-id="home">Questions</button>
                    <button className="tab-button" data-id="about">Submissions</button>
                    <button className="tab-button" style={{ borderTopRightRadius: '10px' }} data-id="contact">Leaderboard</button>
                </div>
                <div className="contentWrapper">
                    <p className="content1 active" id="home" style={{ overflowY: 'auto' }}>
                        <table className="table table-hover table-striped" style={{ marginBottom: '2rem' }}>
                            <thead className='table-dark'>
                                <tr>
                                    <th scope="col">S.No.</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Rating</th>
                                    <th scope="col">Accuracy</th>
                                    <th scope="col">Accepted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contest?.problems?.map((question, index) => {
                                    return (
                                        <>
                                            <tr>
                                                <th scope="row">{index + 1}</th>
                                                <td>
                                                    <Link to={`problem/${question.title.split(' ').join('-')}`} className='links'>
                                                        {question.title}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {question.rating}
                                                </td>
                                                <td>
                                                    {question.total_submissions != 0 ? parseFloat(question.total_accepted / question.total_submissions * 100).toFixed(2) : 0}%
                                                </td>
                                                <td>
                                                    {question.total_accepted}
                                                </td>
                                            </tr>
                                        </>)
                                })}
                            </tbody>
                        </table >
                    </p>
                    <p className="content1" id="about" style={{ overflowY: 'auto' }}>
                        <table className="table table-hover table-striped" >
                            <thead className='table-dark'>
                                <tr>
                                    <th scope="col">UserName</th>
                                    <th scope="col">Problem</th>
                                    <th scope="col">Submitted</th>
                                    <th scope="col">Language</th>
                                    <th scope="col">Verdict</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contest.submissions?.reverse().map((problem) => (
                                    <tr>
                                        <td >{problem.userName?.substr(0, 20)}</td>
                                        <td >{problem.problemName?.substr(0, 21)}</td>
                                        <td>{moment(new Date(problem.createdAt)).fromNow()}</td>
                                        <td>{langMap[problem.language]}</td>
                                        <td style={{ backgroundColor: (problem.verdict == 'Accepted\n') ? '#C3E6CB' : '#F5C6CB' }}>{problem.verdict?.split('\n')[0]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </p>
                    <p className="content1" id="contact" style={{ overflowY: 'auto' }}>
                        <table className="table table-hover table-striped" >
                            <thead className='table-dark'>
                                <tr>
                                    <th scope="col">Rank</th>
                                    <th scope="col">UserName</th>
                                    <th scope="col">Penalty</th>
                                    <th scope="col">Score</th>
                                    {contest?.problems?.map((problem, ind) => (
                                        <th scope="col" key={ind}>{ind + 1}</th>
                                    ))}
                                </tr>

                            </thead>
                            <tbody>
                                {contest.leaderboard?.map((user, ind) => (
                                    <tr>
                                        <td>{ind + 1}</td>
                                        <td >{user.userName?.substr(0, 20)}</td>
                                        <td>{user.penalty}</td>
                                        <td>{parseFloat((user?.isAccepted?.filter(submission => submission).length) / (user.isAccepted?.length) * 100).toFixed(2)}%</td>
                                        {contest?.problems?.map((problem, ind) => (
                                            <td>{user.numTried[ind]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Contest
