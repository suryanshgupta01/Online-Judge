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
import CircularProgress from '@mui/material/CircularProgress';
import ResizablePane from './ResizablePane';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


const MathExpression = ({ expression }) => {
    const html = katex.renderToString(expression, {
        throwOnError: false
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const baseURL = import.meta.env.VITE_baseURL;
const baseURLsubs = import.meta.env.VITE_baseURLsubs

const Problems = () => {
    const [problem, setProblem] = useState(null);
    const { Pname, ID: contestName } = useParams()
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
}`,
            "rb": `puts "Hello World"`,
            "php": `<?php
    echo "Hello World";
?>`
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
        if (!isActive)
            setIsActive(true);
        // verdictRef.current.click();
        try {
            if (!codeRef.current.editor.getValue() || !console1) {
                setErrorMsg("Code or console is empty");
                return;
            }
            setLoading(true);
            console.log(currentUser.uid, problem._id, contestName)
            const { data } = await axios.post(`${baseURLsubs}/submission/run`, {
                lang, code: codeRef.current.editor.getValue(), isSubmit: (isSubmit == 1), userID: currentUser.uid, probID: problem._id, input: console1, contestName: contestName
            });
            console.log(data)
            if (isSubmit == 1)
                if (data.isCorrect) {
                    setSuccessMsg("Accepted");
                    setVerdict("Code accepted")
                    setMysubmission((prev) => [{ code: codeRef.current.editor.getValue(), lang: lang, verdict: "Accepted\n", createdAt: new Date() }, ...prev])
                    setAllsubmission((prev) => [{ code: codeRef.current.editor.getValue(), lang: lang, verdict: "Accepted\n", createdAt: new Date() }, ...prev])
                } else {
                    setErrorMsg("Wrong Answer");
                    setVerdict(`Test Case ${data.pass + 1} incorrect.\nWrong Test Case: \n ${data.wrongTC} \nYour Output: \n ${data.Wooutput} \nCorrect Output: \n ${data.Coutput} `);
                    setMysubmission((prev) => [{ code: codeRef.current.editor.getValue(), lang: lang, verdict: `Test Case ${data.pass + 1} incorrect.\nWrong Test Case: \n ${data.wrongTC} \nYour Output: \n ${data.Wooutput} \nCorrect Output: \n ${data.Coutput} `, createdAt: new Date() }, ...prev])
                    setAllsubmission((prev) => [{ code: codeRef.current.editor.getValue(), lang: lang, verdict: `Test Case ${data.pass + 1} incorrect.\nWrong Test Case: \n ${data.wrongTC} \nYour Output: \n ${data.Wooutput} \nCorrect Output: \n ${data.Coutput} `, createdAt: new Date() }, ...prev])
                }
            else
                setOutput(data.answer);
        } catch (error) {
            setErrorMsg("Error in code");
            if (isSubmit == 2)
                setOutput(error.response.data)
            else setVerdict(error.response.data)
            console.log("inside error while running code", error.response.data);
        }
        setLoading(false);
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
        console.log(Pname, currentUser.uid)
        axios.post(`${baseURL}/user/userinfo`, {
            uid: currentUser.uid
        }).then(async (res) => {
            const { data } = await axios.post(`${baseURL}/problem/allsubproblem`, {
                problemName: Pname,
                userID: currentUser.uid
            });
            const mysub = data.filter((ele) => ele.userName == res.data.name)
            setMysubmission(mysub)
            setAllsubmission(data);
            console.log(mysub)
        }).catch((err) => {
            console.log(err)
        })
    }
    const paneRef = useRef();
    const [width, setWidth] = useState('50%'); // Initial width
    const langMap = {
        'cpp': 'C++',
        'c': 'C',
        'py': 'Python',
        'java': 'Java',
        'php': 'PHP',
        'rb': 'Ruby'
    };
    const handleResize = (e) => {
        const initialX = e.clientX;
        const initialWidth = paneRef.current.offsetWidth
        const handleMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - initialX;
            const newWidth = Math.min(window.innerWidth / 3, Math.max(-1 * window.innerWidth / 3, initialWidth + deltaX)); // Prevent negative width
            setWidth(`${newWidth / window.innerWidth * 100 + 50}%`);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };
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
                <div style={{ width: width }}>
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
                                        onClick={(e) => { handleLangChoice(e.target.value); setLang(e.target.value); }}>
                                        <option value='cpp'>C++</option>
                                        <option value='c'>C</option>
                                        <option value='py'>Python</option>
                                        <option value='java'>Java</option>
                                        <option value='php'>PHP</option>
                                        <option value='rb'>Ruby</option>
                                    </select>
                                </div>
                                <br />
                                <p><strong>Problem Statement :<br /></strong>
                                    {problem.question.split('$$').map((ele, ind, arr) => (
                                        (ind % 2 == 0)
                                            ? ele
                                            : <MathExpression expression={ele} />
                                    ))}
                                </p>
                                <p><strong>Constraints :</strong><br /><MathExpression expression={problem.constraints} />                                </p>
                                <p><strong>Sample Test Case :</strong><br /> {problem.solved_TC_input}</p>
                                <p><strong>Sample Test Case :</strong><br /> {problem.solved_TC_output}</p>
                                <p><strong>Input Format:</strong><br /> {problem.inputFormat}</p>
                                <p><strong>Output Format:</strong><br /> {problem.outputFormat}</p>
                                <p><strong>Rating:</strong><br /> {problem.rating}</p>
                                <p><strong>Author:</strong><br /> {problem.author}</p>
                                <div className='makerow' style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                    <p>Submissions: {problem.total_submissions}</p>
                                    <p>Accepted: {problem.total_accepted}</p>
                                    <p>Accuracy: {((problem.total_accepted / (problem.total_submissions == 0) ? 1 : problem.total_submissions) * 100).toFixed(2)}%</p>
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
                                                <td>{langMap[problem.language]}</td>
                                                <td style={{ backgroundColor: (problem.verdict == 'Accepted\n') ? '#C3E6CB' : '#F5C6CB' }}>{problem.verdict.split('\n')[0]}</td>
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
                                                <td >{problem.userName?.substr(0, 20)}</td>
                                                <td>{moment(new Date(problem.createdAt)).fromNow()}</td>
                                                <td>{langMap[problem.language]}</td>
                                                <td style={{ backgroundColor: (problem.verdict == 'Accepted\n') ? '#C3E6CB' : '#F5C6CB' }}>{problem.verdict.split('\n')[0]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>
                    </Tabs>

                </div>

                {/* <div className="gutter gutter-vertical" style={{ width: '6px', cursor: 'col-resize' }}></div> */}
                <div ref={paneRef} onMouseDown={handleResize} style={{ cursor: 'ew-resize', backgroundColor: '#BCCBE9', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                    <div>||</div>
                </div>
                <div style={{ width: (100 - width.split('%')[0]) + '%' }}>
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
                                    <Tab >Input</Tab>
                                    <Tab >Output</Tab>
                                    <Tab >Verdict</Tab>
                                </TabList>
                                <TabPanel id="console1">
                                    <textarea rows={4} style={{ width: '100%' }} value={console1} onChange={(e) => setConsole1(e.target.value)}>
                                        {console1}
                                    </textarea>
                                </TabPanel>
                                <TabPanel id="output">
                                    <div>{loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}><CircularProgress style={{ margin: 'auto' }} /></div> : <>
                                        {output.split('\n').map((item, index) => {
                                            return <p key={index} style={{ margin: '0' }}>{item}</p>
                                        })}
                                    </>
                                    }
                                    </div>
                                </TabPanel>
                                <TabPanel id="verdict">
                                    {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}><CircularProgress style={{ margin: 'auto' }} /></div> : <>
                                        {verdict.split('\n').map((item, index) => {
                                            return <p key={index} style={{ margin: '0' }}>{item}</p>
                                        })}
                                    </>
                                    }
                                </TabPanel>
                            </Tabs>

                        </div>
                        {currentUser ?
                            <div className={`collapsible ${isActive ? 'active' : ''} `} >
                                <button onClick={() => setIsActive(!isActive)} type="button" style={{ width: '31%' }} className="text-center inline-flex items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 me-2 mb-2">
                                    Console <i className="fa-solid fa-terminal ml-2"></i>
                                </button>
                                <button onClick={() => handleSubmit()} type="button" style={{ width: '31%' }} disabled={loading} className="text-center inline-flex items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 me-2 mb-2">
                                    {!loading ? <>Run <i className="fa-solid fa-play ml-2"></i></> : <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />}
                                </button>
                                <button onClick={handleSubmit2} type="button" style={{ width: '31%' }} disabled={loading} className="text-center inline-flex items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 me-2 mb-2">
                                    {!loading ? <>Submit <i className="fa-solid fa-circle-check ml-2"></i></> : <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />}
                                </button>
                            </div> : null}
                    </div>


                </div>
            </div>
        </>
    );
};

export default Problems;

