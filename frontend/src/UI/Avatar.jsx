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
