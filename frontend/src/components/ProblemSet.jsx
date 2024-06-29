import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Link, useParams } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import DataTableDemo from '../UI/DataTableDemo';

const baseURL = import.meta.env.VITE_baseURL;

const ProblemSet = () => {
    const [problemset, setProblemset] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true)
        axios.get(`${baseURL}/problem/problemset/`)
            .then(response => {
                setProblemset(response.data.map(row => ({
                    ...row,
                    accuracy: row.total_accepted / row.total_submissions * 100
                })));
                console.log(problemset)
                setLoading(false)
            })
            .catch(error => console.error('Error fetching problem:', error));
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <DataTableDemo problems={problemset} />
        </div>
    )
};

export default ProblemSet;
