import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Link, useParams } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import  DataTableDemo  from '../UI/DataTableDemo';

const baseURL = 'http://localhost:4000';

const ProblemSet = () => {
    const [problemset, setProblemset] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true)
        axios.get(`${baseURL}/problem/problemset/`) // Assuming you want to fetch the problem with id 1
            .then(response => {
                console.log(response.data)
                setProblemset(response.data);
                setLoading(false)
            })
            .catch(error => console.error('Error fetching problem:', error));
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <DataTableDemo/>
            {problemset?.map((problem, index) => (
                <div key={index}>
                    <h2><Link to={'/problem/' + problem.title.split(' ').join('-')}>{problem.title}</Link></h2>
                    <p>{problem.question}</p>
                    <p>{problem.constraints}</p>
                    <p>{problem.solved_TC}</p>
                    <p>{problem.rating}</p>
                </div>
            ))}
        </div>
    )
};

export default ProblemSet;
