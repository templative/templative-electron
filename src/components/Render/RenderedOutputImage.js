import React from "react";

export default class RenderOutputImage extends React.Component {
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
            <div className="output-image-container">
                <img 
                    className="output-image" 
                    src={`file://${this.props.imagePath}`} 
                />
                <div 
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '5px',
                        width: '25px',
                        height: '25px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                        fillRule="evenodd"
                        d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"
                        />
                        <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
                        <path
                        fillRule="evenodd"
                        d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5"
                        />
                    </svg>
                </div>
            </div>
            {this.state.isHovering && (
                <img 
                    className="output-image-giganto" 
                    src={`file://${this.props.imagePath}?${this.props.imageHash}`}
                />
            )}
        </React.Fragment>
    }
}
