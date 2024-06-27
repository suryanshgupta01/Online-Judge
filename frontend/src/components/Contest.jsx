import axios from 'axios'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
const baseURL = 'http://localhost:4000'
function Contest() {
    const { ID } = useParams()
    console.log(ID)
    const [allcontestsubmission,setAllcontestsubmission]=useState([])
    const [contest, setContest] = useState({})
    useEffect(() => {
        axios.get(`${baseURL}/contest/getcontest/${ID.split('-').join(' ')}`)
            .then(data => {
                const sortedprob = data.data.problems.sort(function (a, b) { return a["rating"] - b["rating"] })
                setContest({ ...data.data, problems: sortedprob })
            })
            .catch(err => console.log(err))
    }, [])
    console.log(contest)
    useEffect(() => {
        const tabs = document.querySelector(".wrapper");
        const tabButton = document.querySelectorAll(".tab-button");
        const contents = document.querySelectorAll(".content");

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
    return (
        <div>
            <h1>{contest.title}</h1>
            <div className="wrapper">
                <div className="buttonWrapper">
                    <button className="tab-button active" style={{ borderTopLeftRadius: '10px' }} data-id="home">Questions</button>
                    <button className="tab-button" data-id="about">Submissions</button>
                    <button className="tab-button" style={{ borderTopRightRadius: '10px' }} data-id="contact">Leaderboard</button>
                </div>
                <div className="contentWrapper">
                    <p className="content active" id="home" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
                                                    <Link to={`/problem/${question.title.split(' ').join('-')}`}>
                                                        {question.title}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {question.rating}
                                                </td>
                                                <td>
                                                    {parseFloat(question.total_accepted / question.total_submissions * 100).toFixed(2)}%
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
                    <p className="content" id="about" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <table className="table table-hover table-striped" >
                            <thead className='table-dark'>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">UserName</th>
                                    <th scope="col">Submitted</th>
                                    <th scope="col">Language</th>
                                    <th scope="col">Verdict</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allcontestsubmission?.map((problem) => (
                                    <tr>
                                        <td ><Avatar1 info={problem} /></td>
                                        <td >{problem.userName?.substr(0, 20)}</td>
                                        <td>{moment(new Date(problem.createdAt)).fromNow()}</td>
                                        <td>{problem.language}</td>
                                        <td style={{ backgroundColor: (problem.verdict != 'AC') ? 'red' : 'green' }}>{problem.verdict.split('\n')[0]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </p>
                    <p className="content" id="contact" style={{ maxHeight: '70vh', overflowY: 'auto'}}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos sit incidunt nostrum? Magni, quam vero, magnam odio similique ipsam minima et repellat rerum cupiditate totam in repudiandae. Sed, dicta corrupti?
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, dolore quas quis earum incidunt voluptas! Ducimus quod libero aliquid consequatur et modi porro officia, quibusdam quas commodi placeat maxime qui?
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab ea debitis eligendi accusamus deleniti maxime pariatur. Assumenda, facere placeat eius quam magni accusantium aut quae minima iure atque incidunt illum.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Contest
