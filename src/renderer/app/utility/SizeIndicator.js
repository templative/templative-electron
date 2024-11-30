import React, { useState, useEffect } from 'react';

const BootstrapSizeIndicator = () => {
    const [size, setSize] = useState('Unknown');

    const updateSize = () => {
        const width = window.innerWidth;
        if (width < 576) {
            setSize('xs');
        } else if (width >= 576 && width < 768) {
            setSize('sm');
        } else if (width >= 768 && width < 992) {
            setSize('md');
        } else if (width >= 992 && width < 1200) {
            setSize('lg');
        } else if (width >= 1200) {
            setSize('xl');
        }
    };

    useEffect(() => {
        window.addEventListener('resize', updateSize);
        updateSize(); // Initial check

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('resize', updateSize);
        };
    }, []);

    return (
        <div className="size-indicator" style={{ position: 'fixed', top: 10, right: 10, padding: 5, background: 'black', color: 'white', zIndex: 1000 }}>
            {size}
        </div>
    );
};

export default BootstrapSizeIndicator;