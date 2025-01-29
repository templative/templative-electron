import React from "react";
import ResourceHeader from "./ContentFiles/ResourceHeader";
import componentComposeIcon from "../Icons/componentComposeIcon.svg"
const fsOld = require('fs');
const fs = require("fs/promises")
const path = require("path")
import CompositionItem from "./CompositionItem";
    
export default class CompositionsList extends React.Component {
    state = {
        isExtended: true,
    }
    
    toggleExtendedAsync = () => {
        this.setState(prev => ({ isExtended: !prev.isExtended }))
    }
    
    render() {       
        return <div className="content-file-list unified-viewer-list">
            <ResourceHeader 
                iconSource={componentComposeIcon}
                header="Compositions"
                isExtended={this.state.isExtended}
                toggleExtendedAsyncCallback={this.toggleExtendedAsync}
            />
            {this.state.isExtended &&
                <>
                    {this.props.componentCompose.map((composition, index) => 
                        <CompositionItem
                            key={composition.name + index}
                            type={composition.type}
                            templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                            quantity={composition.quantity}
                            compositionName={composition.name}
                            isDisabled={composition.disabled}
                            currentFilepath={this.props.currentFilepath}
                            filepath={path.join(this.props.templativeRootDirectoryPath, `component-compose.json#${composition.name}`)}
                            updateViewedFileUsingExplorerAsyncCallback={this.props.updateViewedFileUsingExplorerAsyncCallback}
                            updateRouteCallback={this.props.updateRouteCallback}
                            deleteCompositionCallbackAsync={() => this.props.deleteCompositionCallbackAsync(index)}
                            duplicateCompositionCallbackAsync={() => this.props.duplicateCompositionCallbackAsync(index)}
                            toggleDisableCompositionCallbackAsync={() => this.props.toggleDisableCompositionCallbackAsync(index)}
                            index={index}
                        />
                    )}
                </>
            } 
        </div>
    }
}