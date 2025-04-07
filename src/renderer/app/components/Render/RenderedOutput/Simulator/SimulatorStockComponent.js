import React from "react";
import "./SimulatorStockComponent.css";

export default class SimulatorStockComponent extends React.Component {   
    render() {          
        const imageUrl = `https://templative-component-preview-images.s3.us-west-2.amazonaws.com/${this.props.type.replace("STOCK_","")}.png`
        // console.log(this.props.templativeType)
        return (
            <div className="simulator-tiled-container">
                <div className="simulator-stock-component">
                    <img src={imageUrl} alt={name} className="simulator-stock-component-image"/>
                </div>
            </div>
        );
    }
}
