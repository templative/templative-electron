import React, { useState, useEffect } from 'react';
import TeacherLogo from "./teacherLogo.svg?react";
import ForwardButton from "../../forwardButton.svg?react";
import BackButton from "../../backButton.svg?react";
import { tutorialAcknowledgements, TutorialElements } from "./TutorialContent";
const { ipcRenderer } = window.require('electron');

const MissingTutorial = ({ goToTutorial }) => {
  return (
    <div className="missing-tutorial">
      <h4>This tutorial is not available</h4>
      <p>We couldn't find the content for this tutorial. Here are some available tutorials you might be interested in:</p>
      <div className="available-tutorials-list">
        {Object.keys(TutorialElements).map(name => (
          <button
            className="btn btn-outline-primary tutorial-library-link-button"
            onClick={() => goToTutorial(name)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

const TutorialModal = ({
  tutorialName,
  onHide
}) => {
  const [currentName, setCurrentName] = useState(tutorialName);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tutorialHistory, setTutorialHistory] = useState([tutorialName]);
  const [dontShowTutorials, setDontShowTutorials] = useState(false);

  // Add useEffect to scroll to top when currentName changes
  useEffect(() => {
    const tutorialBody = document.querySelector('.tutorial-modal-body');
    if (tutorialBody) {
      tutorialBody.scrollTop = 0;
    }
  }, [currentName]);

  const handleClose = () => {
    onHide();
  }

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
  const goToExternalLink = (url) => {
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
  const TutorialElement = TutorialElements[currentName]
    ? TutorialElements[currentName]
    : () => <MissingTutorial goToTutorial={goToTutorial} />;
  return (
    <div className="tutorial-modal" onClick={handleClose}>
      <div className="modal-content modal-content-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <BackButton
              className={`direction-button ${currentIndex === 0 ? "disabled" : ""}`}
              disabled={currentIndex === 0}
              onClick={goBackATutorial}
            />
            <ForwardButton
              className={`direction-button ${currentIndex === tutorialHistory.length - 1 ? "disabled" : ""}`}
              disabled={currentIndex === tutorialHistory.length - 1}
              onClick={goForwardATutorial}
            />
            <TeacherLogo className="tutorial-icon" />
            <h3 className="modal-title">{currentName}</h3>
          </div>
          <div className="modal-header-right">
            <button className="close-button" onClick={handleClose}>×</button>
          </div>
        </div>
        <div className="modal-body tutorial-modal-body">
          <TutorialElement goToTutorial={goToTutorial} goToExternalLink={goToExternalLink} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline-primary got-it-button" onClick={handleClose}>{acknowledgement}</button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
