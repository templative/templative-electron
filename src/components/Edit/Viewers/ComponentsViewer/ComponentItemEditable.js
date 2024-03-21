import React from "react";
import "./ComponentViewer.css"
import TemplativeAccessTools from "../../../TemplativeAccessTools";
const path = require("path")
export default class ComponentItemEditable extends React.Component {   
    state = {
        isHovering: false,
        componentGameDataFilePath: undefined,
        pieceGameDataFilePath: undefined,
        artdataFrontFilePath: undefined,
        artdataDieFaceFilePath: undefined,
        artdataBackFilePath: undefined,
        componentGameDataExists: false,
        pieceGamedataExists: false,
        frontArtdataExists: false,
        backArtdataExists: false,
        isStock: false
    }
    componentDidUpdate = async (prevProps, prevState) => {
        await this.loadComponentData()
    }
    componentDidMount = async () => {        
        await this.loadComponentData()
    }
    loadComponentData = async () => {    
        const gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json")
        
        const componentGameDataFilePath = path.join(this.props.templativeRootDirectoryPath, gameCompose["componentGamedataDirectory"], `${this.props.componentGamedataFilename}.json`)
        const pieceGameDataFilePath = path.join(this.props.templativeRootDirectoryPath, gameCompose["piecesGamedataDirectory"], `${this.props.piecesGamedataFilename}.json`)
        const artdataFrontFilePath = path.join(this.props.templativeRootDirectoryPath, gameCompose["artdataDirectory"], `${this.props.artdataFrontFilename}.json`)
        const artdataDieFaceFilePath = path.join(this.props.templativeRootDirectoryPath, gameCompose["artdataDirectory"], `${this.props.artdataDieFaceFilename}.json`)
        const artdataBackFilePath = path.join(this.props.templativeRootDirectoryPath, gameCompose["artdataDirectory"], `${this.props.artdataBackFilename}.json`)
        this.setState({
            isStock: false,
            componentGameDataFilePath: componentGameDataFilePath,
            pieceGameDataFilePath: pieceGameDataFilePath,
            artdataFrontFilePath: artdataFrontFilePath,
            artdataDieFaceFilePath: artdataDieFaceFilePath,
            artdataBackFilePath: artdataBackFilePath,
            componentGameDataExists: await TemplativeAccessTools.doesFileExistAsync(componentGameDataFilePath),
            pieceGamedataExists: await TemplativeAccessTools.doesFileExistAsync(pieceGameDataFilePath),
            frontArtdataExists: await TemplativeAccessTools.doesFileExistAsync(artdataFrontFilePath),
            dieFaceArtdataExists: await TemplativeAccessTools.doesFileExistAsync(artdataBackFilePath),
            backArtdataExists: await TemplativeAccessTools.doesFileExistAsync(artdataBackFilePath),
        })
    }
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    goToFile = async (filetype, filepath)=> {
        if (filepath === undefined) {
            return
        }
        console.log(filepath)
        await this.props.updateViewedFileUsingExplorerAsyncCallback(filetype, filepath)
    }
    static arrayHasValue = (array, value) => {
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (value == element) {
                return true
            }
        }
        return false
    }
    render() {
        var isDebug = this.props.isDebugInfo === true
        const hasCustomComponentInfo = this.props.componentTypesCustomInfo[this.props.componentType] != null
        var hasFrontArtdata = hasCustomComponentInfo && ComponentItemEditable.arrayHasValue(this.props.componentTypesCustomInfo[this.props.componentType]["ArtDataTypeNames"], "Front")
        var hasDieFaceArtdata = hasCustomComponentInfo && ComponentItemEditable.arrayHasValue(this.props.componentTypesCustomInfo[this.props.componentType]["ArtDataTypeNames"], "DieFace")
        var hasBackArtdata = hasCustomComponentInfo && ComponentItemEditable.arrayHasValue(this.props.componentTypesCustomInfo[this.props.componentType]["ArtDataTypeNames"], "Back")
        return <div className="vertical-input-group editable-component" 
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}>
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                <span className="input-group-text component-left-bumper">Name</span>
                <input type="text" aria-label="First name" className="form-control " 
                    onChange={(event) => this.props.updateFloatingNameCallback(event.target.value)}
                    onBlur={() => this.props.releaseFloatingNameCallback()}
                    value={this.props.isFloatingName ? this.props.floatingName : this.props.componentName}/> 
                {this.state.isHovering && 
                    <React.Fragment>
                        <button onClick={()=>this.props.duplicateComponentCallback()} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg></button>
                        <button onClick={()=>this.props.deleteComponentCallback()} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/></svg></button>
                    </React.Fragment>
                }               
            </div>
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                <span className="input-group-text component-left-bumper">Type</span>
                <input type="text" aria-label="First name" className="form-control" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("type", event.target.value)} 
                    value={this.props.componentType}/>
            </div> 
            
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
            { this.state.componentGameDataExists ? 
                <button onClick={async () => await this.goToFile("KEYVALUE_GAMEDATA", this.state.componentGameDataFilePath)} className="btn btn-outline-secondary go-to-template-button component-left-bumper" type="button">Component Gamedata ↗</button> :
                <span className="input-group-text component-left-bumper">Component Gamedata</span>
            }
            <input type="text" aria-label="First name" className="form-control"                     
                onChange={(event)=>this.props.updateComponentFieldCallback("componentGamedataFilename", event.target.value)} 
                value={this.props.componentGamedataFilename}/>
            </div>
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                { this.state.pieceGamedataExists ? 
                    <button onClick={async () => await this.goToFile("PIECE_GAMEDATA", this.state.pieceGameDataFilePath)} className="btn btn-outline-secondary go-to-template-button component-left-bumper" type="button">Piece Gamedata ↗</button> :
                    <span className="input-group-text component-left-bumper">Piece Gamedata</span>
                }
                <input type="text" aria-label="First name" className="form-control" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("piecesGamedataFilename", event.target.value)} 
                    value={this.props.piecesGamedataFilename}/>
            </div>

            { hasFrontArtdata &&
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                { this.state.frontArtdataExists ? 
                    <button onClick={async () => await this.goToFile("ARTDATA", this.state.artdataFrontFilePath)} className="btn btn-outline-secondary go-to-template-button component-left-bumper" type="button">Front Artdata ↗</button> :
                    <span className="input-group-text component-left-bumper">Front Artdata</span>
                }
                
                <input type="text" aria-label="First name" className="form-control" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("artdataFrontFilename", event.target.value)}
                    value={this.props.artdataFrontFilename}/>
            </div>
            }
            { hasDieFaceArtdata &&
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                { this.state.dieFaceArtdataExists ? 
                    <button 
                        onClick={async () => await this.goToFile("ARTDATA", this.state.artdataDieFaceFilePath)} 
                        className="btn btn-outline-secondary go-to-template-button component-left-bumper" 
                        type="button"
                    >
                        Die Face Artdata ↗
                    </button> :
                    <span className="input-group-text component-left-bumper">Die Face Artdata</span>
                }
                
                <input type="text" aria-label="First name" className="form-control" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("artdataDieFaceFilename", event.target.value)}
                    value={this.props.artdataDieFaceFilename}/>
            </div>
            }
            { hasBackArtdata &&
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                { this.state.backArtdataExists ? 
                    <button onClick={async () => await this.goToFile("ARTDATA", this.state.artdataBackFilePath)} className="btn btn-outline-secondary go-to-template-button component-left-bumper" type="button">Back Artdata ↗</button> :
                    <span className="input-group-text component-left-bumper">Back Artdata</span>
                }
                <input type="text" aria-label="First name" className="form-control" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("artdataBackFilename", event.target.value)}
                    value={this.props.artdataBackFilename}/>
            </div>
            }

            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                
                <span className="input-group-text component-left-bumper">Quantity</span>
                <input type="text" aria-label="First name" className="form-control" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("quantity", event.target.value)}
                    value={this.props.quantity}/>

                <span className="input-group-text no-right-border">Disabled</span>
                <div className="input-group-text no-left-border">
                    <input className="form-check-input mt-0" type="checkbox" value="" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("disabled", !this.props.disabled)}
                    checked={this.props.disabled} aria-label="Checkbox for following text input" />
                </div>

                <span className="input-group-text no-right-border">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bug" viewBox="0 0 16 16"><path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/></svg>
                </span>
                <div className="input-group-text no-left-border">
                    <input className="form-check-input mt-0" type="checkbox" value="" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("isDebugInfo", !isDebug)}
                    checked={isDebug} aria-label="Checkbox for following text input" />
                </div>

            </div>
        </div> 
    }
}