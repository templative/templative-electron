import React, { useState, useEffect } from 'react';
import './RelatedTutorials.css'
export default function RelatedTutorials({tutorialNames, goToTutorial}) {
    const relatedTutorials = tutorialNames.map((tutorialName, index) => (
        <>
            <span className="tutorial-link" key={`${tutorialName}-${index}`} onClick={() => goToTutorial(tutorialName)}>{tutorialName}</span>
            <span>{index < tutorialNames.length - 1 ? " · " : ""}</span>
        </>
    ))
    if (relatedTutorials.length === 0) {
        return null;
    }
    return <>
        <div className="related-tutorials">
            <p><span className="related-tutorials-label">Related:</span> {relatedTutorials}</p>
        </div>
    </>
}