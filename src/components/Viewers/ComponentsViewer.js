import React from "react";
import ComponentItemEditable from "./ComponentItemEditable"

import "./ComponentViewer.css"

export default class ComponentsViewer extends React.Component {   
    render() {
        var componentItems = []
        this.props.components.forEach(component => {
            componentItems.push(<ComponentItemEditable key={component.name} component={component}/>)
        });

        return <div className="row componentViewer">
            <div className="col">
                <div className="row">
                    <h1>Components</h1>
                </div>
                <div className="row">
                    <div className="col">
                        {componentItems}
                    </div>
                </div>
            </div>
        </div> 
    }
}