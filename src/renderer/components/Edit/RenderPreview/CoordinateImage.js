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
            imageHeight: 0
        };
    }

    handleMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        
        this.setState({
            mouseX: x,
            mouseY: y,
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

    render() {
        const getTransformStyle = () => {
            const isLeft = this.state.mouseX < 50;
            const isTop = this.state.mouseY < 50;
            
            if (isLeft && isTop) return 'translate(10px, 10px)';         // Top-left: move down and right
            if (!isLeft && isTop) return 'translate(-110%, 10px)';       // Top-right: move down and left
            if (isLeft && !isTop) return 'translate(10px, -110%)';       // Bottom-left: move up and right
            return 'translate(-110%, -110%)';                            // Bottom-right: move up and left
        }

        return <React.Fragment>
            <div className="preview-image-filename">
                {path.basename(this.props.filepath)}
            </div>
            <div style={{ position: 'relative' }}>
                <img 
                    className="preview-image" 
                    src={`file://${this.props.filepath}?${this.props.imageHash}`}
                    onMouseMove={this.handleMouseMove}
                    onMouseLeave={this.handleMouseLeave}
                    onLoad={this.handleImageLoad}
                />
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
                        {Math.floor((this.state.mouseX/100) * (this.state.imageWidth))}, {Math.floor((this.state.mouseY/100) * (this.state.imageHeight))}
                    </div>
                )}
            </div>
        </React.Fragment>
    }
}
