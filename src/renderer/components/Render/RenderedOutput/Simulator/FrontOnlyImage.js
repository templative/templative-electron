import React from "react";
import "./FrontBackImages.css";

export default class FrontOnlyImage extends React.Component {   
    constructor(props) {
        super(props);
        this.imageRef = React.createRef();
        this.state = {
            greaterImageStyles: {},
            lesserImageStyles: {},
        };
    }
    
    componentDidMount() {
        this.imageRef.current.addEventListener('load', this.updateImageSizes);
        window.addEventListener('resize', this.updateImageSizes);
    }

    componentWillUnmount() {
        this.imageRef.current.removeEventListener('load', this.updateImageSizes);
        window.removeEventListener('resize', this.updateImageSizes);
    }

    updateImageSizes = () => {
        const image = this.imageRef.current;

        if (image) {
            const imageRatio = image.naturalWidth / image.naturalHeight;

            // Calculate the relative widths
            const totalRatio = imageRatio;
            const imageWidthPercent = (imageRatio / totalRatio) * 100;

            this.setState({
                imageStyles: {
                    width: `${imageWidthPercent}%`,
                    height: 'auto'
                }
            });
        }
    };

    render() {  
        return (
            <div className="simulator-tiled-container">
                <div className="image-container">
                    <img 
                        ref={this.imageRef} 
                        className="object-state-image" 
                        src={this.props.imageUrl}
                        style={this.state.imageStyles}
                        alt="Front"
                    />
                </div>
            </div>
        );
    }
}
