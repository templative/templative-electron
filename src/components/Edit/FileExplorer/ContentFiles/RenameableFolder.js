import React from "react";

import "./RenameableFile.css"

const path = require("path");

export default class RenameableFolder extends React.Component {  
    
    updateFolder(filename) {
        this.setState({filename: filename})
    }
    renameFolderAsync = async (filename) => {
        const newFilepath =  path.join(this.props.directoryPath, `${filename}${path.extname(this.props.filepath)}`)
        await this.props.renameFolderAsyncCallback(this.props.filepath, newFilepath)
    }
    render() {
        var chevron = this.props.isExtended === true ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-chevron-down resource-header-chevron" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
            </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-chevron-right resource-header-chevron" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
            </svg>
        var basename = path.basename(this.props.filepath)
        var numberSpaces = this.props.depth - 1
        return <div className="renameable-file-wrapper" onClick={this.props.onClickCallback}>
            {this.props.isRenaming ? 
                <div className="input-group input-group-sm"  data-bs-theme="dark">
                    <input 
                        autoFocus 
                        type="text" 
                        className="form-control shadow-none renamed-file-input" 
                        onChange={(event)=>this.updateFolder(event.target.value)}
                        onBlur={() => this.props.cancelRenamingCallback()} 
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                await this.renameFolderAsync(basename)
                            }
                            if (e.key === "Escape") {
                                this.props.cancelRenamingCallback()
                            }
                        }}
                        value={basename}
                    />
                </div>
                :
                <p className="renameable-file">
                    {`  `.repeat(numberSpaces)}{chevron}{basename}
                </p>
            }
        </div>
    }
}