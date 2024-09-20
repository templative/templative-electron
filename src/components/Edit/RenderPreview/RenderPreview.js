import React from "react";
import TemplativeAccessTools from "../../TemplativeAccessTools";

import "./RenderPreview.css"
import RenderImage from "./RenderImage";

const fsOld = require('fs');
const path = require("path");
const fs = require("fs/promises");
const axios = require("axios");

export default class RenderPreview extends React.Component {
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
            console.log(`${this.state.previewsDirectory} changed.`);
            await this.#loadImages(this.state.previewsDirectory);
        });
    }

    componentDidMount = async () => {
        // try {
            await this.#parseComponentComposeAsync();
            const response = await axios.get(`http://127.0.0.1:8080/previews`);
            this.setState({ previewsDirectory: response.data.previewsDirectory }, this.setupPreviewWatcher);
        // } catch (error) {
        //     console.error("Error in componentDidMount:", error);
        // }
    }

    #loadImages = async (directory) => {
        // try { 
            let filepaths = await fs.readdir(directory, { withFileTypes: true });
            filepaths = filepaths.filter(filepath => filepath.name.endsWith(".png")).map(filepath => path.join(directory, filepath.name));

            // const preloadImages = filepaths.map(src => this.#preloadImage(src));
            // await Promise.all(preloadImages);
            // console.log(filepaths)
            this.setState({
                imageSources: filepaths,
                loadingImages: false,
                imageHash: Date.now()
            });
        // } catch (error) {
        //     console.error("Error in #loadImages:", error);
        // }
    }

    #preloadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
        });
    }

    #parseComponentCompose = async () => {
        // try {
            const componentCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "component-compose.json");
            const gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json");
            const componentOptions = componentCompose.map(component => component.name);
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
        // } catch (error) {
        //     console.error("Error in #parseComponentCompose:", error);
        // }
    }

    #parseComponentComposeAsync = async () => {
        // try {
            await this.#parseComponentCompose();
            this.#closeComponentComposeWatcher();

            const componentComposeFilepath = path.join(this.props.templativeRootDirectoryPath, "component-compose.json");
            this.componentComposeWatcher = fsOld.watch(componentComposeFilepath, {}, async () => {
                await this.#parseComponentCompose();
            });
        // } catch (error) {
        //     console.error("Error in #parseComponentComposeAsync:", error);
        // }
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
                await axios.post(`http://localhost:8080/preview-piece`, data);
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

    render() {
        return (
            <React.Fragment>
                <p className="preview-title">Preview a Piece</p>
                <div className="vertical-input-group">
                    <div className="input-group input-group-sm preview-select" data-bs-theme="dark">
                        <span className="input-group-text">Component</span>
                        <select value={this.state.chosenComponentName} onChange={this.updateChosenComponentName} className="form-select" id="inputGroupSelect01">
                            {this.state.componentOptions.map(componentOption => (
                                <option key={componentOption} value={componentOption}>{componentOption}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group input-group-sm preview-select" data-bs-theme="dark">
                        <span className="input-group-text">Piece</span>
                        <select value={this.state.chosenPieceName} onChange={this.updateChosenPieceName} className="form-select" id="inputGroupSelect01">
                            {this.state.piecesOptions.map(piecesOption => (
                                <option key={piecesOption} value={piecesOption}>{piecesOption}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button className="btn preview-button" onClick={this.preview}>Preview</button>
                <div className="preview-images">
                    {this.state.loadingImages ? <p>Loading images...</p> : 
                        this.state.imageSources.map(filepath => (
                            <RenderImage key={filepath} filepath={filepath} imageHash={this.state.imageHash}/>
                        ))
                    }
                </div>
            </React.Fragment>
        );
    }
}
