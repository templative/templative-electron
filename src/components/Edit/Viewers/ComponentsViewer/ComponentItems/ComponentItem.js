import React from "react";
import "./ComponentItem.css"
import TemplativeAccessTools from "../../../../TemplativeAccessTools";
import artdataIcon from "../../../Icons/artDataIcon.svg"
import componentIcon from "../../../Icons/componentIcon.svg"
import pieceIcon from "../../../Icons/pieceIcon.svg"
import ComponentUpshotControls from "./ComponentItem/ComponentUpshotControls";
import EditComponentControls from "./ComponentItem/EditComponentControls";
const path = require("path")

export default class ComponentItem extends React.Component {   
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
        dieFaceArtdataExists: false,
        thumbnailSource: undefined,
        isEditing: false,
        isStock: false,
    }
    toggleIsEditing = () => {
        this.setState({isEditing: !this.state.isEditing})
    }
    componentDidUpdate = async (prevProps, prevState) => {
        await this.loadComponentData()
    }
    loadThumbnail = async () => {
        var thumbnailSource = await TemplativeAccessTools.getMostRecentComponentImage(this.props.templativeRootDirectoryPath, this.props.componentName)
        this.setState({thumbnailSource: thumbnailSource})
    }
    componentDidMount = async () => { 
        await this.loadComponentData()
        await this.loadThumbnail()
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
            dieFaceArtdataExists: await TemplativeAccessTools.doesFileExistAsync(artdataDieFaceFilePath),
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
        await this.props.updateViewedFileUsingExplorerAsyncCallback(filetype, filepath)
    }
    static arrayHasValue = (array, value) => {
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (value === element) {
                return true
            }
        }
        return false
    }
    render() {
        var isDebug = this.props.isDebugInfo === true
        const hasCustomComponentInfo = this.props.componentTypesCustomInfo[this.props.componentType] != null

        var hasFrontArtdata = hasCustomComponentInfo && ComponentItem.arrayHasValue(this.props.componentTypesCustomInfo[this.props.componentType]["ArtDataTypeNames"], "Front")
        var hasDieFaceArtdata = hasCustomComponentInfo && ComponentItem.arrayHasValue(this.props.componentTypesCustomInfo[this.props.componentType]["ArtDataTypeNames"], "DieFace")
        var hasBackArtdata = hasCustomComponentInfo && ComponentItem.arrayHasValue(this.props.componentTypesCustomInfo[this.props.componentType]["ArtDataTypeNames"], "Back")

        var stockOptions = Object.keys(this.props.componentTypesStockInfo).map(key => "STOCK_" + key)
        var typeOptions = Object.keys(this.props.componentTypesCustomInfo).concat(stockOptions)
        var Controls = this.state.isEditing ? EditComponentControls : ComponentUpshotControls
        return <div className="component-quick-glance-container row g-0">
            <div className="component-thumbnail-wrapper">
                {/* {this.state.thumbnailSource !== undefined &&
                    <img className="component-thumbnail" src={this.state.thumbnailSource}/>
                } */}
            </div>
            <div className="component-quick-glance" 
                onMouseOver={this.handleMouseOver}
                onMouseLeave={this.handleMouseOut}>
                
                <Controls 
                    isHovering={this.state.isHovering}
                    hasFrontArtdata={hasFrontArtdata}
                    hasDieFaceArtdata={hasDieFaceArtdata}
                    hasBackArtdata={hasBackArtdata}
                    componentGameDataExists={this.state.componentGameDataExists}
                    pieceGamedataExists={this.state.pieceGamedataExists}
                    
                    pieceGameDataFilePath={this.state.pieceGameDataFilePath}
                    componentGameDataFilePath={this.state.componentGameDataFilePath}
                    artdataFrontFilePath={this.state.artdataFrontFilePath}
                    artdataDieFaceFilePath={this.state.artdataDieFaceFilePath}
                    artdataBackFilePath={this.state.artdataBackFilePath}
                    
                    frontArtdataExists={this.state.frontArtdataExists}
                    backArtdataExists={this.state.backArtdataExists}
                    dieFaceArtdataExists={this.state.dieFaceArtdataExists}
                    goToFileCallback={this.goToFile}
                    toggleIsEditingCallback={this.toggleIsEditing}
                    
                    updateViewedFileUsingExplorerAsyncCallback ={this.props.updateViewedFileUsingExplorerAsyncCallback }
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    componentTypesCustomInfo={this.props.componentTypesCustomInfo}
                    componentTypesStockInfo={this.props.componentTypesStockInfo}
                    componentName={this.props.componentName}
                    componentType={this.props.componentType}
                    componentGamedataFilename={this.props.componentGamedataFilename}
                    piecesGamedataFilename={this.props.piecesGamedataFilename}
                    artdataFrontFilename={this.props.artdataFrontFilename}
                    artdataDieFaceFilename={this.props.artdataDieFaceFilename}
                    artdataBackFilename={this.props.artdataBackFilename}
                    isDebugInfo={this.props.isDebugInfo}
                    disabled={this.props.disabled}
                    quantity={this.props.quantity}
                    deleteComponentCallback={this.props.deleteComponentCallback}
                    duplicateComponentCallback={this.props.duplicateComponentCallback}
                    isFloatingName={this.props.isFloatingName}
                    floatingName={this.props.floatingName}
                    updateFloatingNameCallback={this.props.updateFloatingNameCallback}
                    releaseFloatingNameCallback={this.props.releaseFloatingNameCallback}
                    updateComponentFieldCallback={this.props.updateComponentFieldCallback}
                    typeOptions={typeOptions}
                />
            </div> 
        </div> 
    }
}