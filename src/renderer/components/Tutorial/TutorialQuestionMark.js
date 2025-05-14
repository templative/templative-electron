import React, { useState } from 'react';
import TutorialIcon from "./tutorialClickMe.svg?react";
import TutorialPortal from './TutorialPortal';
import { TutorialElements } from "./Modal/TutorialContent";
import './Tutorial.css';

const TutorialQuestionMark = ({  
    tutorialName,
}) => {
    const [show, setShow] = useState(false);
    
    const onHide = () => {
        setShow(false);
    }

    const onShow = () => {
        if (!TutorialElements[tutorialName]) {
            setShow(false);
            confirm("This tutorial is not available yet. Please check back later.");
            return;
        }
        setShow(true);
    }

    return (
        <>
            <TutorialIcon className="tutorial-question-mark" onClick={onShow}/>
            <TutorialPortal 
                tutorialName={tutorialName} 
                onHide={onHide} 
                show={show} 
            />
        </>
    );
};

export default TutorialQuestionMark;
