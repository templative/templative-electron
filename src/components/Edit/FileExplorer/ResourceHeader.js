import React from "react";
import "./ResourceHeader.css"

export default class ResourceHeader extends React.Component {   
    state = {
        isHovering: false
    }
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    openFolder() {
        window.require('child_process').exec(`start "" "${this.props.directory}"`);
    }
    render() {
        return <div className="resourcesHeaderWrapper" onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseOut}>
            <p className="resourcesHeader">
                {this.props.header}
            </p>
            {this.state.isHovering &&
                <>
                {this.props.directory !== undefined &&
                    <button onClick={()=> this.openFolder()}className="btn btn-dark add-file-button">🡭</button>
                }
                <button onClick={()=> this.props.createFileCallback()}className="btn btn-dark add-file-button">+</button>
                </>
            }
        </div> 
    }
}