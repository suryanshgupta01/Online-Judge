import axios from 'axios'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
const baseURL = 'http://localhost:4000'
function Contest() {
    const { ID } = useParams()
    console.log(ID)
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
            <h1>TOGGLE TABS</h1>
            <div className="wrapper">
                <div className="buttonWrapper">
                    <button className="tab-button active" style={{ borderTopLeftRadius: '10px' }} data-id="home">Home</button>
                    <button className="tab-button" data-id="about">About</button>
                    <button className="tab-button" style={{ borderTopRightRadius: '10px' }} data-id="contact">Contact</button>
                </div>
                <div className="contentWrapper">
                    <p className="content active" id="home">
                        <table className="table table-hover table-dark" style={{ marginBottom: '2rem' }}>
                            <thead>
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
                    <p className="content" id="about">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis maxime itaque veritatis iste soluta placeat obcaecati laudantium repellat corrupti! Eius sunt rerum inventore magnam? Perspiciatis facere error suscipit quisquam quibusdam.
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, corporis voluptatem quo dignissimos eius quis perferendis vero culpa reiciendis nulla quisquam fugit minima sed molestiae excepturi beatae repudiandae ea? Aliquid!
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim sapiente officia vel consequuntur, hic at quis? Illo repellendus dolores totam facilis sunt sequi qui hic, nulla ratione harum porro perspiciatis.
                    </p>
                    <p className="content" id="contact">
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
