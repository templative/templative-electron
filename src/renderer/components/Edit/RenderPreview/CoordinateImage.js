import React from "react";
import path from "path";
import CopyIcon from "./Icons/CopyIcon.svg?react";
import ZoomIcon from "./Icons/ZoomIcon.svg?react";
import RotateIcon from "./Icons/RotateIcon.svg?react";
import CheckIcon from "./Icons/CheckIcon.svg?react";
export default class CoordinateImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mouseX: null,
            mouseY: null,
            showCoordinates: false,
            imageWidth: 0,
            imageHeight: 0,
            rotation: 0,
            showModal: false,
            modalMouseX: null,
            modalMouseY: null,
            showModalCoordinates: false,
            mainCopyButtonCopied: false,
            modalCopyButtonCopied: false
        };
        this.imageRef = React.createRef();
        this.containerRef = React.createRef();
        this.modalImageRef = React.createRef();
        this.modalContainerRef = React.createRef();
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
        window.addEventListener('resize', this.adjustModalImageSize);
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.adjustImageSize);
        window.removeEventListener('resize', this.adjustModalImageSize);
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.rotation !== this.state.rotation && this.state.showModal) {
            // Adjust modal image size when rotation changes
            setTimeout(() => this.adjustModalImageSize(), 10);
        }
    }

    handleKeyDown = (e) => {
        if (e.key === 'Escape' && this.state.showModal) {
            this.closeModal();
        }
    }
    copyImage = async (buttonType = 'main') => {
        try {
            if (!this.imageRef.current) return;
            
            const img = this.imageRef.current;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions based on rotation
            const isRotated90or270 = this.state.rotation === 90 || this.state.rotation === 270;
            canvas.width = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
            canvas.height = isRotated90or270 ? img.naturalWidth : img.naturalHeight;
            
            // Apply rotation transform
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((this.state.rotation * Math.PI) / 180);
            ctx.translate(-img.naturalWidth / 2, -img.naturalHeight / 2);
            
            // Draw the image
            ctx.drawImage(img, 0, 0);
            ctx.restore();
            
            // Convert canvas to blob and copy to clipboard
            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    console.log('Image copied to clipboard');
                    
                    // Update the appropriate copy button state
                    if (buttonType === 'main') {
                        this.setState({ mainCopyButtonCopied: true });
                    } else {
                        this.setState({ modalCopyButtonCopied: true });
                    }
                } catch (err) {
                    console.error('Failed to copy image to clipboard:', err);
                    // Fallback: copy filepath if image copy fails
                    navigator.clipboard.writeText(this.props.filepath);
                }
            }, 'image/png');
            
        } catch (err) {
            console.error('Failed to copy image:', err);
            // Fallback: copy filepath if anything fails
            navigator.clipboard.writeText(this.props.filepath);
        }
    }

    handleMainCopyButtonMouseLeave = () => {
        this.setState({ mainCopyButtonCopied: false });
    }

    handleModalCopyButtonMouseLeave = () => {
        this.setState({ modalCopyButtonCopied: false });
    }
    zoomImage = () => {
        this.setState({ showModal: true });
    }

    closeModal = () => {
        this.setState({ showModal: false });
    }

    handleModalMouseMove = (e) => {
        const imageRect = e.target.getBoundingClientRect();
        const containerRect = this.modalContainerRef.current.getBoundingClientRect();
        
        // Calculate position relative to the actual image
        const x = Math.round(((e.clientX - imageRect.left) / imageRect.width) * 100);
        const y = Math.round(((e.clientY - imageRect.top) / imageRect.height) * 100);
        
        // Calculate position relative to the container for positioning the tooltip
        const containerX = Math.round(((e.clientX - containerRect.left) / containerRect.width) * 100);
        const containerY = Math.round(((e.clientY - containerRect.top) / containerRect.height) * 100);
        
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
            modalMouseX: containerX,
            modalMouseY: containerY,
            adjustedX: adjustedX,
            adjustedY: adjustedY,
            showModalCoordinates: true
        });
    }

    handleModalMouseLeave = () => {
        this.setState({ showModalCoordinates: false });
    }

    handleModalImageLoad = (e) => {
        this.adjustModalImageSize();
    }

    adjustModalImageSize = () => {
        if (!this.modalImageRef.current || !this.modalContainerRef.current) return;
        
        const containerWidth = this.modalContainerRef.current.clientWidth;
        const containerHeight = this.modalContainerRef.current.clientHeight;
        const { imageWidth, imageHeight, rotation } = this.state;
        
        // Determine if we're in portrait or landscape orientation after rotation
        const isRotated90or270 = rotation === 90 || rotation === 270;
        
        let displayWidth, displayHeight;
        
        if (isRotated90or270) {
            // For 90° or 270° rotation, we need to consider the inverted aspect ratio
            const aspectRatio = imageHeight / imageWidth;
            
            // Calculate dimensions to fit within container
            displayWidth = Math.min(containerWidth * 0.9, containerHeight * 0.9 / aspectRatio);
            displayHeight = displayWidth * aspectRatio;
            
            this.modalImageRef.current.style.width = `${displayWidth}px`;
            this.modalImageRef.current.style.height = 'auto';
            this.modalImageRef.current.style.maxWidth = 'none';
        } else {
            // For 0° or 180° rotation
            const aspectRatio = imageWidth / imageHeight;
            
            // Calculate dimensions to fit within container
            displayHeight = Math.min(containerHeight * 0.9, containerWidth * 0.9 / aspectRatio);
            displayWidth = displayHeight * aspectRatio;
            
            this.modalImageRef.current.style.height = `${displayHeight}px`;
            this.modalImageRef.current.style.width = 'auto';
            this.modalImageRef.current.style.maxWidth = '90%';
        }
    }

    render() {
        const getTransformStyle = (isModal = false) => {
            const mouseX = isModal ? this.state.modalMouseX : this.state.mouseX;
            const mouseY = isModal ? this.state.modalMouseY : this.state.mouseY;
            
            const isLeft = mouseX < 50;
            const isTop = mouseY < 50;
            
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
            </div>
            <div className="preview-image-controls">
                <button className="preview-image-control-button" onClick={this.rotateImage}>
                    <RotateIcon/>
                </button>
                <button 
                    className={`preview-image-control-button ${this.state.mainCopyButtonCopied ? 'copied-image' : ''}`}
                    onClick={() => this.copyImage('main')}
                    onMouseLeave={this.handleMainCopyButtonMouseLeave}
                >
                    {this.state.mainCopyButtonCopied ? <CheckIcon/> : <CopyIcon/>}
                </button>
                <button className="preview-image-control-button" onClick={this.zoomImage}>
                    <ZoomIcon/>
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
                        transform: getTransformStyle(false),
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

            {/* Zoom Modal */}
            {this.state.showModal && (
                <div className="zoom-modal-overlay" onClick={this.closeModal}>
                    <div className="zoom-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="zoom-modal-header">
                            <div className="zoom-modal-filename">
                                {path.basename(this.props.filepath)}
                            </div>
                            <div className="zoom-modal-controls">
                                <button className="preview-image-control-button" onClick={this.rotateImage}>
                                    <RotateIcon/>
                                </button>
                                <button 
                                    className={`preview-image-control-button ${this.state.modalCopyButtonCopied ? 'copied-image' : ''}`}
                                    onClick={() => this.copyImage('modal')}
                                    onMouseLeave={this.handleModalCopyButtonMouseLeave}
                                >
                                    {this.state.modalCopyButtonCopied ? <CheckIcon/> : <CopyIcon/>}
                                </button>
                                <button className="zoom-modal-close" onClick={this.closeModal}>
                                    ×
                                </button>
                            </div>
                        </div>
                        <div 
                            className="zoom-modal-image-container"
                            ref={this.modalContainerRef}
                        >
                            <div className="zoom-modal-image-wrapper">
                                <img 
                                    ref={this.modalImageRef}
                                    className="zoom-modal-image"
                                    style={{
                                        transform: `rotate(${this.state.rotation}deg)`,
                                        filter: `drop-shadow(${shadowDirection} rgba(0, 0, 0, 0.5))`
                                    }}
                                    src={`file://${this.props.filepath}?${this.props.imageHash}`}
                                    onMouseMove={this.handleModalMouseMove}
                                    onMouseLeave={this.handleModalMouseLeave}
                                    onLoad={this.handleModalImageLoad}
                                />
                            </div>
                            {this.state.showModalCoordinates && (
                                <div style={{
                                    position: 'absolute',
                                    left: `${this.state.modalMouseX}%`,
                                    top: `${this.state.modalMouseY}%`,
                                    transform: getTransformStyle(true),
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
                    </div>
                </div>
            )}
        </React.Fragment>
    }
}
