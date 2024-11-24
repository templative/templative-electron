import React from "react";

import "./RenameableFile.css"

const path = require("path");

export default class RenameableFile extends React.Component {  
    state = {
        filename: path.relative(this.props.directoryPath, this.props.filepath).split(".")[0]
    }  
    updateFilename(filename) {
        this.setState({filename: filename})
    }
    renameFileAsync = async (filename) => {
        const newFilepath =  path.join(this.props.directoryPath, `${filename}${path.extname(this.props.filepath)}`)
        await this.props.renameFileCallback(this.props.filepath, newFilepath)
    }
    render() {
        var shouldDarkenName = this.props.contentType !== "ART" && this.props.referenceCount === 0
        return <div className="renameable-file-wrapper" onClick={this.props.onClickCallback}>
            {this.props.isRenaming ? 
                <div className="input-group input-group-sm"  data-bs-theme="dark">
                    <input 
                        autoFocus 
                        type="text" 
                        className="form-control shadow-none renamed-file-input" 
                        onChange={(event)=>this.updateFilename(event.target.value)}
                        onBlur={() => this.props.cancelRenamingCallback()} 
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                await this.renameFileAsync(this.state.filename)
                            }
                            if (e.key === "Escape") {
                                this.props.cancelRenamingCallback()
                            }
                        }}
                        value={this.state.filename}
                    />
                </div>
                :
                <p className={`renameable-file ${shouldDarkenName && "unused-file"}`}>
                    <span style={{ marginLeft: `${(this.props.depth * 16)+8}px` }}/>{path.parse(this.props.filepath).name}
                </p>
            }
        </div>
    }
}