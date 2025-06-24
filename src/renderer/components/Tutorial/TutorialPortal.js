import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import TutorialModal from './Modal/TutorialModal';

const TutorialPortal = ({ tutorialName, onHide, show }) => {
  // Don't render anything if not showing
  if (!show) return null;
  
  // Use React's createPortal to render at the document body level
  return ReactDOM.createPortal(
    <div className={`tutorial-portal-container`} onClick={onHide}>
      <TutorialModal tutorialName={tutorialName} onHide={onHide} />
    </div>,
    document.body
  );
};

export default TutorialPortal;