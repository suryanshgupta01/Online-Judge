import React, { useState, useEffect, useRef } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import axios from 'axios';
import { useUserContext } from '../useCustomContext';
// import MDEditor from "@uiw/react-md-editor";

const baseURL = 'http://localhost:4000';

const Problems = () => {
    const [problem, setProblem] = useState(null);
    const { Pname } = useParams()
    const { currentUser } = useUserContext();
    const [console1, setConsole1] = useState('');
    const codeRef = useRef('');
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
    const [code, setCode] = useState('');
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

        setCode(sampleCode[lang])
    }
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (isSubmit = 2) => {
        setSuccessMsg('');
        setErrorMsg('');
        setOutput('');
        try {
            if (!codeRef.current.editor.getValue() || !console1) {
                setErrorMsg("Code or console1 is empty");
                return;
            }
            setLoading(true);
            const { data } = await axios.post('http://localhost:4500/submission/run', {
                lang, code: codeRef.current.editor.getValue(), isSubmit: (isSubmit == 1), userID: currentUser.uid, probID: problem._id, input: console1
            });
            setLoading(false);
            if (isSubmit == 1)
                if (data.isCorrect) {
                    setSuccessMsg("Accepted");
                } else {
                    setOutput(`Test Case ${data.pass + 1} incorrect.\nWrong Test Case: \n ${data.wrongTC} \nYour Output: \n ${data.Wooutput} \nCorrect Output: \n ${data.Coutput} `);
                    setErrorMsg("Wrong Answer");
                }
            else
                setOutput(data.answer);
        } catch (error) {
            console.log(error);
        }
    }
    const handleSubmit2 = async () => {
        handleSubmit(1);
    }


    const [isActive, setIsActive] = useState(false);
    if (!problem) {
        return <div>Loading...</div>;
    }

    const isSmallScreen = window.innerWidth < 768;
    return (
        <>
            <div className={!isSmallScreen ? 'makerow' : 'makecol'}>
                <div>
                    <h2>{problem.title}</h2>
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
                    <p><strong>Question:</strong> {problem.question}</p>
                    <p><strong>Constraints:</strong> {problem.constraints}</p>
                    <p><strong>Solved Test Cases:</strong> {problem.solved_TC}</p>
                    <p><strong>Rating:</strong> {problem.rating}</p>
                    <p><strong>Total Submissions:</strong> {problem.total_submissions}</p>
                    <p><strong>Total Accepted:</strong> {problem.total_accepted}</p>
                </div>
                <div className="gutter gutter-horizontal" style={{ flexBasis: '6px' }}>Midwidth changing line</div>
                <div>
                    <div>
                        <AceEditor
                            mode="javascript"
                            theme="monokai"
                            name="editor"
                            ref={codeRef}
                            value={code}
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
                                        {output}
                                    </div>
                                </TabPanel>
                                <TabPanel id="verdict">
                                    <div>
                                        {output}
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
