import React, { useState, useEffect, useRef } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import axios from 'axios';
import { useUserContext } from '../useCustomContext';
import Avatar1 from '../UI/Avatar';
import moment from 'moment';
import katex from 'katex';
import 'katex/dist/katex.min.css';
// import MDEditor from "@uiw/react-md-editor";

const baseURL = 'http://localhost:4000';
const baseURLsubs = 'http://localhost:4500';

const Problems = () => {
    const [problem, setProblem] = useState(null);
    const { Pname } = useParams()
    const { currentUser, globalUser } = useUserContext();
    const [console1, setConsole1] = useState('');
    const codeRef = useRef(null);
    useEffect(() => {
        handleLangChoice("cpp")
        axios.get(`${baseURL}/problem/problem/${Pname}`) // Assuming you want to fetch the problem with id 1
            .then(response => {
                console.log(response.data)
                setProblem(response.data);
                setConsole1(response.data.solved_TC_input);
            })
            .catch(error => console.error('Error fetching problem:', error));
    }, []);
    // const [isSubmit, setIsSubmit] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [lang, setLang] = useState('cpp');

    const handleLangChoice = (lang) => {
        const sampleCode = {
            "cpp": `#include <bits/stdc++.h>
using namespace std;

    int main(){

        cout<<"Hello World";
        return 0;

    }`,
            "py": `print("Hello World!")`,
            "c": `#include <stdio.h>
int main(){
    printf("Hello World");
    return 0;
}`,
            "java": `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`
        }
        codeRef.current?.editor?.setValue(sampleCode[lang])
    }
    const [output, setOutput] = useState('');
    const [verdict, setVerdict] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (isSubmit = 2) => {
        setSuccessMsg('');
        setErrorMsg('');
        setOutput('');
        setVerdict('');
        try {
            if (!codeRef.current.editor.getValue() || !console1) {
                setErrorMsg("Code or console1 is empty");
                return;
            }
            setLoading(true);
            const { data } = await axios.post(`${baseURLsubs}/submission/run`, {
                lang, code: codeRef.current.editor.getValue(), isSubmit: (isSubmit == 1), userID: currentUser.uid, probID: problem._id, input: console1
            });
            console.log(data)
            setLoading(false);
            if (isSubmit == 1)
                if (data.isCorrect) {
                    setSuccessMsg("Accepted");
                    setVerdict("Code accepted")
                } else {
                    setVerdict(`Test Case ${data.pass + 1} incorrect.\nWrong Test Case: \n ${data.wrongTC} \nYour Output: \n ${data.Wooutput} \nCorrect Output: \n ${data.Coutput} `);
                    setErrorMsg("Wrong Answer");
                }
            else
                setOutput(data.answer);
        } catch (error) {
            if (isSubmit == 2)
                setOutput(error.response.data)
            else setVerdict(error.response.data)
            console.log("inside error while running code", error.response.data);
        }
    }
    const handleSubmit2 = async () => {
        handleSubmit(1);
    }


    const [isActive, setIsActive] = useState(false);

    const isSmallScreen = window.innerWidth < 768;
    const [mysubmission, setMysubmission] = useState([]);
    const [allsubmission, setAllsubmission] = useState([]);

    // const getmysubmission = async () => {
    //     const { data } = await axios.post(`${baseURLsubs}/submission/mysubproblem`, {
    //         userID: currentUser.uid,
    //         problemName: Pname
    //     });
    //     console.log(data)
    //     setMysubmission(data);
    // }
    const getallsubmission = async () => {
        const { data } = await axios.post(`${baseURLsubs}/submission/allsubproblem`, {
            problemName: Pname,
            userID: currentUser.uid
        });
        console.log(data)
        const mysub = data.filter((ele) => ele.user.userid == currentUser.uid)
        setMysubmission(mysub)
        setAllsubmission(data);
    }
    useEffect(() => {
        // getmysubmission()
        getallsubmission()
    }, []);
    if (!problem) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <div className={!isSmallScreen ? 'makerow' : 'makecol'}>
                <div style={{ width: '45vw' }}>
                    <Tabs style={{ textAlign: 'left' }} >
                        <TabList>
                            <Tab>Problem</Tab>
                            <Tab>My Submissions</Tab>
                            <Tab>All Submissions</Tab>
                        </TabList>
                        <TabPanel >
                            <div style={{ padding: '0.7rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h2>{problem.title}
                                        {/* <i className="fa-solid fa-code"></i> */}
                                    </h2>
                                    <select
                                        className="select-box border border-gray-300 rounded-lg py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500"
                                        onClick={(e) => handleLangChoice(e.target.value)}>
                                        <option value='cpp'>C++</option>
                                        <option value='c'>C</option>
                                        <option value='py'>Python</option>
                                        <option value='java'>Java</option>
                                        <option value='cs'>C#</option>
                                        <option value='php'>PHP</option>
                                        <option value='rb'>Ruby</option>
                                        <option value='rs'>Rust</option>
                                    </select>
                                </div>
                                <br />
                                <p><strong>Problem Statement :<br /></strong>
                                    <span dangerouslySetInnerHTML={{ __html: problem.question }}></span></p>
                                <p><strong>Constraints :</strong><br /> {problem.constraints}</p>
                                <p><strong>Sample Test Case :</strong><br /> {problem.solved_TC_input}</p>
                                <p><strong>Sample Test Case :</strong><br /> {problem.solved_TC_output}</p>
                                <p><strong>Input Format:</strong><br /> {problem.inputFormat}</p>
                                <p><strong>Output Format:</strong><br /> {problem.outputFormat}</p>
                                <p><strong>Rating:</strong><br /> {problem.rating}</p>
                                <p><strong>Author:</strong><br /> {problem.author}</p>
                                <div className='makerow' style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                    <p>Submissions: {problem.total_submissions}</p>
                                    <p>Accepted: {problem.total_accepted}</p>
                                    <p>Accuracy: {((problem.total_accepted / problem.total_submissions) * 100).toFixed(2)}%</p>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel >
                            <div style={{ maxHeight: '80vh', overflowY: 'auto', textAlign: 'center' }}>

                                <table className="table table-hover table-striped" >
                                    <thead className='table-dark'>
                                        <tr>
                                            <th scope="col">Code</th>
                                            <th scope="col">Submitted</th>
                                            <th scope="col">Language</th>
                                            <th scope="col">Verdict</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mysubmission?.map((problem) => (
                                            <tr>
                                                <td ><Avatar1 info={problem} /></td>
                                                <td>{moment(new Date(problem.createdAt)).fromNow()}</td>
                                                <td>{problem.language}</td>
                                                <td style={{ backgroundColor: (problem.verdict != 'AC') ? 'red' : 'green' }}>{problem.verdict.split('\n')[0]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>
                        <TabPanel >
                            <div style={{ maxHeight: '80vh', overflowY: 'auto', textAlign: 'center' }}>
                                <table className="table table-hover table-striped" >
                                    <thead className='table-dark'>
                                        <tr>
                                            <th scope="col">Code</th>
                                            <th scope="col">UserName</th>
                                            <th scope="col">Submitted</th>
                                            <th scope="col">Language</th>
                                            <th scope="col">Verdict</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allsubmission?.map((problem) => (
                                            <tr>
                                                <td ><Avatar1 info={problem} /></td>
                                                <td >{problem.user?.name?.substr(0, 15)}</td>
                                                <td>{moment(new Date(problem.createdAt)).fromNow()}</td>
                                                <td>{problem.language}</td>
                                                <td style={{ backgroundColor: (problem.verdict != 'AC') ? 'red' : 'green' }}>{problem.verdict.split('\n')[0]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>
                    </Tabs>

                </div>

                <div className="gutter gutter-vertical" style={{ width: '6px',  cursor: 'col-resize' }}></div>

                <div style={{ width: '55vw' }}>
                    <div>
                        <AceEditor
                            mode="javascript"
                            theme="monokai"
                            name="editor"
                            ref={codeRef}
                            // value={code}
                            editorProps={{ $blockScrolling: true }}
                            width="100%"
                            height="500px"
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: true
                            }}
                        />
                    </div>
                    {successMsg && <Alert variant="filled" severity="success">
                        {successMsg}
                    </Alert>}
                    {errorMsg && <Alert variant="filled" severity="error">
                        {errorMsg}
                    </Alert>}
                    <div>
                        <div className={`content ${isActive ? 'active' : ''} `}>
                            <Tabs style={{ textAlign: 'left' }} >
                                <TabList>
                                    <Tab>Input</Tab>
                                    <Tab>Output</Tab>
                                    <Tab>Verdict</Tab>
                                </TabList>
                                <TabPanel id="console1">
                                    <textarea rows={4} style={{ width: '100%' }} value={console1} onChange={(e) => setConsole1(e.target.value)}>
                                        {console1}
                                    </textarea>
                                </TabPanel>
                                <TabPanel id="output">
                                    <div>
                                        {output.split('\n').map((item, index) => {
                                            return <p key={index} style={{ margin: '0' }}>{item}</p>
                                        })}
                                    </div>
                                </TabPanel>
                                <TabPanel id="verdict">
                                    <div style={{ color: 'red' }}>
                                        {verdict.split('\n').map((item, index) => {
                                            return <p key={index} style={{ margin: '0' }}>{item}</p>
                                        })}
                                    </div>
                                </TabPanel>
                            </Tabs>

                        </div>
                        <div className={`collapsible ${isActive ? 'active' : ''} `} >
                            <button onClick={() => setIsActive(!isActive)} type="button" className="text-center inline-flex items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                                Console<i className="fa-solid fa-terminal ml-2"></i>
                            </button>
                            <button onClick={() => handleSubmit()} type="button" disabled={loading} className="text-center inline-flex items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                                Run<i className="fa-solid fa-play ml-2"></i>
                            </button>
                            <button onClick={handleSubmit2} type="button" disabled={loading} className="text-center inline-flex items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                                Submit<i className="fa-solid fa-circle-check ml-2"></i>
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
};

export default Problems;
