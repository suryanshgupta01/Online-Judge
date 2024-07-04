import React, { useRef, useState } from 'react';
import { FlexItem } from 'flexlayout-react'; // Import FlexLayout components

const ResizablePane = () => {
    const paneRef = useRef();
    const [width, setWidth] = useState('50%'); // Initial width

    const handleResize = (e) => {
        const initialX = e.clientX;
        const initialWidth = paneRef.current.offsetWidth
        const handleMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - initialX;
            const newWidth = Math.min(window.innerWidth / 2, Math.max(-1 * window.innerWidth / 2, initialWidth + deltaX)); // Prevent negative width
            setWidth(`${newWidth / window.innerWidth * 100 + 50}%`);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <>
            <div className='makerow' >
                <div style={{ width: width, height: '100%', backgroundColor: 'red' }}>
                    gsfs
                </div>
                <div ref={paneRef} onMouseDown={handleResize} style={{ cursor: 'ew-resize' }}>WITHD</div>
                <div style={{ width: (100 - width.split('%')[0]) + '%', height: '100%', backgroundColor: 'blue' }}>
                    gfdgf
                </div>
            </div>
        </>)
};

export default ResizablePane;