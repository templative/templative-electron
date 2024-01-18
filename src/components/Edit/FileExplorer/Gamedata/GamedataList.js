import React from "react";
import "../Artdata/Artdata.css"
import GamedataItem from "./GamedataItem"
import ResourceHeader from "../ResourceHeader";
import NewFileInput from "../NewFileInput"

const path = window.require("path")

export default class GamedataList extends React.Component {
    state = {
        doesNewGamedataFileExist: false
    }
    createGamedataFile() {
        this.setState({doesNewGamedataFileExist: true})
    }
    submitNewFilename = (filename) => {
        this.setState({doesNewGamedataFileExist: false})
        var filepath = path.join(this.props.baseFilepath, `${filename}.json`)
        console.log(filepath)
        const data = this.props.gamedataType === "PIECE_GAMEDATA" ? `[]` : `{"displayName": "${filename}", "pieceDisplayName": "${filename}" }`
        this.props.createFileCallback(filepath, data)
    }
    cancelFileCreation = () => {
        this.setState({doesNewGamedataFileExist: false})
    }

    render() {
        var divs = [];
        if (this.state.doesNewGamedataFileExist) {
            divs.push(this.state.doesNewGamedataFileExist && 
                <NewFileInput 
                    key="newFileInput" 
                    cancelFileCreationCallback={this.cancelFileCreation}
                    submitNewFilenameCallback={this.submitNewFilename}
                />
            )
        }

        for(var i = 0; i < this.props.filenames.length; i++) {
            var filepath = this.props.filenames[i]
            var isSelected = this.props.currentFilepath === filepath
            divs.push(<GamedataItem 
                gamedataType={this.props.gamedataType} 
                isSelected={isSelected} 
                key={filepath} 
                updateViewedFileCallback={this.props.updateViewedFileCallback} 
                filepath={filepath}
                deleteFileCallback={this.props.deleteFileCallback}
                renameFileCallback={this.props.renameFileCallback}
            />)
        }

        var createFileCallback = undefined
        if (this.props.canCreateNewFiles) {
            createFileCallback = () => this.createGamedataFile()
        }

        return <React.Fragment>
            <ResourceHeader header={this.props.header} directory={this.props.directoryPath} createFileCallback={createFileCallback}/> 
            <div className="artdata">
                {divs}
            </div> 
        </React.Fragment>
    }
}