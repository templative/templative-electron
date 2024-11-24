import React from "react";
import ComponentOutputDirectory from "./ComponentOutputDirectory";

export default class ComponentOutputContainer extends React.Component { 
    state = {
        isExtended: true
    }  
   
    toggleExtended = () => {
        this.setState({isExtended: !this.state.isExtended})
    }
    render = () => {
        
        const extendedChevron = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
        </svg>

        const collapsedChevron = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>

        return <div className="renderedComponent">
            <div className="component-output-header" onClick={this.toggleExtended}>                    
                <p className="rendered-component-title">{this.props.componentName} {this.props.componentType && <span className="rendered-component-type"> - {this.props.componentType}</span>}</p>
                <div className="component-output-extension-chevron">
                    {this.state.isExtended ? extendedChevron : collapsedChevron}
                </div>
            </div>
            {this.state.isExtended && (
                this.props.componentDirectories.map(componentDirectory =>
                    <ComponentOutputDirectory 
                        key={componentDirectory}
                        componentName={this.props.componentName}
                        componentDirectory={componentDirectory}
                    />
                )
            )}
        </div>
    }
}