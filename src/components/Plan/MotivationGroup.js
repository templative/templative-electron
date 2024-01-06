import React from "react";
import "./PlanPanel.css"

export default class MotivationGroup extends React.Component {       
    render() {
        var buttons = this.props.motivationGroup["sourcesOfMeaning"].map((meaning)=>
            <button 
                onClick={()=>this.props.toggleMeaningSelectedCallback(meaning["name"])} 
                className={`btn btn-outline-warning source-of-meaning-button ${this.props.chosenMeanings.has(meaning["name"]) && "selected-meaning"}`}>
                    {meaning["emoji"]} {meaning["name"]}
            </button>
        )
        
        return <React.Fragment>
            {buttons}
        </React.Fragment>
    }
}