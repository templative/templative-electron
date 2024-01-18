import React from "react";
import "./RenameableFile.css"
import { toHaveStyle } from "@testing-library/jest-dom/matchers";

export default class RenameableFile extends React.Component {  
    state = {
        filename: this.props.filename
    }  
    updateFilename(filename) {
        this.setState({filename: filename})
    }
    render() {
        return <div className="renameable-file-wrapper" onClick={this.props.onClickCallback}>
            {this.props.isRenaming ? 
                <div className="input-group input-group-sm new-file-input-group"  data-bs-theme="dark">
                    <input 
                        autoFocus 
                        type="text" 
                        className="form-control shadow-none new-file-input" 
                        onChange={(event)=>this.updateFilename(event.target.value)}
                        onBlur={() => this.props.renameFileCallback(this.props.filepath, this.state.filename)} 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                this.props.renameFileCallback(this.props.filepath, this.state.filename)
                            }
                            if (e.key === "Escape") {
                                this.props.cancelRenamingCallback()
                            }
                        }}
                        value={this.state.filename}
                    />
                </div>
                :
                <p className="renameable-file">{this.props.filename}</p>
            }
        </div>
    }
}