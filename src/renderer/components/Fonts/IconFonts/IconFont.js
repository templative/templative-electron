import React, { useState, useEffect } from "react";
import fs from "fs/promises";
import path from "path";
import Glyph from "./Glyph";


export default function IconFont({iconFont, onInstall}) {
    const [svgContent, setSvgContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSvgContent = async () => {
            try {
                const content = await fs.readFile(iconFont.svgPath, 'utf-8');
                setSvgContent(content);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        loadSvgContent();
    }, [iconFont.svgPath]);

    const parseGlyphsFromSvg = (content) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, "text/xml");
        
        const fontElement = xmlDoc.querySelector('font');
        if (!fontElement) return { glyphs: [], fontFamily: iconFont.name, unitsPerEm: 1000 };
        
        const fontFamily = fontElement.getAttribute('id') || iconFont.name;
        const fontFaceElement = fontElement.querySelector('font-face');
        const unitsPerEm = fontFaceElement?.getAttribute('units-per-em') || 1000;
        
        const glyphs = [];
        Array.from(fontElement.querySelectorAll('glyph')).forEach(glyph => {
            const glyphName = glyph.getAttribute('glyph-name');
            const unicode = glyph.getAttribute('unicode');
            const d = glyph.getAttribute('d');
            
            let unicodeStr = "";
            if (unicode) {
                try {
                    // Convert unicode character to hex code point and format as &#xHHHH;
                    const codePoint = unicode.codePointAt(0).toString(16);
                    unicodeStr = `&#x${codePoint};`;
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

        return { glyphs, fontFamily, unitsPerEm };
    };

    if (loading) {
        return <div className="icon-font">
            <div className="icon-font-header">
                <h3 className="icon-font-name">{iconFont.name}</h3>
                <p>Loading glyphs...</p>
            </div>
        </div>;
    }

    if (error) {
        return <div className="icon-font">
            <div className="icon-font-header">
                <h3 className="icon-font-name">{iconFont.name}</h3>
                <p>Error loading glyphs: {error}</p>
            </div>
        </div>;
    }

    const { glyphs, fontFamily, unitsPerEm } = parseGlyphsFromSvg(svgContent);
    const filteredGlyphs = glyphs.filter(glyph => !(glyph.glyphName && glyph.glyphName.endsWith("-1")));

    return <div className="icon-font">
        <div className="icon-font-header">
            <h3 className="icon-font-name">{iconFont.name}</h3>
            <div className="icon-font-actions">
                <button className="btn btn-outline-primary" onClick={() => onInstall(iconFont)}>
                    Install
                </button>
            </div>
        </div>
        <div className="glyphs-container-small">
            {filteredGlyphs.map((glyph, index) => (
                <Glyph 
                    key={`${glyph.glyphName || glyph.unicode}-${index}`}
                    fontFamily={fontFamily} 
                    glyphName={glyph.glyphName} 
                    unicode={glyph.unicode} 
                    d={glyph.d} 
                    unitsPerEm={unitsPerEm} 
                />
            ))}
        </div>
    </div>;
};