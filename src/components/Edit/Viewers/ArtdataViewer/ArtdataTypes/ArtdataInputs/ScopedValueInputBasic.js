import React from "react";
import "../../ArtdataViewer.css"

import studioIcon from "../../../../Icons/studioIcon.svg"
import gameIcon from "../../../../Icons/gameIcon.svg"
import componentIcon from "../../../../Icons/componentIcon.svg"
import pieceIcon from "../../../../Icons/pieceIcon.svg"
import staticValueIcon from "../../../../Icons/staticValueIcon.svg"

export default class ScopedValueInputBasic extends React.Component {   
    createSelectionOption = (scope) => {
        const defaultInput = <input type="text" className="form-control no-left-border" onChange={(event)=>this.props.updateArtdataFieldCallback(this.props.index, "source", event.target.value)} aria-label="What key to get from the scope..." value={this.props.source}/>
        
        const utilitySelectInput = <select value={this.props.scope} onChange={(event)=>this.props.updateArtdataFieldCallback(this.props.index, "source", event.target.value)} className="form-select">
            <option value="git-sha">Current Git Commit Hash</option>
        </select>
        
        switch(scope) {
            case "utility":
                return utilitySelectInput
            default: 
                return defaultInput
        }
    } 

    render() {
        const selectionOption = this.createSelectionOption(this.props.scope)
        const icons = {
            "studio": studioIcon,
            "game": gameIcon,
            "component": componentIcon,
            "piece": pieceIcon,
            "global": staticValueIcon,
        }
        return <React.Fragment>
            <span className="input-group-text scope-icon-container"><img className="scope-icon" src={icons[this.props.scope]} alt="Tab icon"/> </span>
            <select value={this.props.scope} onChange={(event)=>this.props.updateArtdataFieldCallback(this.props.index, "scope", event.target.value)} className="form-select scope-select">
                <option value="global">Static Value</option>
                <option value="studio">Studio's</option>
                <option value="game">Game's</option>
                <option value="component">Component's</option>
                <option value="piece">Piece's</option>
                {/* <option value="utility">Utility</option> */}
            </select>
            {selectionOption}
        </React.Fragment>
    }
}