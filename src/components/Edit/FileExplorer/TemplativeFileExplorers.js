import React from "react";
import ArtdataList from "./Artdata/ArtdataList"
import GamedataList from "./Gamedata/GamedataList"
import ArtList from "./Art/ArtList"
import TemplativeAccessTools from "../../TemplativeAccessTools";
import "./TemplativeProjectRenderer.css"

const path = window.require("path")
const fs = window.require("fs")

export default class TemplativeFileExplorers extends React.Component {   
    state = {
        gameCompose: undefined,
        templateFilenames: [],
        overlayFilenames: [],
        artdataFilenames: [],
        globalGamedataFilenames: [],
        componentGamedataFilenames: [],
        pieceGamedataFilenames: [],
        templatesDirectory: "./",
        overlaysDirectory: "./",
    }

    createFile(filepath, contents) {
        fs.writeFileSync(filepath, contents)
        
        this.setState({
            templateFilenames: TemplativeAccessTools.getTemplateFilenames(this.props.templativeRootDirectoryPath),
            overlayFilenames: TemplativeAccessTools.getOverlayFilenames(this.props.templativeRootDirectoryPath),
            artdataFilenames: TemplativeAccessTools.getArtdataFilenames(this.props.templativeRootDirectoryPath),
            globalGamedataFilenames: TemplativeAccessTools.getStudioAndGamedataFilenames(this.props.templativeRootDirectoryPath),
            componentGamedataFilenames: TemplativeAccessTools.getComponentGamedataFilenames(this.props.templativeRootDirectoryPath),
            pieceGamedataFilenames: TemplativeAccessTools.getPieceGamedataFilenames(this.props.templativeRootDirectoryPath)
        })
    }
    deleteFile(filepath) {
        if (this.props.currentFilepath === filepath) {
            this.props.clearViewedFileCallback()
        }
        fs.unlinkSync(filepath)
        this.setState({
            templateFilenames: TemplativeAccessTools.getTemplateFilenames(this.props.templativeRootDirectoryPath),
            overlayFilenames: TemplativeAccessTools.getOverlayFilenames(this.props.templativeRootDirectoryPath),
            artdataFilenames: TemplativeAccessTools.getArtdataFilenames(this.props.templativeRootDirectoryPath),
            globalGamedataFilenames: TemplativeAccessTools.getStudioAndGamedataFilenames(this.props.templativeRootDirectoryPath),
            componentGamedataFilenames: TemplativeAccessTools.getComponentGamedataFilenames(this.props.templativeRootDirectoryPath),
            pieceGamedataFilenames: TemplativeAccessTools.getPieceGamedataFilenames(this.props.templativeRootDirectoryPath)
        })
    }
    
    componentDidMount() {
        var gameCompose = TemplativeAccessTools.readFile(this.props.templativeRootDirectoryPath, "game-compose.json");
        
        this.setState({
            gameCompose: gameCompose,

            templatesDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.artTemplatesDirectory),
            overlaysDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.artInsertsDirectory),
            artdataDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.artdataDirectory),
            piecesGamedataDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.piecesGamedataDirectory),
            componentGamedataDirectory: path.join(this.props.templativeRootDirectoryPath, gameCompose.componentGamedataDirectory),

            templateFilenames: TemplativeAccessTools.getTemplateFilenames(this.props.templativeRootDirectoryPath),
            overlayFilenames: TemplativeAccessTools.getOverlayFilenames(this.props.templativeRootDirectoryPath),
            artdataFilenames: TemplativeAccessTools.getArtdataFilenames(this.props.templativeRootDirectoryPath),
            globalGamedataFilenames: TemplativeAccessTools.getStudioAndGamedataFilenames(this.props.templativeRootDirectoryPath),
            componentGamedataFilenames: TemplativeAccessTools.getComponentGamedataFilenames(this.props.templativeRootDirectoryPath),
            pieceGamedataFilenames: TemplativeAccessTools.getPieceGamedataFilenames(this.props.templativeRootDirectoryPath)
        })
    }

    render() {
        return <React.Fragment>
            <ArtList 
                header="Templates" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                directoryPath={this.state.templatesDirectory}
                filenames={this.state.templateFilenames}
            />
            <ArtList 
                header="Overlays" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                directoryPath={this.state.overlaysDirectory}
                filenames={this.state.overlayFilenames}
                deleteFileCallback={(filepath) => this.deleteFile(filepath)}
            />
            <ArtdataList 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                baseFilepath={this.state.artdataDirectory}
                filenames={this.state.artdataFilenames}
                createFileCallback={(filepath, contents)=>this.createFile(filepath, contents)}
                deleteFileCallback={(filepath) => this.deleteFile(filepath)}
            />
            <GamedataList 
                header="Global Gamedata" 
                gamedataType="KEYVALUE_GAMEDATA" 
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                canCreateNewFiles={false}
                filenames={this.state.globalGamedataFilenames}
            />
            <GamedataList 
                header="Components Gamedata" 
                gamedataType="KEYVALUE_GAMEDATA" 
                baseFilepath={this.state.componentGamedataDirectory}
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                filenames={this.state.componentGamedataFilenames}
                canCreateNewFiles={true}
                createFileCallback={(filepath, contents)=>this.createFile(filepath, contents)}
                deleteFileCallback={(filepath) => this.deleteFile(filepath)}
            />
            <GamedataList 
                header="Piece Gamedata" 
                gamedataType="PIECE_GAMEDATA" 
                baseFilepath={this.state.piecesGamedataDirectory}
                currentFilepath={this.props.currentFilepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                filenames={this.state.pieceGamedataFilenames}
                canCreateNewFiles={true}
                createFileCallback={(filepath, contents)=>this.createFile(filepath, contents)}
                deleteFileCallback={(filepath) => this.deleteFile(filepath)}
            />
        </React.Fragment>        
    }
}