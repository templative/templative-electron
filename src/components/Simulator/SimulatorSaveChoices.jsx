import React from "react";
const fs = require("fs/promises");
const path = require('path');
const fsOld = require('fs');

export default class SimulatorSaveChoices extends React.Component {   
    state={
        saveAbsoluteFilepaths: []
    }
    readDirectoryRecursively = async (dir, basepath) => {
        let results = [];
        const list = await fs.readdir(dir);

        for (const file of list) {
            const filePath = path.resolve(dir, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                continue
            }
            results.push(filePath);
            
        }
        return results;
    }
    static #sortAlphabetically = (a, b) => {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }
    #requestNewFilesNamesAsync = async () => {
        if (this.props.baseFilepath === undefined) {
            return
        }
        var absoluteFilepathsWithinBasepath = await this.readDirectoryRecursively(this.props.baseFilepath, this.props.baseFilepath)
        var filepaths = absoluteFilepathsWithinBasepath
            .filter((filepath) => {
                const isReadMe = filepath.split(".").pop() === "md"
                const isMacFolderInfo = filepath.split(".").pop() === "DS_Store"
                return !(isReadMe || isMacFolderInfo)
            })
            .sort(SimulatorSaveChoices.#sortAlphabetically)
        
            
        this.setState({saveAbsoluteFilepaths: filepaths})
    }
    componentDidMount = async () => {
        await this.#watchBasepathAsync()
    }
    #watchBasepathAsync = async () => {
        this.#stopWatchingBasepath()                
        this.componentComposeWatcher = fsOld.watch(this.props.baseFilepath, {recursive: true}, async (event, filename) => {
            console.log(event, filename)
            await this.#requestNewFilesNamesAsync()
        })
            
        await this.#requestNewFilesNamesAsync()
    }
    
    componentDidUpdate = async (prevProps, prevState) => {
        const isSameBaseFilepath = prevProps.baseFilepath === this.props.baseFilepath
        if (isSameBaseFilepath) {
            return
        }

        await this.#watchBasepathAsync()
    }

    componentWillUnmount = () => {
        this.#stopWatchingBasepath()
    }

    #stopWatchingBasepath = () => {
        if (this.componentComposeWatcher === undefined) {
            return
        }
        this.componentComposeWatcher.close();
        this.componentComposeWatcher = undefined;
    }
    
    render() {      
        var bannedWords = [
            "SaveFileInfos",
            "TS_Save_",
            "TS_AutoSave",
            "steam_autocloud"
        ]
        var filteredAbsoluteFilepaths = this.state.saveAbsoluteFilepaths.filter(absoluteFilepath => {
            for (let index = 0; index < bannedWords.length; index++) {
                const element = bannedWords[index];
                if (absoluteFilepath.includes(element)) {
                    return false
                }
            }
            return true;
        })
        var options = filteredAbsoluteFilepaths.map(absoluteFilepath => {
            var className = "tabletop-simulator-save " + (this.props.selectedSaveFilepath === absoluteFilepath && "selected-save") 
            return <p onClick={async () => this.props.selectSaveAsyncCallback(absoluteFilepath)} key={absoluteFilepath} className={className}>{path.parse(absoluteFilepath).name}</p>
        })
        return <div className="selectable-directories">
            <div className="headerWrapper">
                <p className="resourcesHeader">Tabletop Simulator Saves</p>
            </div> 
            <div className="tabletop-simulator-saves">
                {options}
            </div>
    </div>
    }
}