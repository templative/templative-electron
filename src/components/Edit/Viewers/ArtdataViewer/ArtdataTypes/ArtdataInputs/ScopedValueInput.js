import React from "react";
import "../../ArtdataViewer.css"


export default class ScopedValueInput extends React.Component {   
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
        return <React.Fragment>
            <select value={this.props.scope} onChange={(event)=>this.props.updateArtdataFieldCallback(this.props.index, "scope", event.target.value)} className="form-select scope-select no-left-border" id="inputGroupSelect01">
                <option value="global">Global</option>
                <option value="studio">Studio</option>
                <option value="game">Game</option>
                <option value="component">Component</option>
                <option value="piece">Piece</option>
                {/* <option value="utility">Utility</option> */}
            </select>
            {selectionOption}
        </React.Fragment>
    }
}