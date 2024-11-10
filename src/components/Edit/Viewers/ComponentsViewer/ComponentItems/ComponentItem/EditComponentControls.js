import React from "react";
import AutocompleteInput from "../AutocompleteInput";
import FilepathsAutocompleteInput from "../FilepathsAutocompleteInput";

const path = require("path")

export default class EditComponentControls extends React.Component {   
        
    render() {
        return <div className="vertical-input-group editable-component">
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                <span className="input-group-text component-left-bumper">Name</span>
                <input type="text" aria-label="First name" className="form-control " 
                    onChange={(event) => this.props.updateFloatingNameCallback(event.target.value)}
                    onBlur={() => this.props.releaseFloatingNameCallback()}
                    value={this.props.isFloatingName ? this.props.floatingName : this.props.componentName}/> 

                {this.props.isHovering && 
                    <React.Fragment>
                        <button onClick={this.props.deleteComponentCallback} className="btn btn-outline-secondary trash-button" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </button>
                        <button onClick={this.props.duplicateComponentCallback} className="btn btn-outline-secondary trash-button" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                            </svg>
                        </button>
                        <button onClick={this.props.toggleIsEditingCallback} className="btn btn-outline-secondary trash-button" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                            </svg>
                        </button>
                    </React.Fragment>
                }               
            </div>
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                <span className="input-group-text component-left-bumper">Type</span>
                <AutocompleteInput 
                    value={this.props.componentType} 
                    onChange={(value)=> this.props.updateComponentFieldCallback("type", value)}
                    ariaLabel="Type"
                    options={this.props.typeOptions}
                />
            </div>
            
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                { this.props.componentGameDataExists ? 
                    <button onClick={async () => await this.props.goToFileCallback("COMPONENT_GAMEDATA", this.props.componentGameDataFilePath)} className="btn btn-outline-secondary go-to-template-button component-left-bumper" type="button">Component Gamedata ↗</button> :
                    <span className="input-group-text component-left-bumper">Component Gamedata</span>
                }
                <FilepathsAutocompleteInput 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    value={this.props.componentGamedataFilename} 
                    onChange={(value)=> this.props.updateComponentFieldCallback("componentGamedataFilename", value)}
                    ariaLabel="Component Gamedata Filename"
                    gameComposeDirectory="componentGamedataDirectory"
                />
            </div>
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                { this.props.pieceGamedataExists ? 
                    <button onClick={async () => await this.props.goToFileCallback("PIECE_GAMEDATA", this.props.pieceGameDataFilePath)} className="btn btn-outline-secondary go-to-template-button component-left-bumper" type="button">Piece Gamedata ↗</button> :
                    <span className="input-group-text component-left-bumper">Piece Gamedata</span>
                }
                
                <FilepathsAutocompleteInput 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    value={this.props.piecesGamedataFilename} 
                    onChange={(value)=> this.props.updateComponentFieldCallback("piecesGamedataFilename", value)}
                    ariaLabel="Pieces Gamedata Filename"
                    gameComposeDirectory="piecesGamedataDirectory"

                />
            </div>

            { this.props.hasFrontArtdata &&
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                { this.props.frontArtdataExists ? 
                    <button onClick={async () => await this.props.goToFileCallback("ARTDATA", this.props.artdataFrontFilePath)} className="btn btn-outline-secondary go-to-template-button component-left-bumper" type="button">Front Artdata ↗</button> :
                    <span className="input-group-text component-left-bumper">Front Artdata</span>
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
            { this.props.hasDieFaceArtdata &&
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                { this.props.dieFaceArtdataExists ? 
                    <button 
                        onClick={async () => await this.props.goToFileCallback("ARTDATA", this.props.artdataDieFaceFilePath)} 
                        className="btn btn-outline-secondary go-to-template-button component-left-bumper" 
                        type="button"
                    >
                        Die Face Artdata ↗
                    </button> :
                    <span className="input-group-text component-left-bumper">Die Face Artdata</span>
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
            { this.props.hasBackArtdata &&
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                { this.props.backArtdataExists ? 
                    <button onClick={async () => await this.props.goToFileCallback("ARTDATA", this.props.artdataBackFilePath)} className="btn btn-outline-secondary go-to-template-button component-left-bumper" type="button">Back Artdata ↗</button> :
                    <span className="input-group-text component-left-bumper">Back Artdata</span>
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

            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                
                <span className="input-group-text component-left-bumper">Quantity</span>
                <input type="number" aria-label="Quantity" className="form-control" 
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

                <span className="input-group-text no-right-border">Disabled</span>
                <div className="input-group-text no-left-border">
                    <input className="form-check-input mt-0" type="checkbox" value="" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("disabled", !this.props.disabled)}
                    checked={this.props.disabled} aria-label="Checkbox for following text input" />
                </div>
            </div>
        </div>
    }
}