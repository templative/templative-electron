import React from "react";
import "./PlanPanel.css"
import MotivationGroupValues from "./MotivationGroupValues"
import MotivationGroup from "./MotivationGroup"
import WordOptions from "./WordOptions";
import GameExplanation from "./GameExplanation";

export default class PlanPanel extends React.Component {   
    state={
        chosenMeanings: new Set(),
        chosenVerbs: new Set(),
        gameName: "Space Off",
        gameObject: "compete in alien olympics with your friends",
        gameSetting: "Oh no! You're stuck in the alien ghetto and have to dance your way out! Are you a bad enough dood to rebuild your ship?"
    }

    toggleMeaningSelected = (meaning) => {
        var newChosenMeanings = this.state.chosenMeanings
        if (newChosenMeanings.has(meaning)) {
            newChosenMeanings.delete(meaning)
        }
        else {
            newChosenMeanings.add(meaning)
        }
        this.setState({ chosenMeanings: newChosenMeanings })
    }
    toggleChosenVerbSelected = (verb) => {
        var newChosenVerbs = this.state.chosenVerbs
        if (newChosenVerbs.has(verb)) {
            newChosenVerbs.delete(verb)
        }
        else {
            newChosenVerbs.add(verb)
        }
        this.setState({ chosenVerbs: newChosenVerbs })
    }
    
    render() {
        var motivationGroups = MotivationGroupValues.map((motivationGroup) => 
            <MotivationGroup 
                key={motivationGroup["name"]} 
                motivationGroup={motivationGroup}
                chosenMeanings={this.state.chosenMeanings} 
                toggleMeaningSelectedCallback={this.toggleMeaningSelected} 
            />
        )

        return <div className='mainBody row'>
            <div className="col">
                <div className="row main-input-row">
                    <div className="col">
                        <div className="input-group input-group-sm" data-bs-theme="dark">
                            <span className="input-group-text" id="basic-addon3">Game Name</span>
                            <input className="form-control" value={this.state.gameName} readOnly placeholder="Name your game!" aria-label="The name of the game"/>
                            <span className="input-group-text" id="basic-addon3">Object of the Game</span>
                            <input className="form-control" value={this.state.gameObject} readOnly placeholder="What's the objective?" aria-label="The name of the game"/>
                        </div>
                    </div>
                </div>
                <div className="row meaning-choices-row">
                    <div className="col-2 plan-col-left">
                        {motivationGroups}
                    </div>
                    <div className="col plan-col-right">
                        <WordOptions 
                            chosenMeanings={this.state.chosenMeanings} 
                            chosenVerbs={this.state.chosenVerbs} 
                            toggleChosenVerbSelectedCallback={this.toggleChosenVerbSelected}/>
                        <GameExplanation 
                            gameName={this.state.gameName} 
                            idealPlayerCount={4} 
                            gameObject={this.state.gameObject} 
                            gameSetting={this.state.gameSetting} 
                            chosenVerbs={this.state.chosenVerbs} 
                        />
                    </div>
                </div>
            </div>
            
        </div>
    }
}