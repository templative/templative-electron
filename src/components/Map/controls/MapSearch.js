import React from "react";
import ReactMarkdown from 'react-markdown';
import "./MapSearch.css"

import TemplativeClient from "../../../TemplativeClient"
const settings = {
    "weight": ["Light", "Medium Light", "Medium", "Medium Heavy", "Heavy"],
    "audience": ["Everyone", "Hardcore Gamers", "Kids"],
    "duration": ["Lunch Break", "1-2 Hours", "2-4 Hours", "All Day", "All Weekend"],
    "size": ["Micro", "Normal", "Large"],
    "customComponents": ["Standard Components", "Custom Components"],
    "continent": ["Eurogame", "Ameritrash"],
    "type": ["Board Game", "Card Game", "RPG"],
    "idealPlayerCount": ["1", "2", "4", "5+"],
    "openToCrowdfunding": ["Yes", "No"]
}
const camelCaseToTitleCase = (str) => {
    const result = str.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
export default class MapSearch extends React.Component {  
    state = {
        pitch: "In Caps and Hammers, battle your opponent for ideological dominance of the planet using your spies, diplomats, soldiers, guerillas, and nukes. Avoid causes a nuclear crisis, navigate hidden information, and win the Cold War your way.",
        theme: "Cold War",
        weight: "Light",
        size: "Small",
        customComponents: "Standard Components",
        gameContinent: "Ameritrash",
        audience: "Everyone",
        duration: "2-4 Hours",
        continent: "Ameritrash",
        type: "Board Game",
        idealPlayerCount:"4",
        openToCrowdfunding: "Yes",
        response:"",
        isLoading: false,
        started: Date.now(), 
        ended: Date.now()
    }    
    setFieldOption = async (field, value) => {
        var newState = {}
        newState[field] = value
        this.setState(newState)
    }
    submitSearch = async () => {
        var content = {
            pitch: this.state.pitch, 
            theme: this.state.theme,
            weight: this.state.weight,
            size: this.state.size,
            customComponents: this.state.customComponents,
            gameContinent: this.state.gameContinent,
            audience: this.state.audience,
            duration: this.state.duration,
            continent: this.state.continent,
            type: this.state.type,
            idealPlayerCount: this.state.idealPlayerCount,
            openToCrowdfunding: this.state.openToCrowdfunding,
        }
        var message = await TemplativeClient.searchForAPublisher(this.props.email, this.props.token, JSON.stringify(content))
        this.setState({response: message, isLoading: false, ended: Date.now()})
    }
    searchForAPublisher = async () => {
        var disabled = this.state.pitch.trim() === "" || this.state.theme.trim() === "" || this.state.isLoading
        if (disabled) {
            return
        }
        this.setState({isLoading: true, response: "", started: Date.now()}, this.submitSearch)
    }
    updatePitch = async (event) => {
        this.setState({pitch: event.target.value})
    }
    updateTheme = async (event) => {
        this.setState({theme: event.target.value})
    }
    render() {
        var disabled = this.state.pitch.trim() === "" || this.state.theme.trim() === "" || this.state.isLoading
        return <div className="map-search">
            <div className="map-search-controls">
                
                <p className="preview-filter-label">Describe your game:</p>
                <div className="vertical-input-group">
                    <div className="input-group input-group-sm" data-bs-theme="dark">
                        <span className="input-group-text">Pitch</span>
                        <textarea type="text" className="form-control" placeholder=""
                            value={this.state.pitch} 
                            onChange={this.updatePitch} 
                        />
                    </div>
                    <div className="input-group input-group-sm" data-bs-theme="dark">
                        <span className="input-group-text">Theme</span>
                        <textarea type="text" className="form-control" placeholder=""
                            value={this.state.theme} 
                            onChange={this.updateTheme} 
                        />
                    </div>
                    {Object.entries(settings).map(([field, options]) => {
                        return <div key={field} className="input-group input-group-sm" data-bs-theme="dark">
                            <span className="input-group-text">{camelCaseToTitleCase(field)}</span>
                            <select value={this.state[field]} onChange={async (event) => this.setFieldOption(field, event.target.value)} className="form-select" id="inputGroupSelect01">
                                {options.map(option => 
                                    <option key={option} value={option}>{option}</option>
                                )}
                            </select>
                        </div>
                    })}
                </div>
                <button 
                    className="btn btn-outline-warning publisher-search-button" 
                    disabled={disabled} 
                    onClick={this.searchForAPublisher}
                >
                    Search for a Publisher
                </button>
            </div>
            <div className="map-search-output">
                <div className="map-search-message-output">
                    { this.state.isLoading ? 
                        "Loading..." :
                        <React.Fragment>
                            <p>{(this.state.ended - this.state.started) / 1000} seconds...</p>
                            <ReactMarkdown>{this.state.response.replace(/【\d+:\d+†[^】]+】/g, '')}</ReactMarkdown>
                        </React.Fragment>
                    }
                </div>
            </div>
        </div>
    }
}