import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useParams } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';

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
        <Tabs>
            <TabList>
                <Tab>Title</Tab>
                <Tab>Question</Tab>
                <Tab>Constraints</Tab>
                <Tab>Solved Test Cases</Tab>
                <Tab>Rating</Tab>
                <Tab>Submissions</Tab>
            </TabList>

            <TabPanel><h2>{problem.title}</h2></TabPanel>
            <TabPanel><p>{problem.question}</p></TabPanel>
            <TabPanel><p>{problem.constraints}</p></TabPanel>
            <TabPanel><p>{problem.solved_TC}</p></TabPanel>
            <TabPanel><p>{problem.rating}</p></TabPanel>
            <TabPanel>
                <p>Total Submissions: {problem.total_submissions}</p>
                <p>Total Accepted: {problem.total_accepted}</p>
            </TabPanel>
        </Tabs>
    );
};

export default Problems;
