import React from "react";

import EditableViewerJson from "../EditableViewerJson";
import TemplativeAccessTools from "../../../TemplativeAccessTools";
import ArtdataViewer from "../ArtdataViewer/ArtdataViewer";
import ComponentGamedataViewer from "../GamedataViewer/ComponentGamedataViewer";
import PieceGamedataViewer from "../GamedataViewer/PieceGamedataViewer";
import "./UnifiedComponentViewer.css"
import StudioGamedataViewer from "../GamedataViewer/StudioGamedataViewer";
import GameGamedataViewer from "../GamedataViewer/GameGamedataViewer";
const path = require("path")

import studioIcon from "../../Icons/studioIcon.svg"
import gameIcon from "../../Icons/gameIcon.svg"
import componentIcon from "../../Icons/componentIcon.svg"
import pieceIcon from "../../Icons/pieceIcon.svg"
import artdataIcon from "../../Icons/artDataIcon.svg"

export default class UnifiedComponentViewer extends EditableViewerJson { 
    state = {
        availableDataSources: {
            studio: [],
            game: [],
            component: [],
            piece: []
        }
    }

    getFilePath = (props) => {
        return path.join(props.templativeRootDirectoryPath, "component-compose.json")
    }

    async componentDidUpdate(prevProps, prevState) {
        await super.componentDidUpdate(prevProps, prevState);
        
        // Check if the viewed file has changed
        if (this.props.viewedFile !== prevProps.viewedFile) {
            await this.checkAndReloadDataSources(this.props.viewedFile);
        }

        const isChangingLoaded = prevState.hasLoaded !== this.state.hasLoaded;
        const isChangingComponentName = prevProps.componentName !== this.props.componentName;
        if (!this.state.hasLoaded || !(isChangingLoaded || isChangingComponentName)) {
            return;
        }

        var componentInfo = undefined;
        for (let c = 0; c < this.state.content.length; c++) {
            const component = this.state.content[c];
            if (component.name !== this.props.componentName) {
                continue;
            }
            componentInfo = component;
            break;
        }
        
        if (componentInfo === undefined) {
            return;
        }

        this.setState({
            isStudioExtended: false,
            isGameExtended: false,
            isComponentExtended: false,
            isPiecesExtended: true,
            isFrontExtended: true,
            isBackExtended: false,
            isDieFaceExtended: true,
            loadedSubfiles: false
        }, async () => await this.loadSubfiles(componentInfo));
    }
    
    loadSubfiles = async (componentInfo) => {
        const { templativeRootDirectoryPath } = this.props;
    
        // Load game JSON and construct paths
        const gameJson = await TemplativeAccessTools.loadFileContentsAsJson(
            path.join(templativeRootDirectoryPath, "game-compose.json")
        );
        const studioGamedataFilepath = path.join(templativeRootDirectoryPath, "studio.json");
        const gameGamedataFilepath = path.join(templativeRootDirectoryPath, "game.json");
        const componentGamedataFilepath = path.join(
            templativeRootDirectoryPath, 
            gameJson["componentGamedataDirectory"], 
            `${componentInfo["componentGamedataFilename"]}.json`
        );
        const piecesGamedataFilepath = path.join(
            templativeRootDirectoryPath, 
            gameJson["piecesGamedataDirectory"], 
            `${componentInfo["piecesGamedataFilename"]}.json`
        );
        
        const loadedContent = {
            componentInfo,
            studioGamedataFilepath,
            gameGamedataFilepath,
            componentGamedataFilepath,
            piecesGamedataFilepath,
            isStudioExtended: false,
            isGameExtended: false,
            isComponentExtended: false,
            isPiecesExtended: true,
            isFrontExtended: true,
            isBackExtended: false,
            isDieFaceExtended: true,
            loadedSubfiles: true,
            hasFrontArtdata: false,
            hasBackArtdata: false,
            hasDieFaceArtdata: false,
        };
    
        const artdataFilepath = path.join(templativeRootDirectoryPath, gameJson["artdataDirectory"]);
    
        // Check for die face art data
        if (componentInfo["artdataDieFaceFilename"]) {
            loadedContent.dieFaceArtdataFilepath = path.join(
                artdataFilepath, 
                `${componentInfo["artdataDieFaceFilename"]}.json`
            );
            loadedContent.hasDieFaceArtdata = true
        } else {
            loadedContent.hasDieFaceArtdata = false
            loadedContent.hasFrontArtdata = true
            loadedContent.hasBackArtdata = componentInfo["artdataBackFilename"] !== undefined
    
            loadedContent.frontArtdataFilepath = componentInfo["artdataFrontFilename"]
                ? path.join(artdataFilepath, `${componentInfo["artdataFrontFilename"]}.json`)
                : undefined;
    
            loadedContent.backArtdataFilepath = componentInfo["artdataBackFilename"]
                ? path.join(artdataFilepath, `${componentInfo["artdataBackFilename"]}.json`)
                : undefined;
        }
    
        this.setState(loadedContent, async () => await this.loadDataSources());
    };
    
