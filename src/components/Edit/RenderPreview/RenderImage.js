import React from "react";

export default class RenderImage extends React.Component {
    state = {
        isHovering: false
    }

    handleMouseEnter = () => {
        this.setState({isHovering: true});
    };

    handleMouseLeave = () => {
        this.setState({isHovering: false});

    };
    render() {
        return <React.Fragment>
            <img 
                className="preview-image" 
                src={`file://${this.props.filepath}?${this.props.imageHash}`} 
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            />
            {this.state.isHovering && (
                <img 
                    className="preview-image-giganto" 
                    src={`file://${this.props.filepath}?${this.props.imageHash}`}
                />
            )}
        </React.Fragment>
    }
}
