import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useParams } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
// import MDEditor from "@uiw/react-md-editor";

const baseURL = 'http://localhost:4000';

const Problems = () => {
    const [problem, setProblem] = useState(null);
    const { Pname } = useParams()
    console.log(Pname)
    useEffect(() => {
        axios.get(`${baseURL}/problem/problem/${Pname}`) // Assuming you want to fetch the problem with id 1
            .then(response => {
                console.log(response.data)
                setProblem(response.data);
            })
            .catch(error => console.error('Error fetching problem:', error));
    }, []);

    if (!problem) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div>
                <h2>{problem.title}</h2>
                <p><strong>Question:</strong> {problem.question}</p>
                <p><strong>Constraints:</strong> {problem.constraints}</p>
                <p><strong>Solved Test Cases:</strong> {problem.solved_TC}</p>
                <p><strong>Rating:</strong> {problem.rating}</p>
                <p><strong>Total Submissions:</strong> {problem.total_submissions}</p>
                <p><strong>Total Accepted:</strong> {problem.total_accepted}</p>
            </div>
            <div>
                {/* <MDEditor.Markdown source={problem?.title} /> */}

                <div className="">
                    <h2 className="">Input Format</h2>
                    {/* <MDEditor.Markdown source={problem?.inputFormat} /> */}
                </div>

                <div className="">
                    <h2 className="">Output Format</h2>
                    {/* <MDEditor.Markdown source={problem?.outputFormat} /> */}
                </div>
                <div className="">
                    <h2 className="">Constraints</h2>
                    {/* <MDEditor.Markdown source={problem?.constraints} /> */}
                </div>
            </div>
        </>
    );
};

export default Problems;