    toggleExtension = (key) => {
        this.setState({[key]: !this.state[key]})
    }

    loadDataSources = async () => {
        try {
            // Load all the data files
            const studioData = await TemplativeAccessTools.loadFileContentsAsJson(this.state.studioGamedataFilepath);
            const gameData = await TemplativeAccessTools.loadFileContentsAsJson(this.state.gameGamedataFilepath);
            const componentData = await TemplativeAccessTools.loadFileContentsAsJson(this.state.componentGamedataFilepath);
            const piecesData = await TemplativeAccessTools.loadFileContentsAsJson(this.state.piecesGamedataFilepath);

            // Extract fields from each data source
            const studioFields = Object.keys(studioData);
            const gameFields = Object.keys(gameData);
            const componentFields = Object.keys(componentData);
            const pieceFields = piecesData.length > 0 ? Object.keys(piecesData[0]) : [];

            this.setState({
                availableDataSources: {
                    studio: studioFields,
                    game: gameFields,
                    component: componentFields,
                    piece: pieceFields
                }
            });
        } catch (error) {
            console.error("Error loading data sources:", error);
        }
    }

    checkAndReloadDataSources = async (filepath) => {
        const relevantPaths = [
            this.state.studioGamedataFilepath,
            this.state.gameGamedataFilepath,
            this.state.componentGamedataFilepath,
            this.state.piecesGamedataFilepath
        ];

        if (relevantPaths.includes(filepath)) {
            await this.loadDataSources();
        }
    }

    

    handleFileSave = async (filepath, content) => {
        await this.props.saveFileAsyncCallback(filepath, content);
        await this.checkAndReloadDataSources(filepath);
    }

