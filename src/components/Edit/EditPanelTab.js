import React from "react";
import "./EditPanel.css"
import "./EditPanelTabs.css"
const path = window.require("path");

export default class EditPanelTab extends React.Component {       
    state = {
        isHovering: false,
        isHoveringX: false,
    }

    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    handleMouseOverX = () => {
        this.setState({isHoveringX: true})
    }
    handleMouseOutX = () => {
        this.setState({isHoveringX: false})
    }
    openFile = () => {
        if (this.state.isHoveringX) {
            return
        }
        console.log("open")
        this.props.updateViewedFileCallback(this.props.tabbedFile.filetype, this.props.tabbedFile.filepath)
    }
    render() {
        var isSelected = this.props.tabbedFile.filepath === this.props.currentFilepath
        var shouldShowX = (this.state.isHovering || isSelected) && this.props.tabbedFile.canClose
        return <li 
            className="nav-item"
            onClick={this.openFile}
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
        >
            <a className={`nav-link ${isSelected && "active"}`}>
                {path.parse(this.props.tabbedFile.filepath).name}
                {this.props.tabbedFile.canClose && 
                    <button 
                        onMouseOver={this.handleMouseOverX}
                        onMouseLeave={this.handleMouseOutX}
                        type="button" 
                        class={`btn-close btn-close-white tab-x-button ${shouldShowX && "visible-x-button"}`}
                        aria-label="Close"
                        onClick={() => this.props.closeTabAtIndexCallback(this.props.index)}
                    />
                } 
                
            </a>
        </li>
    }
}