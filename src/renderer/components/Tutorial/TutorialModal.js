import React, { useState, useEffect } from 'react';
import './TutorialModal.css';
import TutorialIcon from "./teacherLogo.svg?react";
import EditCompositions from './Tutorials/EditCompositions';
import CreatingAComponent from './Tutorials/CreatingAComponent';
import OneVision from "./Tutorials/OneVision"

const tutorials = {
    "Edit Compositions": <EditCompositions />,
    "Creating a Component": <CreatingAComponent />,
    "One Vision": <OneVision />
}
const tutorialAcknowledgements = {
    "Edit Compositions": "I will edit some compositions.",
    "Creating a Component": "I will create a new component.",
    "One Vision": "قولوا: الله أكبر، ولله الحمد"
}

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

    if (!show) return null;
    const acknowledgement = tutorialAcknowledgements[name] || "Got it!";
    const content = tutorials[name] || "No content for this tutorial.";
    return (
        <div className="modal-overlay tutorial-modal" onClick={onHide}>
            <div className="modal-content modal-content-large" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <TutorialIcon className="tutorial-icon"/>
                    <h3 className="modal-title">{name}</h3>
                    <button className="close-button" onClick={onHide}>×</button>
                </div>
                <div className="modal-body tutorial-modal-body">
                    {content}
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

export default TutorialModal;
