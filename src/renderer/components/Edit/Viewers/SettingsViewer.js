import React from "react";
import EditableViewerJson from "./EditableViewerJson";
import "./SettingsViewer.css"

const settingsFile = {
    isGitEnabled: { 
        title: "Is Git Enabled?",
        section: "Collaboration", 
        defaultValue: false, 
        type: "boolean", 
        description: "If true, Templative will show a Git area in the file explorer. This is useful if you're using Templative as part of a larger development workflow. This is disabled due to unsafe behavior.",
        isDisabled: true,
        requiresRestart: false,
        
    },
    renderProgram: {
        title: "Which Rendering Program Should Templative Use?",
        section: "Rendering",
        defaultValue: "Templative",
        type: "select",
        options: ["Templative", "Inkscape"],
        description: "Whether to use Templative's svg renderer or Inkscape's svg renderer. Inkscape has more sophisticated text wrapping than Templative, but naturally you need to have Inkscape installed to use it. Download it for free at inkscape.org/download",
        isDisabled: false,
        requiresRestart: false,
    },
    isCacheIgnored: { 
        title: "Is the Rendering Cache Ignored?", 
        section: "Rendering",
        defaultValue: false, 
        type: "boolean", 
        description: "If true, Templative will always re-render your art files, even if they haven't changed. This is useful if you're changing font files, for example, as Templative will not detect that kind of change.",
        isDisabled: false,
        requiresRestart: false,
    },
    isOnChangeRenderingDisabled: {
        title: "Is On-Change Rendering Disabled?",
        section: "Rendering",
        defaultValue: false,
        type: "boolean",
        description: "If true, Templative will not re-render components as they change. This is useful if the background rendering is taxing your computer, but it means creating a render will be slower. Changing this setting won't take effect until you restart Templative.",
        isDisabled: false,
        requiresRestart: true,
    },
    overlappingRenderingTasks: {
        title: "Overlapping Rendering Tasks",
        section: "Rendering",
        defaultValue: "One at a Time",
        type: "select",
        options: ["One at a Time", "All at Once"],
        description: "If One at a Time, Templative will render each component, and each file for each component, one at a time. If All at Once, Templative will render all components and files for each component at the same time. This has the potential to better utilize your computer's resources, but it also has the potential to crash Templative, use at your own risk.",
        isDisabled: false,
        requiresRestart: false,
    }
}

export default class SettingsViewer extends EditableViewerJson {       
    
    updateBooleanValue(key, newValue, requiresRestart) {
        this.updateValue(key, newValue === "true", requiresRestart);
    }
    
    updateValue(key, newValue, requiresRestart) {
        const newGamedataFileContents = Object.assign({}, this.state.content)
        newGamedataFileContents[key] = newValue
        if (requiresRestart) {
            window.confirm("This setting will take effect after you restart Templative.");
        }
        this.setState({
            content: newGamedataFileContents
        }, async () => this.autosave())
    }

    getFilePath = (props) => {
        return this.props.filepath
    }

    render() {
        if (!this.state.hasLoaded || this.state.content === undefined) {
            return null;
        }       

        const settingsSections = new Set();
        for (const key in settingsFile) {
            settingsSections.add(settingsFile[key].section);
        }
        const settingsSectionsArray = Array.from(settingsSections);
        return <div className="settings-viewer">
            <div className="settings-viewer-container">
                {settingsSectionsArray.map((section) => {
                    const relevantSettings = Object.keys(settingsFile).filter((key) => settingsFile[key].section === section);
                    return <div className="settings-section-container">
                        <p className="settings-section-title">{section}</p>
                        {relevantSettings.map((key) => (
                            <div key={key}>
                                <p className="settings-viewer-title">{settingsFile[key].title}</p>
                                <p className="settings-viewer-description">{settingsFile[key].description}</p>
                                <div className="input-group input-group-sm mb-3" data-bs-theme="dark">
                                    {settingsFile[key].type === "boolean" && 
                                        <select 
                                            value={(this.state.content[key] || settingsFile[key].defaultValue).toString()} 
                                            onChange={(event)=>this.updateBooleanValue(key, event.target.value, settingsFile[key].requiresRestart)} 
                                            className={`form-select scope-select ${settingsFile[key].isDisabled ? "disabled" : ""}`}
                                            disabled={settingsFile[key].isDisabled}
                                        >
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    }
                                    {settingsFile[key].type === "select" && 
                                        <select 
                                            value={(this.state.content[key] || settingsFile[key].defaultValue).toString()} 
                                            onChange={(event)=>this.updateValue(key, event.target.value, settingsFile[key].requiresRestart)} 
                                            className={`form-select scope-select ${settingsFile[key].isDisabled ? "disabled" : ""}`}
                                            disabled={settingsFile[key].isDisabled}
                                        >
                                            {settingsFile[key].options.map((option) => (
                                                <option key={key + option} value={option}>{option}</option>
                                            ))}
                                        </select>
                }
                                </div>
                            </div>
                        ))}
                    </div>
                })}
                
            </div>
        </div>
    }
}