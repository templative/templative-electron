import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import TutorialModal from './Modal/TutorialModal';

const TutorialPortal = ({ tutorialName, onHide, show }) => {
  // Don't render anything if not showing
  if (!show) return null;
  
  // Use React's createPortal to render at the document body level
  return ReactDOM.createPortal(
    <TutorialModal tutorialName={tutorialName} onHide={onHide} />,
    document.body
  );
};

export default TutorialPortal;