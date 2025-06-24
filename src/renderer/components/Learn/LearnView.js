import React, { useState, useEffect, useContext } from "react";
import path from "path";
import "./LearnView.css"
import { TutorialElements, tutorialGroups } from "../Tutorial/Modal/TutorialContent"
import TeacherLogo from "../Tutorial/Modal/teacherLogo.svg?react";
import ForwardButton from "../forwardButton.svg?react";
import BackButton from "../backButton.svg?react";
import NoFileIcon from "../Edit/noFileIcon.svg?react";
import AnswerMyQuestion from "../Tutorial/Modal/TutorialComponents/AnswerMyQuestion";
import { RenderingWorkspaceContext } from "../Render/RenderingWorkspaceProvider";

export default function LearnView(props) {
    const {
        currentTutorialName,
        currentTutorialIndex,
        tutorialHistory,
        goToTutorial,
        goBackATutorial,
        goForwardATutorial
    } = useContext(RenderingWorkspaceContext);

    useEffect(() => {
        const handleMouseButton = (event) => {
            // Mouse button 4 is back, button 5 is forward
            if (event.button === 3) { // Back button
                event.preventDefault();
                if (currentTutorialIndex > 0) {
                    goBackATutorial();
                }
            } else if (event.button === 4) { // Forward button
                event.preventDefault();
                if (currentTutorialIndex < tutorialHistory.length - 1) {
                    goForwardATutorial();
                }
            }
        };

        window.addEventListener('mousedown', handleMouseButton);
        return () => {
            window.removeEventListener('mousedown', handleMouseButton);
        };
    }, [currentTutorialIndex, tutorialHistory.length, goBackATutorial, goForwardATutorial]);

    const goToExternalLink = (url) => {
        const { shell } = window.require('electron');
        shell.openExternal(url);
    };

    const handleGoToTutorial = (name) => {
        const suggestedTutorial = TutorialElements[name];
        if (!suggestedTutorial) {
            return;
        }
        goToTutorial(name);
    };

    const TutorialElement = TutorialElements[currentTutorialName] || (() => (
        <div className="missing-tutorial">
            <h4>This tutorial is not available</h4>
            <p>We couldn't find the content for this tutorial. Here are some available tutorials you might be interested in:</p>
            <div className="available-tutorials-list">
                {Object.keys(TutorialElements).map(name => (
                    <button
                        key={name}
                        className="btn btn-outline-primary tutorial-library-link-button"
                        onClick={() => handleGoToTutorial(name)}
                    >
                        {name}
                    </button>
                ))}
            </div>
        </div>
    ));

    const renderTutorialGroup = (group, groupName) => {
        if (Array.isArray(group)) {
            // This is a leaf group - render the tutorials
            return group.map((tutorial) => (
                <div 
                    className={`tutorial-list-item ${tutorial === currentTutorialName ? 'active' : ''}`} 
                    key={tutorial}
                    onClick={() => handleGoToTutorial(tutorial)}
                >
                    <p>{tutorial}</p>
                </div>
            ));
        } else {
            // This is a parent group - render headers and recurse
            return Object.entries(group).map(([subGroupName, subGroup]) => {
                // If the subgroup is an array with only one item, render it directly without header
                if (Array.isArray(subGroup) && subGroup.length === 1) {
                    return renderTutorialGroup(subGroup, subGroupName);
                }
                
                // Otherwise render with header
                return (
                    <div key={subGroupName} className="tutorial-group">
                        <div className="tutorial-group-header">
                            <p>{subGroupName}</p>
                        </div>
                        <div className="tutorial-group-content">
                            {renderTutorialGroup(subGroup, subGroupName)}
                        </div>
                    </div>
                );
            });
        }
    };

    const tutorialTree = Object.entries(tutorialGroups).map(([groupName, group]) => {
        // If the group is an array with only one item, render it directly without header
        if (Array.isArray(group) && group.length === 1) {
            return renderTutorialGroup(group, groupName);
        }
        
        // Otherwise render with header
        return (
            <div key={groupName} className="tutorial-group">
                <div className="tutorial-group-header">
                    <p>{groupName}</p>
                </div>
                <div className="tutorial-group-content">
                    {renderTutorialGroup(group, groupName)}
                </div>
            </div>
        );
    });

    return (
        <div className="learn-body">
            <div className="learn-columns">
                <div className="nav-column">
                    <div className="tutorial-list">
                        <h4>Become the Master</h4>
                        {tutorialTree}
                    </div>
                </div>
                <div className="content-column">
                    <div className="tutorial-header">
                        <BackButton
                            className={`direction-button ${currentTutorialIndex === 0 ? "disabled" : ""}`}
                            disabled={currentTutorialIndex === 0}
                            onClick={goBackATutorial}
                            
                        />
                        <ForwardButton
                            className={`direction-button ${currentTutorialIndex === tutorialHistory.length - 1 ? "disabled" : ""}`}
                            disabled={currentTutorialIndex === tutorialHistory.length - 1}
                            onClick={goForwardATutorial}
                        />
                        <TeacherLogo className="tutorial-icon" />
                        <h3 className="tutorial-title">{currentTutorialName}</h3>
                    </div>
                    <div className="tutorial-body">
                        <div className="tutorial-body-inner">
                            <TutorialElement goToTutorial={handleGoToTutorial} goToExternalLink={goToExternalLink} />
                            <AnswerMyQuestion tutorialName={currentTutorialName} goToExternalLink={goToExternalLink} />
                            <NoFileIcon className="no-file-icon" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}