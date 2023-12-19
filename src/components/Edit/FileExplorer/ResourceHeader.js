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
            <div className="resourceHeaderContent" >
                <p className="resourcesHeader">
                    {this.props.header}
                </p>
            </div>
            <div className="resourceHeaderControls" >
                {this.state.isHovering &&
                    <>
                    {this.props.directory !== undefined &&
                        <button onClick={()=> this.openFolder()}className="btn btn-dark add-file-button">↗️</button>
                    }
                    {this.props.createFileCallback !== undefined &&
                        <button onClick={()=> this.props.createFileCallback()}className="btn btn-dark add-file-button">+</button>
                    }
                    </>
                }
            </div>
        </div> 
    }
}