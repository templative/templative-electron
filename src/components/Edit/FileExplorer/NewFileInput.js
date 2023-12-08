import React from "react";
import "./TemplativeProjectRenderer.css"

export default class NewFileInput extends React.Component { 
    state = {
        filename: ""
    }  
    updateFilename(filename) {
        this.setState({filename: filename})
    }
    render() {
        return <div className="new-file-wrapper">
            <div className="input-group input-group-sm new-file-input-group"  data-bs-theme="dark">
                <input autoFocus type="text" className="form-control shadow-none new-file-input" 
                    onChange={(event)=>this.updateFilename(event.target.value)}
                    onBlur={() => this.props.submitNewFilenameCallback(this.state.filename)}
                    aria-label="What key to get from the scope..." 
                    value={this.state.filename}/>
            </div>
        </div>
    }
}