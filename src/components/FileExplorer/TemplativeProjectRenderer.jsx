import React from "react";
import ComponentItem from "./ComponentItem"
import ResourceHeader from "./ResourceHeader"
import ArtdataList from "./ArtdataList"
import GamedataList from "./GamedataList"
import ArtList from "./ArtList"

export default class TemplativeProjectRenderer extends React.Component {   
    

    renderComponentDivs() {
        if (this.props.templativeProject === undefined) {
            return [];
        }
        var divs = [];
        for(var i = 0; i < this.props.templativeProject.componentCompose.length; i++) {
            var component = this.props.templativeProject.componentCompose[i]
            divs.push(<ComponentItem currentFilepath={this.props.currentFilepath} updateViewedFileCallback={this.props.updateViewedFileCallback} key={component.name} component={component}/>)
        }
        return divs;
    }

    render() {
        var componentDivs = this.renderComponentDivs()
        return <div>
            <ResourceHeader header="Templates"/>
            { this.props.templativeProject !== undefined  &&
                <ArtList currentFilepath={this.props.currentFilepath} updateViewedFileCallback={this.props.updateViewedFileCallback} filenames={this.props.templativeProject.getTemplateFilenames()}/>
            }
            <ResourceHeader header="Overlays"/>
            { this.props.templativeProject !== undefined  &&
                <ArtList currentFilepath={this.props.currentFilepath} updateViewedFileCallback={this.props.updateViewedFileCallback} filenames={this.props.templativeProject.getOverlayFilenames()}/>
            }
            <ResourceHeader header="Artdata"/>
            { this.props.templativeProject !== undefined  &&
                <ArtdataList currentFilepath={this.props.currentFilepath} updateViewedFileCallback={this.props.updateViewedFileCallback} filenames={this.props.templativeProject.getArtdataFilenames()}/>
            }
            <ResourceHeader header="Project Gamedata"/>
            { this.props.templativeProject !== undefined  &&
                <GamedataList gamedataType="KEYVALUE_GAMEDATA" currentFilepath={this.props.currentFilepath} updateViewedFileCallback={this.props.updateViewedFileCallback} filenames={this.props.templativeProject.getStudioAndGamedataFilenames()}/>
            }
            <ResourceHeader header="Component Gamedata"/>
            { this.props.templativeProject !== undefined  &&
                <GamedataList gamedataType="KEYVALUE_GAMEDATA" currentFilepath={this.props.currentFilepath} updateViewedFileCallback={this.props.updateViewedFileCallback} filenames={this.props.templativeProject.getComponentGamedataFilenames()}/>
            }
            <ResourceHeader header="Piece Gamedata"/>
            { this.props.templativeProject !== undefined  &&
                <GamedataList gamedataType="PIECE_GAMEDATA" currentFilepath={this.props.currentFilepath} updateViewedFileCallback={this.props.updateViewedFileCallback} filenames={this.props.templativeProject.getPieceGamedataFilenames()}/>
            }
            <ResourceHeader header="Components"/>
            {componentDivs}
        </div>        
    }
}