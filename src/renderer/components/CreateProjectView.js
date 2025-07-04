import React, { useState } from "react";
import { trackEvent } from "@aptabase/electron/renderer";
const { ipcRenderer } = window.require('electron');
import { channels } from '../../shared/constants';
import './CreateProjectView.css';
import TheSvg from './Icons/the.svg?react';
import LegallyDistinctemonSvg from './Icons/legallyDistinctemon.svg?react';
import SettlersOfKachingSvg from './Icons/settlersOfKaching.svg?react';
import BigMallet50kSvg from './Icons/bigMallet50k.svg?react';
import SickleSvg from './Icons/sickle.svg?react';
import TutorialQuestionMark from "./Tutorial/TutorialQuestionMark";
import BackButton from "./backButton.svg?react";
import WargameSvg from "./Icons/wargame.svg?react";
const templates = [
    {
        name: "Blank Project",
        description: "A blank project.",
        icon: <TheSvg width="90" height="90" />,
        template: "",
        isDisabled: false,
    },
    {
        name: "Foes & Friends",
        description: "A wargame with hexes and tiles. Includes square chits for units, a six-fold map with hexes, and two dice.",
        icon: <WargameSvg width="90" height="90" />,
        template: "wargame",
        isDisabled: false,
    },
    {
        name: "Blokemon",
        description: "A collectible card game. Includes a deck of poker cards, a booster pack, and a booster pack box.",
        icon: <LegallyDistinctemonSvg width="90" height="90" />,
        template: "ccg",
        isDisabled: false,
    },
    {
        name: "Big Mallet 50k", 
        description: "A wargame with miniatures.",
        icon: <BigMallet50kSvg width="90" height="90" />,
        template: "big-mallet-50k",
        isDisabled: true,
    },
    {
        name: "Settlers of Kaching",
        description: "A hex map and dice.",
        icon: <SettlersOfKachingSvg width="90" height="90" />,
        template: "settlers-of-kaching",
        isDisabled: true,
    },
    {
        name: "Sickle", 
        description: "A worker placement game.",
        icon: <SickleSvg width="90" height="90" />,
        template: "sickle", 
        isDisabled: true,
    },
]


const CreateProjectView = ({ goBackCallback }) => {
  const [projectName, setProjectName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState(templates[0].name);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].template);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  
  const handleBrowseLocation = () => {
    ipcRenderer.invoke(channels.TO_SERVER_OPEN_DIRECTORY_DIALOG_FOR_PROJECT_LOCATION)
      .then((result) => {
        if (!result.canceled && result.filePaths.length > 0) {
          setProjectLocation(result.filePaths[0]);
        }
      }).catch(err => {
        console.error('Error opening directory dialog:', err);
        setError('Failed to open directory dialog');
      });
  };

  const handleCreateProject = () => {
    if (!projectName || !projectLocation) {
      setError("Project name and location are required");
      return;
    }
    

    setIsCreating(true);
    setError("");
    
    ipcRenderer.invoke(channels.TO_SERVER_CREATE_PROJECT, {
      projectName: projectName,
      projectLocation: projectLocation,
      templateName: selectedTemplate
    })
    .then(result => {
      setIsCreating(false);
      if (!result.success) {
        setError(result.error || "Failed to create project");
      }
      // On success, the main process will send GIVE_TEMPLATIVE_ROOT_FOLDER
      // which will be handled by the parent component
    })
    .catch(err => {
      setIsCreating(false);
      setError(err.message || "An error occurred while creating the project");
      console.error('Error creating project:', err);
    });
  };

  const templateButtons = templates.map(template => {
    const className = `btn btn-outline-secondary template-item ${selectedTemplateName === template.name ? 'selected' : ''} ${template.isDisabled ? 'disabled' : ''}`;
    const onClick = () => {
      if (!template.isDisabled) {
        setSelectedTemplateName(template.name);
        setSelectedTemplate(template.template);
      }
    }
    return <div 
            key={template.name}
            className={className}
            onClick={onClick}
        >
            <div className="template-icon">
                {template.icon}
            </div>
            <div className="template-info">
                <h3 className="template-name">{template.name}</h3>
                <p className="template-description">{template.description}{template.isDisabled && " (Coming Soon!)"}</p>
            </div>
        </div>
  });
  return (
    <div className="create-project-view">
        <div className="create-project-form">
            <div className="create-project-header">
                <BackButton 
                    className="back-button" 
                    onClick={goBackCallback}
                    title="Back to Start"
                />
                <h1>Create a Templative Project</h1>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="create-project-name-and-tutorial-container">
              <div className="input-group project-name-input-group">
                  <span className="input-group-text soft-label">Name</span>
                  <input type="text" className="form-control value-field no-left-border"
                      onChange={(event)=> setProjectName(event.target.value)} 
                      title="Project Name"
                      value={projectName}
                      placeholder="My Project"
                      />
              </div>
              <div className="tutorial-question-mark-container">
                <TutorialQuestionMark tutorialName="Create a Project"/>
              </div>
            </div>
            <div className="input-group location-input-group">
                <span className="input-group-text soft-label">Project Location</span>
                {projectLocation && 
                  <input type="text" className="form-control value-field no-left-border project-location-input"
                      onChange={(event)=> setProjectLocation(event.target.value)} 
                      title="Project Location"
                      value={projectLocation}
                      disabled
                      readOnly
                      placeholder={`Perhaps ~/Documents/Templative/Projects${projectName !== "" ? `/${projectName}` : ""}?`}
                  />
                }
                <button className={`btn btn-outline-primary browse-button ${projectLocation ? "shrink-browse-button" : ""}`} 
                    type="button" 
                    onClick={handleBrowseLocation}>
                    Browse...
                </button>
            </div>
            
            <h2>Templates</h2>
            <div className="template-list">
                {templateButtons}
            </div>
            {projectLocation !== "" && (
                <p className="project-explanation">The project will be created within the project location like this <span className="project-location-example">{projectLocation}/game.json</span></p>
            )}
            <button 
                className="btn btn-primary create-project-button" 
                disabled={projectName === "" || projectLocation === "" || isCreating}
                onClick={handleCreateProject}
            >
                {isCreating ? "Creating..." : "Create Project"}
            </button>
        </div>
    </div>
  );
};

export default CreateProjectView;