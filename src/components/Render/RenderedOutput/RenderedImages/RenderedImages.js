import React from "react";
import ComponentOutputDirectory from "./ComponentOutputDirectory";

export default class RenderedImages extends React.Component { 
    addSpaces = (str) => {
        return str
            .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between lowercase and uppercase
            .replace(/([a-zA-Z])(\d)/g, '$1 $2')  // Add space between letters and numbers
            .replace(/(\d)([a-zA-Z])/g, '$1 $2')
            .replace("D 4", "D4")
            .replace("D 6", "D6")
            .replace("D 8", "D8")
            .replace("D 12", "D12")
            .replace("D 20", "D20")
    }
    render = () => {
        
        return <React.Fragment>
            <div className="component-count-list">
                {Object.keys(this.props.typeQuantities)
                    .sort((a, b) => a.localeCompare(b))
                    .map(type => {
                        return <p key={type} className="component-count-list-item">{this.props.typeQuantities[type]}x {this.addSpaces(type)} Pieces</p>
                    })
                }
            </div>
            
            {this.props.componentDirectories.map(componentDirectory => 
                <ComponentOutputDirectory key={componentDirectory} componentDirectory={componentDirectory}/>
            )}
        
        </React.Fragment>
    }
}