    render() {        
        const extendedChevron = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down drop-down-chevron" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>
        const unextendedChevron = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right drop-down-chevron" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
        </svg>
        
        var artdataFiles = {
            "Front": "frontArtdataFilepath",
            "Back": "backArtdataFilepath",
            "DieFace": "dieFaceArtdataFilepath",
        }
        var artdataRows = []
        if (this.state.loadedSubfiles) {
            artdataRows = Object.entries(artdataFiles).map(([face, value]) => {
                if (this.state[value] === undefined) {
                    return <div key={face}/>
                }
                if (!this.state[`has${face}Artdata`]) {
                    return <div key={face}/>
                }
                if (face === "Back" && (this.state["backArtdataFilepath"] === this.state["frontArtdataFilepath"])) {
                    const rightChevron = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                    return <div className="unselecteable-artdata" key={`${this.props.componentName}_${face}`}>
                        <p>
                            {rightChevron} <img 
                                className="tab-icon" 
                                src={artdataIcon} 
                                alt="Tab icon"
                            /> {face} Art Recipe <span className="subfile-filepath">Same as Front Art Recipe</span>
                        </p>
                    </div>
                }
                const extensionString = `is${face}Extended`
                return <div className="" key={`${this.props.componentName}_${face}`}>
                    <p onClick={() => this.toggleExtension(extensionString)}>
                        { this.state[extensionString] ? extendedChevron : unextendedChevron } <img 
                                className="tab-icon" 
                                src={artdataIcon} 
                                alt="Tab icon"
                            /> {face} Art Recipe <span className="subfile-filepath">{path.parse(this.state[value]).name}.json</span> </p>
                    { this.state[extensionString] && 
                        <div className="universal-file-content">
                            <ArtdataViewer 
                                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                                filepath={this.state[value]} 
                                saveFileAsyncCallback={this.props.saveFileAsyncCallback}
                                updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                                availableDataSources={this.state.availableDataSources}
                            />
                        </div>
                    }
                </div>
            });
        }
        
        return <div className="row g-0 unified-viewer">
            {this.state.loadedSubfiles && 
                <div className="col gamedata-column">
                    <div className="">
                        <p 
                            onClick={() => this.toggleExtension("isStudioExtended")}
                        >
                            {this.state.isStudioExtended ? extendedChevron : unextendedChevron} 
                            <img 
                                className="tab-icon" 
                                src={studioIcon} 
                                alt="Tab icon"
                            /> 
                            Studio <span className="subfile-filepath">{`${path.parse(this.state.studioGamedataFilepath).name}.json`}</span>
                        </p>
                        {this.state.isStudioExtended && 
                            <div className="universal-file-content">
                                <StudioGamedataViewer 
                                    filepath={this.state.studioGamedataFilepath} 
                                    saveFileAsyncCallback={this.handleFileSave}
                                    />
                            </div>
                        }
                    </div>
                    <div className="">
                        <p 
                            onClick={() => this.toggleExtension("isGameExtended")}
                        >
                            {this.state.isGameExtended ? extendedChevron : unextendedChevron} 
                            <img 
                                className="tab-icon" 
                                src={gameIcon} 
                                alt="Tab icon"
                            /> 
                            Game <span className="subfile-filepath">{`${path.parse(this.state.gameGamedataFilepath).name}.json`}</span>
                        </p>
                        {this.state.isGameExtended && 
                            <div className="universal-file-content">
                                <GameGamedataViewer 
                                    filepath={this.state.gameGamedataFilepath} 
                                    saveFileAsyncCallback={this.handleFileSave}
                                />
                            </div>
                        }
                    </div>
                    <div className="">
                        <p 
                            onClick={() => this.toggleExtension("isComponentExtended")}
                        >
                            {this.state.isComponentExtended ? extendedChevron : unextendedChevron} 
                            <img 
                                className="tab-icon" 
                                src={componentIcon} 
                                alt="Tab icon"
                            /> 
                            Component <span className="subfile-filepath">{`${path.parse(this.state.componentGamedataFilepath).name}.json`}</span>
                        </p>
                        {this.state.isComponentExtended && 
                            <div className="universal-file-content">
                                <ComponentGamedataViewer 
                                    filepath={this.state.componentGamedataFilepath} 
                                    saveFileAsyncCallback={this.handleFileSave}
                                />
                            </div>
                        }
                    </div>
                    <div className="">
                        <p 
                            onClick={() => this.toggleExtension("isPiecesExtended")}
                        >
                            {this.state.isPiecesExtended ? extendedChevron : unextendedChevron} 
                            <img 
                                className="tab-icon" 
                                src={pieceIcon} 
                                alt="Tab icon"
                            /> 
                            Piece <span className="subfile-filepath">{`${path.parse(this.state.piecesGamedataFilepath).name}.json`}</span>
                        </p>
                        {this.state.isPiecesExtended && 
                            <div className="universal-file-content">
                            
                            <PieceGamedataViewer 
                                filepath={this.state.piecesGamedataFilepath} 
                                saveFileAsyncCallback={this.handleFileSave}
                                showPreviewCallback={this.props.showPreviewCallback}
                                isPreviewEnabled={true}
                                componentName={this.props.componentName}
                                templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                            />
                            </div>                                         
                        }
                    </div>
                </div>
            }
            <div className="col artdata-column">
                {artdataRows}
            </div>
        </div> 
    }
}