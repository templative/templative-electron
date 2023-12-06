import React from "react";
import ArtdataList from "./Artdata/ArtdataList"
import GamedataList from "./Gamedata/GamedataList"
import ArtList from "./Art/ArtList"

import "./TemplativeProjectRenderer.css"

export default class TemplativeProjectRenderer extends React.Component {   

    render() {
        return <div className="resources">
            <div className="d-grid gap-2">
                <button className="btn btn-outline-secondary open-components-button" onClick={this.props.openComponentsCallback}>Components</button>
            </div>
            <ArtList 
                header="Templates" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                baseFilepath={this.props.templativeProject.gameCompose.artTemplatesDirectory}
                filenames={this.props.templativeProject.getTemplateFilenames()}
                directoryPath={this.props.templativeProject.gameCompose.artTemplatesDirectory}
            />
            <ArtList 
                header="Overlays" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                baseFilepath={this.props.templativeProject.gameCompose.artInsertsDirectory}
                filenames={this.props.templativeProject.getOverlayFilenames()}
                directoryPath={this.props.templativeProject.gameCompose.artInsertsDirectory}
            />
            <ArtdataList 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                baseFilepath={this.props.templativeProject.gameCompose.artdataDirectory}
                filenames={this.props.templativeProject.getArtdataFilenames()}
            />
            <GamedataList 
                header="Global Gamedata" 
                gamedataType="KEYVALUE_GAMEDATA" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                filenames={this.props.templativeProject.getStudioAndGamedataFilenames()}
            />
            <GamedataList 
                header="Components Gamedata" 
                gamedataType="KEYVALUE_GAMEDATA" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                filenames={this.props.templativeProject.getComponentGamedataFilenames()}
            />
            <GamedataList 
                header="Piece Gamedata" 
                gamedataType="PIECE_GAMEDATA" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                filenames={this.props.templativeProject.getPieceGamedataFilenames()}
            />
        </div>        
    }
}