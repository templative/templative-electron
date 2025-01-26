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
        },
        gamedataColumnWidth: 50,
        isResizing: false
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

    startResize = (e) => {
        const startX = e.clientX;
        const startWidth = this.state.gamedataColumnWidth;
        const container = document.querySelector('.unified-viewer');
        
        this.setState({ isResizing: true });
        
        const doDrag = (e) => {
            const containerWidth = container.offsetWidth;
            const difference = e.clientX - startX;
            const newWidth = startWidth + (difference / containerWidth * 100);
            this.setState({ gamedataColumnWidth: Math.min(Math.max(20, newWidth), 80) });
        };

        const stopResize = () => {
            this.setState({ isResizing: false });
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopResize);
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopResize);
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
        
        const editRow = <div className="row g-0 unified-viewer">
            {this.state.loadedSubfiles && 
                <div className="col gamedata-column" style={{width: `${this.state.gamedataColumnWidth}%`}}>
                    <div className={`viewer-resize-handle${this.state.isResizing ? ' active' : ''}`} onMouseDown={this.startResize}></div>
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

        return <>
            <div className="row g-0">
                <div className="input-group input-group-sm" data-bs-theme="dark">
                    <span className="input-group-text soft-label">Type</span>
                    <select className="form-select no-left-border" value={this.props.componentType} onChange={(e) => this.props.updateComponentType(e.target.value)}></select>

                    <span className="input-group-text soft-label">Quantity</span>
                    <input type="number" className="form-control no-left-border" placeholder="0" aria-label="Search" value={this.props.quantity} onChange={(e) => this.props.updateComponentName(e.target.value)} />

                    <span className="input-group-text soft-label">Disabled</span>
                    <div className="input-group-text no-left-border">
                        <input 
                            className="form-check-input mt-0" 
                            type="checkbox" 
                            checked={this.props.isDisabled}
                            onChange={(e) => this.props.updateIsDisabled(e.target.checked)}
                            aria-label="Checkbox to disable component"
                        />
                    </div>

                    <button onClick={async ()=>{await this.renderComponent()}} disabled={this.state.isProcessing} className="btn btn-outline-secondary" type="button" title={`Render ${this.props.componentName}.`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-brush component-use-icon" viewBox="0 0 16 16">
                            <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04M4.705 11.912a1.2 1.2 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.4 3.4 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3 3 0 0 0 .126-.75zm1.44.026c.12-.04.277-.1.458-.183a5.1 5.1 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005zm3.582-3.043.002.001h-.002z"/>
                        </svg> Render Composition
                    </button>
                </div>
            </div>
            {editRow}
        </>
    }
}