import React from "react";
import "./PlanPanel.css"
import MotivationGroupValues from "./MotivationGroupValues"

export default class WordOptions extends React.Component {       
    render() {
        var verbButtons = []
        MotivationGroupValues.forEach(motivationGroup => {
            motivationGroup["sourcesOfMeaning"].forEach(meaning => {
                if (!this.props.chosenMeanings.has(meaning["name"])) {
                    return
                }
                var newVerbButtons = meaning["verbs"].map(verb => 
                    <button 
                        key={verb} 
                        className={`btn btn-outline-warning verb-option ${this.props.chosenVerbs.has(verb) && "selected-verb"}`}
                        onClick={()=>this.props.toggleChosenVerbSelectedCallback(verb)}
                    >
                        {meaning["emoji"]} {verb}
                    </button>
                )
                verbButtons.push(newVerbButtons)
            })
        })
        
        return <React.Fragment>
            {verbButtons}
        </React.Fragment>
    }
}