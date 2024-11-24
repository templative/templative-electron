import React from "react";
import AutocompleteInput from "./AutocompleteInput";
import FilepathsAutocompleteInput from "./FilepathsAutocompleteInput";
import artdataIcon from "../../../Icons/artDataIcon.svg"
import componentIcon from "../../../Icons/componentIcon.svg"
import pieceIcon from "../../../Icons/pieceIcon.svg"
const path = require("path")
import socket from "../../../../../socket"

export default class EditComponentControls extends React.Component {  
    state = {
        isProcessing: false,
    } 
    renderComponent = async () => {
        this.setState({isProcessing: true})
        var request = {
            isDebug: false,
            isComplex: true,
            componentFilter: this.props.componentName,
            language: "en",
            directoryPath: this.props.templativeRootDirectoryPath,
        }
        socket.emit('produceGame', request);
        await new Promise(resolve => setTimeout(resolve, 125)); // Wait 1/8 second
        this.setState({isProcessing: false})
        this.props.updateRouteCallback("render")
    }
    render() {
        return <div className="vertical-input-group editable-component">
            <div className={`input-group mb-3 input-group-sm mb-3`} data-bs-theme="dark">
                <span className="input-group-text component-left-bumper">Name</span>
                <input type="text" aria-label="First name" className="form-control " 
                    onChange={(event) => this.props.updateFloatingNameCallback(event.target.value)}
                    onBlur={() => this.props.releaseFloatingNameCallback()}
                    value={this.props.isFloatingName ? this.props.floatingName : this.props.componentName}/> 
                <span className="input-group-text">Type</span>
                <AutocompleteInput 
                    value={this.props.componentType} 
                    onChange={(value)=> this.props.updateComponentFieldCallback("type", value)}
                    ariaLabel="Type"
                    options={this.props.typeOptions}
                />
                <span className="input-group-text">Quantity</span>
                <input type="number" aria-label="Quantity" className="form-control component-quantity-input" 
                    onChange={(event) => {
                        const value = event.target.value;
                        if (value === '-' || value === '') {
                            this.props.updateComponentFieldCallback("quantity", value)
                        } else {
                            const numValue = parseInt(value);
                            if (!isNaN(numValue)) {
                                this.props.updateComponentFieldCallback("quantity", numValue)
                            }
                        }
                    }}
                    value={this.props.quantity}/>
               
                
                <button onClick={this.props.duplicateComponentCallback} className="btn btn-outline-secondary trash-button" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                    </svg>
                </button>     
                <button onClick={() => this.props.deleteComponentCallback()} disabled={this.state.isProcessing} className="btn btn-outline-secondary trash-button" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                </button>
            </div>
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                { this.props.pieceGamedataExists ? 
                    <button onClick={async () => await this.props.goToFileCallback("PIECE_GAMEDATA", this.props.pieceGameDataFilePath)} className="btn btn-outline-secondary go-to-template-button component-left-bumper" type="button"><img src={pieceIcon} className="component-file-goto-img"/> Piece Content ↗</button> :
                    <span className="input-group-text component-left-bumper"><img src={pieceIcon} className="component-file-goto-img"/> Piece Content</span>
                }
                
                <FilepathsAutocompleteInput 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    value={this.props.piecesGamedataFilename} 
                    onChange={(value)=> this.props.updateComponentFieldCallback("piecesGamedataFilename", value)}
                    ariaLabel="Pieces Gamedata Filename"
                    gameComposeDirectory="piecesGamedataDirectory"
                />
            </div>
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                { this.props.componentGameDataExists ? 
                    <button onClick={async () => await this.props.goToFileCallback("COMPONENT_GAMEDATA", this.props.componentGameDataFilePath)} className="btn btn-outline-secondary go-to-template-button component-left-bumper" type="button"><img src={componentIcon} className="component-file-goto-img"/> Component Content ↗</button> :
                    <span className="input-group-text component-left-bumper"><img src={componentIcon} className="component-file-goto-img"/> Component Content</span>
                }
                <FilepathsAutocompleteInput 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    value={this.props.componentGamedataFilename} 
                    onChange={(value)=> this.props.updateComponentFieldCallback("componentGamedataFilename", value)}
                    ariaLabel="Component Gamedata Filename"
                    gameComposeDirectory="componentGamedataDirectory"
                />
                
            </div>

            { this.props.hasFrontArtdata &&
                <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                    { this.props.frontArtdataExists ? 
                        <button onClick={async () => await this.props.goToFileCallback("ARTDATA", this.props.artdataFrontFilePath)} className="btn btn-outline-secondary go-to-template-button component-left-bumper" type="button"><img src={artdataIcon} className="component-file-goto-img"/> Front Art Recipe ↗</button> :
                        <span className="input-group-text component-left-bumper"><img src={artdataIcon} className="component-file-goto-img"/> Front Art Recipe</span>
                    }
                    
                    <FilepathsAutocompleteInput 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        value={this.props.artdataFrontFilename} 
                        onChange={(value)=> this.props.updateComponentFieldCallback("artdataFrontFilename", value)}
                        ariaLabel="Front Artdata Filename"
                        gameComposeDirectory="artdataDirectory"
                        />
                </div>
            }
            { this.props.hasBackArtdata &&
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                { this.props.backArtdataExists ? 
                        <button onClick={async () => await this.props.goToFileCallback("ARTDATA", this.props.artdataBackFilePath)} className="btn btn-outline-secondary go-to-template-button component-left-bumper" type="button"><img src={artdataIcon} className="component-file-goto-img"/> Back Art Recipe ↗</button> :
                        <span className="input-group-text component-left-bumper"><img src={artdataIcon} className="component-file-goto-img"/> Back Art Recipe</span>
                    }
                    <FilepathsAutocompleteInput 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        value={this.props.artdataBackFilename} 
                        onChange={(value)=> this.props.updateComponentFieldCallback("artdataBackFilename", value)}
                        ariaLabel="Back Artdata Filename"
                        gameComposeDirectory="artdataDirectory"
                    />
            </div>
            }
            { this.props.hasDieFaceArtdata &&
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                
                    { this.props.dieFaceArtdataExists ? 
                        <button 
                            onClick={async () => await this.props.goToFileCallback("ARTDATA", this.props.artdataDieFaceFilePath)} 
                            className="btn btn-outline-secondary go-to-template-button component-left-bumper" 
                            type="button"
                        >
                            <img src={artdataIcon} className="component-file-goto-img"/>Die Face Artdata ↗
                        </button> :
                        <span className="input-group-text component-left-bumper"><img src={artdataIcon} className="component-file-goto-img"/> Die Face Art Recipe</span>
                    }
                    
                    <FilepathsAutocompleteInput 
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        value={this.props.artdataDieFaceFilename} 
                        onChange={(value)=> this.props.updateComponentFieldCallback("artdataDieFaceFilename", value)}
                        ariaLabel="Die Face Artdata Filename"
                        gameComposeDirectory="artdataDirectory"
                    />
            </div>
            }

            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                <button onClick={async () => await this.props.openUnifiedComponentViewCallback(this.props.componentName)} className="btn btn-outline-secondary edit-component-button" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square component-use-icon" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg> Edit Component
                </button>
                <button onClick={async ()=>{await this.renderComponent()}} disabled={this.state.isProcessing} className="btn btn-outline-secondary render-component-button" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-brush component-use-icon" viewBox="0 0 16 16">
                        <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04M4.705 11.912a1.2 1.2 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.4 3.4 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3 3 0 0 0 .126-.75zm1.44.026c.12-.04.277-.1.458-.183a5.1 5.1 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005zm3.582-3.043.002.001h-.002z"/>
                    </svg> Render Component
                </button>
                
                <span className="input-group-text no-right-border disabled-header">Disabled</span>
                <div className="input-group-text no-left-border">
                    <input className="form-check-input mt-0" type="checkbox" value="" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("disabled", !this.props.disabled)}
                    checked={this.props.disabled} aria-label="Checkbox for following text input" />
                </div>
            </div>
        </div>
    }
}