import React, { useState } from "react";
const path = require('path');
import FileLoadFailure from "./FileLoadFailure";
import EditableViewerRaw from "./EditableViewerRaw";
import "./FontViewer.css";
import FontIcon from "../Icons/fontIcon.svg?react"
import { shell } from "electron";

class FontTTFViewer extends React.Component {    
    installFont = async () => {
        shell.openPath(this.props.filepath);
    }
    
    render() {
        const fontName = path.basename(this.props.filepath, ".ttf")
        
        return <div className="ttf-font-container">
            <div className="font-installed-container">
                <FontIcon className="font-installed-icon" />                    
                <div className="font-not-installed-container">
                    <button className="btn btn-primary" onClick={async () => { await this.installFont() }}>Install {fontName}</button>
                </div>
            </div>
        </div>
    }
}

const Glyph = ({fontFamily, glyphName, unicode, d, unitsPerEm}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [clicked, setClicked] = useState(false);
    const glyphInsert = `<iconGlyph font-family='${fontFamily}' ${glyphName ? `glyph='${glyphName}'` : `unicode='${unicode}'`}/>`;
    
    const copyUnicode = () => {
        navigator.clipboard.writeText(glyphInsert);
        setClicked(true);
    }
    const name = glyphName || unicode;
    return <div className="glyph" onClick={() => copyUnicode()} 
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
            setIsHovering(false);
            setClicked(false);
        }}
        >
        <div className="glyph-name-container" title={glyphInsert}>
            <svg className="glyph-svg" xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox={`0 0 ${unitsPerEm} ${unitsPerEm}`}>
                <g><path fill="#878ec4" d={d} /></g>
            </svg>
            
            <p>{ clicked ? "Copied!" : (isHovering ? "Copy" : name)}</p>
        </div>
    </div>
}
class FontSvgViewer extends React.Component {
    
    render() {
        const parser = new DOMParser();
        if (!this.props.content) {
            return <div>No content</div>
        }
        const xmlDoc = parser.parseFromString(this.props.content, "text/xml");
        
        // Extract font information
        const fontElement = xmlDoc.querySelector('font');
        if (!fontElement) {
            return <div>No font element</div>
        }
        const fontFamily = fontElement.getAttribute('id');
        const fontFaceElement = fontElement.querySelector('font-face');
        if (!fontFaceElement) {
            return <div>No font face element</div>
        }
        const unitsPerEm = fontFaceElement.getAttribute('units-per-em');
        if (!unitsPerEm) {
            return <div>No units per em</div>
        }
        const ascent = fontFaceElement.getAttribute('ascent');
        if (!ascent) {
            return <div>No ascent</div>
        }
        const descent = fontFaceElement.getAttribute('descent');
        
        // Extract glyphs
        const glyphs = []
        Array.from(fontElement.querySelectorAll('glyph')).forEach(glyph => {
            
            const glyphName = glyph.getAttribute('glyph-name');
            const unicode = glyph.getAttribute('unicode')
            const d = glyph.getAttribute('d');
            
            // Convert unicode to string representation
            let unicodeStr = "";
            if (unicode) {
                try {
                    unicodeStr = unicode.codePointAt(0).toString(16).replace("&#x","").replace(";", "");
                } catch (e) {
                    console.warn("Failed to convert unicode for glyph:", glyphName);
                }
            }
            
            glyphs.push({
                glyphName: glyphName,
                unicode: unicodeStr,
                d: d
            });
        });
        
        // Create SVGs for each glyph
        var glyphElements = glyphs
            .filter(glyph => !(glyph.glyphName && glyph.glyphName.endsWith("-1")))
            .map(glyph => 
                <Glyph key={glyph.glyphName} fontFamily={fontFamily} glyphName={glyph.glyphName} unicode={glyph.unicode} d={glyph.d} unitsPerEm={unitsPerEm} />
            );
            
        return <div className="glyphs-container">
            {glyphElements}
        </div>
    }
}
export default class FontViewer extends EditableViewerRaw {
    getFilePath = (props) => {
        return props.filepath
    }
    
    render() {
        if (this.state.failedToLoad) {
            return <FileLoadFailure templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} filepath={this.state.filepath} errorMessage={this.state.errorMessage} />
        }
        if (!this.state.hasLoaded) {
            return null;//<div className="font-loading-container"><p className="font-loading">Loading {path.basename(this.props.filepath)}...</p></div>
        }        
        const Viewer = this.props.filepath.endsWith(".ttf") ? FontTTFViewer : FontSvgViewer
        
        return <div className="font-body">
                <Viewer 
                    content={this.state.content} 
                    filepath={this.props.filepath} 
                    templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}
                /> 
        </div>
    }
}
