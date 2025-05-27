import React from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";
import { channels } from '../../../../shared/constants';
const { ipcRenderer } = window.require('electron');
import MakingPreviewImage from "./previewing.svg?react"
import "./RenderPreview.css"
import CoordinateImage from "./CoordinateImage";
import { RenderingWorkspaceContext } from "../../Render/RenderingWorkspaceProvider";

const fsOld = require('fs');
const path = require("path");
const fs = require("fs/promises");

export default class RenderPreview extends React.Component {
    static contextType = RenderingWorkspaceContext;
    state = {
        componentOptions: [],
        piecesOptions: [],
        chosenComponentName: undefined,
        chosenPieceName: undefined,
        previewsDirectory: undefined,
        imageSources: [],
        loadingImages: true,
        imageHash: Date.now(),
    }
    setupPreviewWatcher = async () => {
        await this.#loadImages(this.state.previewsDirectory);
        this.#closePreviewImagesWatcher()
        this.previewImagesWatcher = fsOld.watch(this.state.previewsDirectory, {}, async () => {
            await this.#loadImages(this.state.previewsDirectory);
        });
    }

    componentDidMount = async () => {
        try {
            await this.#parseComponentComposeAsync();
            const response = await ipcRenderer.invoke(channels.TO_SERVER_GET_PREVIEWS_DIRECTORY);
            this.setState({ previewsDirectory: response.previewsDirectory }, async () => await this.setupPreviewWatcher());
        } catch (error) {
            console.error("Error in componentDidMount:", error);
        }
    }

    #loadImages = async (directory) => {
        try { 
            let filepaths = await fs.readdir(directory, { withFileTypes: true });
            filepaths = filepaths.filter(filepath => filepath.name.endsWith(".png")).map(filepath => path.join(directory, filepath.name));

            // const preloadImages = filepaths.map(src => this.#preloadImage(src));
            // await Promise.all(preloadImages);
            const hasNoImagesCurrently = this.state.imageSources.length === 0;
            const hasImagesNow = filepaths.length > 0;
            if (hasNoImagesCurrently && hasImagesNow) {
                this.context.setIsGeneratingPreview(false);
            }
            this.setState({
                imageSources: filepaths,
                loadingImages: false,
                imageHash: Date.now()
            });
        } catch (error) {
            console.error("Error in #loadImages:", error);
        }
    }

    #parseComponentCompose = async () => {
        try {
            const componentCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json");
            const gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json");
            const componentOptions = componentCompose.filter(component => !component.type?.startsWith('STOCK_')).map(component => component.name);
            let chosenComponentName, chosenPieceName, piecesOptions = [];

            if (componentCompose.length > 0) {
                chosenComponentName = componentCompose[0].name;
                const piecesFilepath = path.join(this.props.templativeRootDirectoryPath, gameCompose.piecesGamedataDirectory, `${componentCompose[0].piecesGamedataFilename}.json`);
                
                if (await TemplativeAccessTools.doesFileExistAsync(piecesFilepath)) {
                    const piecesGamedata = await TemplativeAccessTools.loadFileContentsAsJson(piecesFilepath);
                    piecesOptions = piecesGamedata.map(piece => piece.name);
                }
                chosenPieceName = piecesOptions[0];
            }

            this.setState({
                gameCompose: gameCompose,
                componentOptions: componentOptions,
                componentCompose: componentCompose,
                chosenComponentName: chosenComponentName,
                chosenPieceName: chosenPieceName,
                piecesOptions: piecesOptions
            });
        } catch (error) {
            console.error("Error in #parseComponentCompose:", error);
        }
    }

    #parseComponentComposeAsync = async () => {
        try {
            await this.#parseComponentCompose();
            this.#closeComponentComposeWatcher();

            const componentComposeFilepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json");
            this.componentComposeWatcher = fsOld.watch(componentComposeFilepath, {}, async () => {
                await this.#parseComponentCompose();
            });
        } catch (error) {
            console.error("Error in #parseComponentComposeAsync:", error);
        }
    }

    componentDidUpdate = async (prevProps) => {
        if (prevProps.templativeRootDirectoryPath !== this.props.templativeRootDirectoryPath) {
            await this.#parseComponentComposeAsync();
        }
    }

    #closeComponentComposeWatcher = () => {
        if (this.componentComposeWatcher) {
            this.componentComposeWatcher.close();
            this.componentComposeWatcher = undefined;
        }
    }
    #closePreviewImagesWatcher = () => {
        if (this.previewImagesWatcher) {
            this.previewImagesWatcher.close();
            this.previewImagesWatcher = undefined;
        }
    }

    componentWillUnmount = () => {
        this.#closeComponentComposeWatcher();
        this.#closePreviewImagesWatcher();
    }

    preview = async () => {
        if (this.state.chosenComponentName && this.state.chosenPieceName) {
            const data = {
                componentFilter: this.state.chosenComponentName,
                pieceFilter: this.state.chosenPieceName,
                language: "en",
                directoryPath: this.props.templativeRootDirectoryPath
            }
            try {
                await ipcRenderer.invoke(channels.TO_SERVER_PREVIEW_PIECE, data);
            } catch (error) {
                console.error("Error in preview:", error);
            }
        }
    }

    updateChosenComponentName = async (e) => {
        const componentName = e.target.value;
        let pieceName, piecesOptions = [];

        try {
            for (const component of this.state.componentCompose) {
                if (component.name === componentName) {
                    const piecesFilepath = path.join(this.props.templativeRootDirectoryPath, this.state.gameCompose.piecesGamedataDirectory, `${component.piecesGamedataFilename}.json`);
                    const piecesGamedata = await TemplativeAccessTools.loadFileContentsAsJson(piecesFilepath);
                    piecesOptions = piecesGamedata.map(piece => piece.name);
                    pieceName = piecesOptions[0];
                    break;
                }
            }

            this.setState({
                chosenComponentName: componentName,
                chosenPieceName: pieceName,
                piecesOptions: piecesOptions
            });
        } catch (error) {
            console.error("Error in updateChosenComponentName:", error);
        }
    }

    updateChosenPieceName = async (e) => {
        this.setState({ chosenPieceName: e.target.value });
    }

    renderPreviewImages = () => {
        if (this.state.loadingImages) {
            return <p className="preview-loading">Loading images...</p>;
        }

        // If we're generating a preview, show the making preview image
        if (this.context.isGeneratingPreview) {
            return <div className="awaiting-previews">
                <MakingPreviewImage className="preview-making-image" />
                <p>Creating previews...</p>
            </div>
        }
        
        if (this.state.imageSources.length === 0) {
            return <p className="preview-loading">No preview images. Press the preview button on a piece from within the edit component view to preview it.</p>;
        }

        // Sort images so _back images appear last
        const sortedImages = [...this.state.imageSources].sort((a, b) => {
            const aIsBack = a.toLowerCase().includes('-back');
            const bIsBack = b.toLowerCase().includes('-back');
            return aIsBack ? 1 : bIsBack ? -1 : 0;
        });

        return sortedImages.map(filepath => (
            <CoordinateImage 
                key={filepath} 
                filepath={filepath} 
                imageHash={this.state.imageHash}
            />
        ));
    }

    render() {
        return (
            <React.Fragment>
                <div className="preview-images">
                    {this.renderPreviewImages()}
                </div>
            </React.Fragment>
        );
    }
}
