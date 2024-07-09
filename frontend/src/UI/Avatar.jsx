import * as React from 'react';
import { Transition } from 'react-transition-group';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

export default function Avatar1({ info }) {
    const [open, setOpen] = React.useState(false);
    const Title = {
        "AC": "Accepted",
        "WA": "Wrong Answer",
        "TLE": "Time Limit Exceeded",
        "MLE": "Memory Limit Exceeded",
        "RE": "Runtime Error",
        "SE": "System Error",
    }
    const shortcuts = [
        // { action: "Run code", mac: "⌘ + '", windows: "Ctrl + '" },
        { action: "Submit code", mac: "⌘ + Enter", windows: "Ctrl + Enter" },
        { action: "Indent", mac: "Tab", windows: "Tab" },
        { action: "Remove line", mac: "⌘ + D", windows: "Ctrl + D" },
        { action: "Remove to line end", mac: "Ctrl + K", windows: "Alt + Delete" },
        { action: "Copy lines up/down", mac: "⌘ + ⌥ + Up/Down", windows: "Alt + Shift + Up/Down" },
        { action: "To move lines up/down", mac: "⌥ + Up/Down", windows: "Alt + Up/Down" },
        { action: "Toggle comment", mac: "⌘ + /", windows: "Ctrl + /" },
        { action: "Undo action", mac: "⌘ + Z", windows: "Ctrl + Z" },
        { action: "Redo action", mac: "⌘ + Y", windows: "Ctrl + Y" }
    ];
    if (info.keyboard) {
        return <React.Fragment >
            <Button onClick={() => setOpen(true)} style={{ backgroundColor: 'white', color: 'black', padding: '0', marginTop: '0px', fontSize: '2rem', width: '2.5rem', height: '2.5rem', marginRight: '2rem' }}>⌘</Button>
            <Transition in={open} timeout={100}>
                {(state) => (
                    <Modal
                        keepMounted
                        open={!['exited', 'exiting'].includes(state)}
                        onClose={() => setOpen(false)}
                        slotProps={{
                            backdrop: {
                                sx: {
                                    opacity: 0,
                                    backdropFilter: 'none',
                                    transition: `opacity 400ms, backdrop-filter 400ms`,
                                    ...{
                                        entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                                        entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                                    }[state],
                                },
                            },
                        }}
                        sx={{
                            visibility: state === 'exited' ? 'hidden' : 'visible',
                        }}
                    >
                        <ModalDialog
                            sx={{
                                opacity: 0,
                                width: '80vw',
                                transition: `opacity 300ms`,
                                ...{
                                    entering: { opacity: 1 },
                                    entered: { opacity: 1 },
                                }[state],
                            }}
                        >
                            <DialogTitle>Editor Shortcuts</DialogTitle>
                            <hr />
                            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', textAlign: 'left', paddingLeft: '3rem' ,paddingBottom:'3rem'}}>
                                <div style={{ fontSize: '2rem' }}>Action</div>
                                <div style={{ fontSize: '2rem' }}>Mac</div>
                                <div style={{ fontSize: '2rem' }}>Windows</div>
                                {shortcuts?.map((shortcut, ind) =>
                                    <React.Fragment key={ind}>
                                        <div>{shortcut.action}</div>
                                        <div>{shortcut.mac}</div>
                                        <div>{shortcut.windows}</div>
                                    </React.Fragment>
                                )}
                            </div>
                        </ModalDialog>
                    </Modal>
                )}
            </Transition>
        </React.Fragment>
    } else
        return (
            <React.Fragment >
                <Button color="neutral" onClick={() => setOpen(true)}>
                    View
                </Button>
                <Transition in={open} timeout={100}>
                    {(state) => (
                        <Modal
                            keepMounted
                            open={!['exited', 'exiting'].includes(state)}
                            onClose={() => setOpen(false)}
                            slotProps={{
                                backdrop: {
                                    sx: {
                                        opacity: 0,
                                        backdropFilter: 'none',
                                        transition: `opacity 400ms, backdrop-filter 400ms`,
                                        ...{
                                            entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                                            entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                                        }[state],
                                    },
                                },
                            }}
                            sx={{
                                visibility: state === 'exited' ? 'hidden' : 'visible',
                            }}
                        >
                            <ModalDialog
                                sx={{
                                    opacity: 0,
                                    width: '80vw',
                                    transition: `opacity 300ms`,
                                    ...{
                                        entering: { opacity: 1 },
                                        entered: { opacity: 1 },
                                    }[state],
                                }}
                            >
                                <DialogTitle>{info.verdict.split('\n')[0]}</DialogTitle>
                                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                                    {info.verdict.split('\n').map((item, index) => {
                                        if (index == 0) return null
                                        return <p key={index} style={{ margin: '0' }}>{item}</p>
                                    })}
                                </div>
                                <AceEditor
                                    mode="javascript"
                                    theme="monokai"
                                    name="editor"
                                    value={info.code}
                                    editorProps={{ $blockScrolling: true }}
                                    height="500px"
                                    width="100%"
                                    readOnly={true}
                                />
                            </ModalDialog>
                        </Modal>
                    )}
                </Transition>
            </React.Fragment>
        );
}
