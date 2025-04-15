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

const templates = [
    {
        name: "Blank Project",
        description: "A blank project with no components.",
        icon: <TheSvg width="90" height="90" />,
        template: "",
        isDisabled: false,
    },
    {
        name: "Legally Distinctemon",
        description: "A collectible card game.",
        icon: <LegallyDistinctemonSvg width="90" height="90" />,
        template: "legally-distinctemon",
        isDisabled: true,
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


const CreateProjectView = () => {
  const [projectName, setProjectName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState(templates[0].name);
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
      projectName,
      projectLocation,
      selectedTemplateName
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
    return <div 
            key={template.name}
            className={className}
            onClick={() => !template.isDisabled && setSelectedTemplateName(template.name)}
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
            <h1>Create a Templative Project</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="input-group project-name-input-group">
                <span className="input-group-text input-group-text soft-label">Name</span>
                <input type="text" className="form-control value-field no-left-border"
                    onChange={(event)=> setProjectName(event.target.value)} 
                    title="Project Name"
                    value={projectName}
                    placeholder="My Project"
                    />
            </div>
            <div className="input-group location-input-group">
                <span className="input-group-text input-group-text soft-label">Project Location</span>
                <input type="text" className="form-control value-field no-left-border project-location-input"
                    onChange={(event)=> setProjectLocation(event.target.value)} 
                    title="Project Location"
                    value={projectLocation}
                    disabled
                    readOnly
                    placeholder={`Perhaps ~/Documents/Templative/Projects${projectName !== "" ? `/${projectName}` : ""}?`}
                />
                <button className="btn btn-outline-secondary browse-button" 
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