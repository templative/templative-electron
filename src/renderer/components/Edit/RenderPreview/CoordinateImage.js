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
        this.imageRef = React.createRef();
        this.containerRef = React.createRef();
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
        }, this.adjustImageSize);
    }

    rotateImage = () => {
        this.setState(prevState => ({
            rotation: (prevState.rotation + 90) % 360
        }), this.adjustImageSize);
    }

    adjustImageSize = () => {
        if (!this.imageRef.current || !this.containerRef.current) return;
        
        const containerWidth = this.containerRef.current.clientWidth;
        const { imageWidth, imageHeight, rotation } = this.state;
        
        // Determine if we're in portrait or landscape orientation after rotation
        const isRotated90or270 = rotation === 90 || rotation === 270;
        
        if (isRotated90or270) {
            // For 90° or 270° rotation, we need to consider the inverted aspect ratio
            const aspectRatio = imageHeight / imageWidth; // Inverted for rotation
            
            // Calculate the height that would maintain aspect ratio at full container width
            const idealHeight = containerWidth * aspectRatio;
            
            // Set the image size to fit within the container
            this.imageRef.current.style.width = 'auto';
            this.imageRef.current.style.height = `${containerWidth}px`;
            this.imageRef.current.style.maxWidth = 'none';
            
            // Set container height to match the rotated image width
            this.containerRef.current.style.height = `${idealHeight}px`;
        } else {
            // For 0° or 180° rotation, reset to normal sizing
            this.imageRef.current.style.width = 'auto';
            this.imageRef.current.style.height = 'auto';
            this.imageRef.current.style.maxWidth = '100%';
            this.containerRef.current.style.height = 'auto';
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.adjustImageSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.adjustImageSize);
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
        
        // Adjust shadow direction based on rotation
        let shadowDirection;
        switch(this.state.rotation) {
            case 0: shadowDirection = '4px 4px 0px'; break;
            case 90: shadowDirection = '4px -4px 0px'; break;
            case 180: shadowDirection = '-4px -4px 0px'; break;
            case 270: shadowDirection = '-4px 4px 0px'; break;
            default: shadowDirection = '4px 4px 0px';
        }
        
        return <React.Fragment>
            <div className="preview-image-filename">
                {path.basename(this.props.filepath)}
                <button className="rotate-button-small" onClick={this.rotateImage}>
                    ⟲
                </button>
            </div>
            <div 
                className="preview-image-container"
                ref={this.containerRef}
            >
                <div className="image-wrapper">
                    <img 
                        ref={this.imageRef}
                        className="preview-image"
                        style={{
                            transform: `rotate(${this.state.rotation}deg)`,
                            filter: `drop-shadow(${shadowDirection} rgba(0, 0, 0, 0.5))`
                        }}
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
