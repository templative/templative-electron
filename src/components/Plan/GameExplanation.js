import React from "react";
import "./PlanPanel.css"

const objectValues = [
    "the bingle",
    "your bongles",
    "the dingles",
    "the dangle",
    "the yikkity doo",
    "the yikkity dah",
    "the ping pong",
    "the tootah"
]

export default class GameExplanation extends React.Component {       
    render() {        
        var verbExplanations = []
        for(const verb of this.props.chosenVerbs) {
            verbExplanations.push(<span key={verb}>{`${verb[0].toUpperCase()}${verb.substring(1)}`} {objectValues[verbExplanations.length % objectValues.length]}. </span>)
        }
        return <div className="row game-explanations">
            <p className="setting-explanation">{this.props.gameSetting}</p>
            <p><span className="game-title">{this.props.gameName}</span> is a {this.props.idealPlayerCount} player game where you {this.props.gameObject}. {verbExplanations}</p>
        </div>
    }
}