import React from "react";
import ArtdataList from "./Artdata/ArtdataList"
import GamedataList from "./Gamedata/GamedataList"
import ArtList from "./Art/ArtList"
import TemplativeAccessTools from "../../TemplativeAccessTools";
import "./TemplativeProjectRenderer.css"

const path = window.require("path")

export default class TemplativeFileExplorers extends React.Component {   
    render() {
        console.log(this.props.gameCompose)
        var templatesDirectory = path.join(this.props.templativeRootDirectoryPath, this.props.gameCompose.artTemplatesDirectory)
        var overlaysDirectory = path.join(this.props.templativeRootDirectoryPath, this.props.gameCompose.artInsertsDirectory)
        console.log(templatesDirectory)
        return <React.Fragment>
            <ArtList 
                header="Templates" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                directoryPath={templatesDirectory}
                filenames={TemplativeAccessTools.getTemplateFilenames(this.props.templativeRootDirectoryPath)}
            />
            <ArtList 
                header="Overlays" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                directoryPath={overlaysDirectory}
                filenames={TemplativeAccessTools.getOverlayFilenames(this.props.templativeRootDirectoryPath)}
            />
            <ArtdataList 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                baseFilepath={this.props.gameCompose.artdataDirectory}
                filenames={TemplativeAccessTools.getArtdataFilenames(this.props.templativeRootDirectoryPath)}
            />
            <GamedataList 
                header="Global Gamedata" 
                gamedataType="KEYVALUE_GAMEDATA" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                filenames={TemplativeAccessTools.getStudioAndGamedataFilenames(this.props.templativeRootDirectoryPath)}
            />
            <GamedataList 
                header="Components Gamedata" 
                gamedataType="KEYVALUE_GAMEDATA" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                filenames={TemplativeAccessTools.getComponentGamedataFilenames(this.props.templativeRootDirectoryPath)}
            />
            <GamedataList 
                header="Piece Gamedata" 
                gamedataType="PIECE_GAMEDATA" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                filenames={TemplativeAccessTools.getPieceGamedataFilenames(this.props.templativeRootDirectoryPath)}
            />
        </React.Fragment>        
    }
}