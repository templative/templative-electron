import React, { useState } from "react";

export default function Glyph({fontFamily, glyphName, unicode, d, unitsPerEm}) {
    const [isHovering, setIsHovering] = useState(false);
    const [clicked, setClicked] = useState(false);
    const glyphInsert = `<iconGlyph font-family='${fontFamily}' ${glyphName ? `glyph='${glyphName}'` : `unicode='${unicode}'`}/>`;
    
    if (!glyphName && unicode == "20") {
        return null;
    }

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
