import React from "react";
import EditCompositionRow from "./EditComposition/EditCompositionRow";
import EditableViewerJson from "../EditableViewerJson";
import TemplativeAccessTools from "../../../TemplativeAccessTools";
import "./UnifiedComponentViewer.css"
import CompositionControlsRow from "./CompositionControlsRow";
import path from "path";

export default class UnifiedComponentViewer extends React.Component { 
    state = {
        componentInfo: undefined,
        compositionIndex: undefined,
        availableDataSources: {
            studio: [],
            game: [],
            component: [],
            piece: []
        },
        gamedataColumnWidth: 50,
        isResizing: false
    }
    componentDidMount = async () => {
        await this.load();
    }
    load = async () => {
        var componentInfo = undefined;
        var compositionIndex = undefined;
        console.log("this.props.componentCompose", this.props.componentCompose)
        for (let c = 0; c < this.props.componentCompose.length; c++) {
            const component = this.props.componentCompose[c];
            if (component.name !== this.props.componentName) {
                continue;
            }
            componentInfo = component;
            compositionIndex = c;
            break;
        }
        
        if (componentInfo === undefined) {
            return;
        }

        this.setState({
            componentInfo: componentInfo,
            compositionIndex: compositionIndex,
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

    async componentDidUpdate(prevProps, prevState) {
        // Check if the viewed file has changed
        if (this.props.viewedFile !== prevProps.viewedFile) {
            await this.checkAndReloadDataSources(this.props.viewedFile);
        }

        const isChangingComponentName = prevProps.componentName !== this.props.componentName;
        if (!isChangingComponentName) {
            return;
        }

        await this.load();
    }
    
    loadSubfiles = async (componentInfo) => {
        const { templativeRootDirectoryPath,  } = this.props;
        
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
        console.log("loadedContent", loadedContent)
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
            console.log("this.state.availableDataSources", this.state.availableDataSources)
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

    updateComponentName = (newName) => {
        const newContent = [...this.props.componentCompose];
        newContent[this.state.compositionIndex].name = newName;
        this.props.saveComponentComposeAsync(newContent);
    }

    updateComponentType = (newType) => {
        const newContent = [...this.props.componentCompose];
        newContent[this.state.compositionIndex].type = newType;
        this.props.saveComponentComposeAsync(newContent);
    }

    updateQuantity = (newQuantity) => {
        let quantity = 0;
        if (typeof newQuantity === 'number') {
            quantity = newQuantity;
        } else {
            quantity = parseInt(newQuantity);
        }
        quantity = Math.floor(Math.max(quantity, 0));
        const newContent = [...this.props.componentCompose];
        newContent[this.state.compositionIndex].quantity = quantity;
        this.props.saveComponentComposeAsync(newContent);
    }

    updateIsDisabled = (newIsDisabled) => {
        const newContent = [...this.props.componentCompose];
        newContent[this.state.compositionIndex].disabled = newIsDisabled;
        this.props.saveComponentComposeAsync(newContent);
    }
    
    render() {

        return (
            <>
                {this.state.componentInfo && 
                    <CompositionControlsRow 
                        componentName={this.state.componentInfo["name"]}
                        updateComponentName={this.updateComponentName}
                        type={this.state.componentInfo["type"]}
                        updateComponentType={this.updateComponentType}
                        quantity={this.state.componentInfo["quantity"]}
                        updateQuantity={this.updateQuantity}
                        isDisabled={this.state.componentInfo["disabled"]}
                        updateIsDisabled={this.updateIsDisabled}
                        renderComponent={this.props.renderComponent}
                        isProcessing={this.state.isProcessing}
                        componentTypesCustomInfo={this.props.componentTypesCustomInfo}
                        updateRouteCallback={this.props.updateRouteCallback}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                    />
                }
                
                {this.state.loadedSubfiles && 
                    <EditCompositionRow 
                        frontArtdataFilepath={this.state.frontArtdataFilepath}
                        backArtdataFilepath={this.state.backArtdataFilepath}
                        dieFaceArtdataFilepath={this.state.dieFaceArtdataFilepath}
                        hasFrontArtdata={this.state.hasFrontArtdata}
                        hasBackArtdata={this.state.hasBackArtdata}
                        hasDieFaceArtdata={this.state.hasDieFaceArtdata}
                        templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                        handleFileSave={this.handleFileSave}
                        updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                        availableDataSources={this.state.availableDataSources}
                        
                        gamedataColumnWidth={this.state.gamedataColumnWidth}
                        isResizing={this.state.isResizing}
                        startResize={this.startResize}
                        
                        componentName={this.state.componentInfo["name"]}
                        studioGamedataFilepath={this.state.studioGamedataFilepath}
                        gameGamedataFilepath={this.state.gameGamedataFilepath}
                        componentGamedataFilepath={this.state.componentGamedataFilepath}
                        piecesGamedataFilepath={this.state.piecesGamedataFilepath}
                        showPreviewCallback={this.props.showPreviewCallback}
                    />
                } 
            </>
        );
    }
}