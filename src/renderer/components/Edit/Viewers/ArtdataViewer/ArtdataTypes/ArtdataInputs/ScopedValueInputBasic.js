import React from "react";
import "../../ArtdataViewer.css"

import studioIcon from "../../../../Icons/studioIcon.svg?react"
import gameIcon from "../../../../Icons/gameIcon.svg?react"
import componentIcon from "../../../../Icons/componentIcon.svg?react"
import pieceIcon from "../../../../Icons/pieceIcon.svg?react"
import staticValueIcon from "../../../../Icons/staticValueIcon.svg?react"

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
        const IconElement = icons[this.props.scope]
        var title = this.props.scope === 'global' ? 
            `Use the value '${this.props.source}' directly.` :
            `Use the '${this.props.source}' field in the ${this.props.scope[0].toUpperCase() + this.props.scope.slice(1)} Content.`
        return <React.Fragment>
            <span className="input-group-text scope-icon-container no-left-border" title={title}><IconElement className="scope-icon"/> </span>
            <select value={this.props.scope} onChange={(event)=>this.props.updateArtdataFieldCallback(this.props.index, "scope", event.target.value)} className="form-select scope-select" title={title}>
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