import React from "react";
import "./SimulatorStockComponent.css";
import Bag from "./bag.svg?react";

export default class SimulatorStockComponentBag extends React.Component {   
    render() {          
        const imageUrl = `https://templative-component-preview-images.s3.us-west-2.amazonaws.com/${this.props.type.replace("STOCK_","")}.png`
        // console.log(this.props.templativeType)
        return (
            <div className="simulator-tiled-container">
                <div className="simulator-stock-component">
                    <Bag className="simulator-bag"/>
                    <img src={imageUrl} alt={name} className="simulator-stock-component-image"/>
                    <span className="simulator-stock-component-name">{this.props.quantity}x</span>
                </div>
            </div>
        );
    }
}
