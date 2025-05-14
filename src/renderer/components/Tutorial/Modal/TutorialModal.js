import React, { useState, useEffect } from 'react';
import TeacherLogo from "./teacherLogo.svg?react";
import ForwardButton from "../../forwardButton.svg?react";
import BackButton from "../../backButton.svg?react";
import { tutorialAcknowledgements, TutorialElements } from "./TutorialContent";

const TutorialModal = ({  
    tutorialName,
    onHide
}) => {
    const [currentName, setCurrentName] = useState(tutorialName);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [tutorialHistory, setTutorialHistory] = useState([tutorialName]);
    
    // Add useEffect to scroll to top when currentName changes
    useEffect(() => {
        const tutorialBody = document.querySelector('.tutorial-modal-body');
        if (tutorialBody) {
            tutorialBody.scrollTop = 0;
        }
    }, [currentName]);
    
    const goBackATutorial = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setCurrentName(tutorialHistory[currentIndex - 1]);
        }
    }
    const goForwardATutorial = () => {
        if (currentIndex < tutorialHistory.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setCurrentName(tutorialHistory[currentIndex + 1]);
        }
    }
    const openExternalLink = (url) => {
        // Use electron's shell to open links in default browser
        const { shell } = window.require('electron');
        shell.openExternal(url);
    };
    const goToTutorial = (name) => {
        const suggestedTutorial = TutorialElements[name];
        if (!suggestedTutorial) {
            return;
        }
        setCurrentName(name);
        setCurrentIndex(currentIndex + 1);
        setTutorialHistory([...tutorialHistory.slice(0, currentIndex + 1), name]);
    }
    const acknowledgement = tutorialAcknowledgements[currentName] || "Got it!";
    const TutorialElement = TutorialElements[currentName] || "No content for this tutorial.";
    return (
        <div className="modal-overlay tutorial-modal" onClick={onHide}>
            <div className="modal-content modal-content-large" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                        <BackButton className={`direction-button ${currentIndex === 0 ? "disabled" : ""}`} disabled={currentIndex === 0} onClick={goBackATutorial}/>
                        <ForwardButton className={`direction-button ${currentIndex === tutorialHistory.length - 1 ? "disabled" : ""}`} disabled={currentIndex === tutorialHistory.length - 1} onClick={goForwardATutorial}/>
                        <TeacherLogo className="tutorial-icon"/>
                        <h3 className="modal-title">{currentName}</h3>
                        <button className="close-button" onClick={onHide}>×</button>
                    </div>
                    <div className="modal-body tutorial-modal-body"> 
                        <TutorialElement goToTutorial={goToTutorial} openExternalLink={openExternalLink}/>
                        {/* <ul>
                            {Object.keys(TutorialElements)
                                // .filter(name => name !== currentName)
                                .map(name => (
                                    <li key={name}>
                                        <span 
                                            className="tutorial-link" 
                                            onClick={() => goToTutorial(name)}
                                        >
                                            {name}
                                        </span>
                                    </li>
                                ))
                            }
                        </ul> */}
                    </div>
                    <div className="modal-footer">
                        {/* <label className="hide-tutorials-label">
                            <input 
                                className="hide-tutorials-checkbox"
                                type="checkbox" 
                            /> 
                            Don't show tutorials in the future
                        </label> */}
                        <button className="btn btn-outline-primary got-it-button" onClick={onHide}>{acknowledgement}</button>
                    </div>
            </div>
        </div>
    );
};

export default TutorialModal;
