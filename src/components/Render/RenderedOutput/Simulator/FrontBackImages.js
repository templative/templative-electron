import React from "react";

export default class FrontBackImages extends React.Component {   
    constructor(props) {
        super(props);
        this.greaterImageRef = React.createRef();
        this.lesserImageRef = React.createRef();
        this.state = {
            greaterImageStyles: {},
            lesserImageStyles: {},
        };
    }
    
    componentDidMount() {
        this.greaterImageRef.current.addEventListener('load', this.updateImageSizes);
        this.lesserImageRef.current.addEventListener('load', this.updateImageSizes);
        window.addEventListener('resize', this.updateImageSizes);
    }

    componentWillUnmount() {
        this.greaterImageRef.current.removeEventListener('load', this.updateImageSizes);
        this.lesserImageRef.current.removeEventListener('load', this.updateImageSizes);
        window.removeEventListener('resize', this.updateImageSizes);
    }

    updateImageSizes = () => {
        const greaterImage = this.greaterImageRef.current;
        const lesserImage = this.lesserImageRef.current;

        if (greaterImage && lesserImage) {
            const greaterImageRatio = greaterImage.naturalWidth / greaterImage.naturalHeight;
            const lesserImageRatio = lesserImage.naturalWidth / lesserImage.naturalHeight;

            // Calculate the relative widths
            const totalRatio = greaterImageRatio + lesserImageRatio;
            const greaterImageWidthPercent = (greaterImageRatio / totalRatio) * 100;
            const lesserImageWidthPercent = (lesserImageRatio / totalRatio) * 100;

            this.setState({
                greaterImageStyles: {
                    width: `${greaterImageWidthPercent}%`,
                    height: 'auto'
                },
                lesserImageStyles: {
                    width: `${lesserImageWidthPercent}%`,
                    height: 'auto'
                }
            });
        }
    };

    render() {  
        return (
            <div className="simulator-tiled-container" style={{ display: 'flex', width: '100%' }}>
                <div className="image-container" style={{ display: 'flex', width: '100%' }}>
                    <img 
                        ref={this.greaterImageRef} 
                        className="object-state-image greater-image" 
                        src={this.props.frontImageUrl}
                        style={this.state.greaterImageStyles}
                        alt="Front"
                    />
                    <img 
                        ref={this.lesserImageRef} 
                        className="object-state-image lesser-image" 
                        src={this.props.backImageUrl}
                        style={this.state.lesserImageStyles}
                        alt="Back"
                    />
                </div>
            </div>
        );
    }
}
