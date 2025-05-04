import React, { useState, useEffect } from 'react';
import './TutorialModal.css';
import TutorialIcon from "./otherQuestion.svg?react";
import TutorialContentWrapper from './TutorialContentWrapper';

const TutorialModal = ({  
    name,
}) => {
    const [show, setShow] = useState(false);
    
    const onHide = () => {
        setShow(false);
    }

    const onShow = () => {
        setShow(true);
    }
    return (
        <>
        <TutorialIcon className="selectable-tutorial-icon" onClick={onShow} title={`${name} Tutorial`}/>
        {show && (
            <TutorialContentWrapper name={name} onHide={onHide} />
        )}
        </>);
};

export default TutorialModal;
