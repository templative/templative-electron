import React from "react";
import path from "path";
export default class CoordinateImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mouseX: null,
            mouseY: null,
            showCoordinates: false,
            imageWidth: 0,
            imageHeight: 0,
            rotation: 0
        };
    }

    handleMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        
        let adjustedX = x;
        let adjustedY = y;
        
        switch (this.state.rotation) {
            case 90:
                adjustedX = y;
                adjustedY = 100-x;
                break;
            case 180:
                adjustedX = 100 - x;
                adjustedY = 100 - y;
                break;
            case 270:
                adjustedX = 100 -y;
                adjustedY = x;
                break;
            default:
                break;
        }
        
        this.setState({
            mouseX: x,
            mouseY: y,
            adjustedX: adjustedX,
            adjustedY: adjustedY,
            showCoordinates: true
        });
    }

    handleMouseLeave = () => {
        this.setState({ showCoordinates: false });
    }

    handleImageLoad = (e) => {
        this.setState({
            imageWidth: e.target.naturalWidth,
            imageHeight: e.target.naturalHeight
        });
    }

    rotateImage = () => {
        this.setState(prevState => ({
            rotation: (prevState.rotation + 90) % 360
        }));
    }

    render() {
        const getTransformStyle = () => {
            const isLeft = this.state.mouseX < 50;
            const isTop = this.state.mouseY < 50;
            
            if (isLeft && isTop) return 'translate(10px, 10px)';         // Top-left: move down and right
            if (!isLeft && isTop) return 'translate(-110%, 10px)';       // Top-right: move down and left
            if (isLeft && !isTop) return 'translate(10px, -110%)';       // Bottom-left: move up and right
            return 'translate(-110%, -110%)';                            // Bottom-right: move up and left
        }

        const pixelX = Math.floor((this.state.adjustedX/100) * (this.state.imageWidth));
        const pixelY = Math.floor((this.state.adjustedY/100) * (this.state.imageHeight));
        
        // Determine if we need to use vertical orientation class
        const isVertical = this.state.rotation === 90 || this.state.rotation === 270;
        
        // Get rotation class for shadow direction
        const getRotationClass = () => {
            switch(this.state.rotation) {
                case 90: return 'rotate-90';
                case 180: return 'rotate-180';
                case 270: return 'rotate-270';
                default: return '';
            }
        };

        return <React.Fragment>
            <div className="preview-image-filename">
                {path.basename(this.props.filepath)}
                <button className="rotate-button-small" onClick={this.rotateImage}>
                    ⟲
                </button>
            </div>
            <div className={`preview-image-container ${isVertical ? 'vertical-orientation' : ''}`}>
                <div className="image-wrapper">
                    <img 
                        className={`preview-image ${getRotationClass()}`}
                        src={`file://${this.props.filepath}?${this.props.imageHash}`}
                        onMouseMove={this.handleMouseMove}
                        onMouseLeave={this.handleMouseLeave}
                        onLoad={this.handleImageLoad}
                    />
                </div>
                {this.state.showCoordinates && (
                    <div style={{
                        position: 'absolute',
                        left: `${this.state.mouseX}%`,
                        top: `${this.state.mouseY}%`,
                        transform: getTransformStyle(),
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        pointerEvents: 'none'
                    }}>
                        {pixelX}, {pixelY}
                    </div>
                )}
            </div>
        </React.Fragment>
    }
}
