import React, { useState, useEffect } from 'react';
import './TutorialModal.css';
import TeacherLogo from "./teacherLogo.svg?react";
import EditCompositions from './Tutorials/EditCompositions';
import CreatingAComponent from './Tutorials/CreatingAComponent';
import OneVision from "./Tutorials/OneVision"
import PieceContentTutorial from "./Tutorials/PieceContentTutorial"
import ComponentContentTutorial from "./Tutorials/ComponentContentTutorial"
import BackButton from "./backButton.svg?react";
import ForwardButton from "./forwardButton.svg?react";

const TutorialElements = {
    "Edit Compositions": EditCompositions,
    "Creating a Component": CreatingAComponent,
    "One Vision": OneVision,
    "Piece Content": PieceContentTutorial,
    "Component Content": ComponentContentTutorial
}
const tutorialAcknowledgements = {
    "Edit Compositions": "I will edit some compositions.",
    "Creating a Component": "I will create a new component.",
    "One Vision": "قولوا: الله أكبر، ولله الحمد",
    "Piece Content": "I will make a Piece and add some Fields.",
    "Component Content": "I will add some Fields common to all Pieces."
}

const TutorialContentWrapper = ({  
    name,
    onHide
}) => {
    const [currentName, setCurrentName] = useState(name);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [tutorialHistory, setTutorialHistory] = useState([name]);
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
                        <BackButton className={`back-button ${currentIndex === 0 ? "disabled" : ""}`} disabled={currentIndex === 0} onClick={goBackATutorial}/>
                        <ForwardButton className={`forward-button ${currentIndex === tutorialHistory.length - 1 ? "disabled" : ""}`} disabled={currentIndex === tutorialHistory.length - 1} onClick={goForwardATutorial}/>
                        <TeacherLogo className="tutorial-icon"/>
                        <h3 className="modal-title">{currentName}</h3>
                        <button className="close-button" onClick={onHide}>×</button>
                    </div>
                    <div className="modal-body tutorial-modal-body">
                        <TutorialElement goToTutorial={goToTutorial}/>
                    </div>
                    <div className="modal-footer">
                        <label className="hide-tutorials-label">
                            <input 
                                className="hide-tutorials-checkbox"
                                type="checkbox" 
                            /> 
                            Don't show tutorials in the future
                        </label>
                        <button className="btn btn-outline-primary got-it-button" onClick={onHide}>{acknowledgement}</button>
                    </div>
            </div>
        </div>
    );
};

export default TutorialContentWrapper;
