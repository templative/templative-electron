import React, { useState, useRef, useEffect } from 'react';
import TutorialIcon from "./tutorialClickMe.svg?react";
import TutorialPortal from './TutorialPortal';
import { TutorialElements } from "./Modal/TutorialContent";
const { ipcRenderer } = window.require('electron');

const TutorialQuestionMark = ({  
    tutorialName,
}) => {
    const [show, setShow] = useState(false);
    const [hasSeenTutorial, setHasSeenTutorial] = useState(true);
    const questionMarkRef = useRef(null);
    const hasTutorial = TutorialElements[tutorialName] !== undefined;
    
    useEffect(() => {
        const checkTutorialStatus = async () => {
            const settings = await ipcRenderer.invoke('TO_SERVER_GET_SETTINGS');
            const hasSeen = settings.readTutorials.includes(tutorialName);
            setHasSeenTutorial(hasSeen);
        };
        checkTutorialStatus();
    }, [tutorialName]);

    const updateQuestionMarkPosition = () => {
        if (questionMarkRef.current) {
            const rect = questionMarkRef.current.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            document.documentElement.style.setProperty('--tutorial-question-mark-x', `${x}px`);
            document.documentElement.style.setProperty('--tutorial-question-mark-y', `${y}px`);
        }
    };

    useEffect(() => {
        if (show) {
            updateQuestionMarkPosition();
            window.addEventListener('resize', updateQuestionMarkPosition);
            return () => window.removeEventListener('resize', updateQuestionMarkPosition);
        }
    }, [show]);
    
    const onHide = async () => {
        updateQuestionMarkPosition();
        
        // Mark tutorial as read in settings
        if (!hasSeenTutorial) {
            const settings = await ipcRenderer.invoke('TO_SERVER_GET_SETTINGS');
            const updatedTutorials = [...settings.readTutorials, tutorialName];
            await ipcRenderer.invoke('TO_SERVER_UPDATE_SETTING', 'readTutorials', updatedTutorials);
            setHasSeenTutorial(true);
        }

        // Wait for animation to complete before hiding
        setShow(false);
    }

    const onShow = () => {
        if (!TutorialElements[tutorialName]) {
            setShow(false);
            confirm("Tutorial coming soon!");
            return;
        }
        setShow(true);
    }
    const shouldQuestionMarkGlow = !hasSeenTutorial && hasTutorial;
    return (
        <>
            <TutorialIcon 
                ref={questionMarkRef}
                className={`tutorial-question-mark ${shouldQuestionMarkGlow ? 'unread' : ''} ${!hasTutorial ? 'disabled' : ''}`} 
                onClick={onShow}
            />
            <TutorialPortal 
                tutorialName={tutorialName} 
                onHide={onHide} 
                show={show}
            />
        </>
    );
};

export default TutorialQuestionMark;
