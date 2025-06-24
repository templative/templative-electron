import React, { useState, useEffect } from "react";
import fs from "fs/promises";
import path from "path";
import TutorialQuestionMark from "../Tutorial/TutorialQuestionMark";
const { shell } = window.require("electron");

export default function RegularFonts({templativeRootDirectoryPath}) {
    const [fontFamilies, setFontFamilies] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to extract base font family name from filename
    const extractFontFamily = (filename) => {
        const baseName = path.basename(filename, '.ttf');
        
        // Common separators and weight/style indicators
        const separators = ['-', '_', ' '];
        const weightStyles = [
            'thin', 'thinitalic', 'extralight', 'extralightitalic', 'ultralight', 'ultralightitalic', 
            'light', 'lightitalic', 'regular', 'regularitalic', 'normal', 'normalitalic', 
            'medium', 'mediumitalic', 'semibold', 'semibolditalic', 'demibold', 'demibolditalic', 
            'bold', 'bolditalic', 'extrabold', 'extrabolditalic', 'ultrabold', 'ultrabolditalic', 
            'black', 'blackitalic', 'heavy', 'heavyitalic',
            'italic', 'oblique', 'condensed', 'condenseditalic', 'expanded', 'expandeditalic', 
            'narrow', 'narrowitalic', 'wide', 'wideitalic'
        ];
        
        // Sort weight styles by length (longest first) to match compound styles first
        const sortedWeightStyles = weightStyles.sort((a, b) => b.length - a.length);
        
        let familyName = baseName;
        
        // Try each separator
        for (const separator of separators) {
            if (baseName.includes(separator)) {
                const parts = baseName.split(separator);
                
                // Find the longest prefix that doesn't contain weight/style indicators
                for (let i = parts.length - 1; i >= 1; i--) {
                    const suffix = parts.slice(i).join(separator).toLowerCase();
                    
                    // Check if this suffix matches any weight/style pattern
                    const isWeightStyle = sortedWeightStyles.some(style => 
                        suffix === style.toLowerCase() || 
                        suffix.includes(style.toLowerCase())
                    );
                    
                    if (isWeightStyle) {
                        familyName = parts.slice(0, i).join(separator);
                        break;
                    }
                }
                
                // If we found a good family name, use it
                if (familyName !== baseName) {
                    break;
                }
            }
        }
        
        // Fallback: Remove weight/style suffixes from the end without separators
        if (familyName === baseName) {
            const lowerName = familyName.toLowerCase();
            for (const style of sortedWeightStyles) {
                if (lowerName.endsWith(style.toLowerCase())) {
                    familyName = familyName.substring(0, familyName.length - style.length);
                    // Remove trailing separators
                    familyName = familyName.replace(/[-_\s]+$/, '');
                    break;
                }
            }
        }
        
        return familyName || baseName; // Fallback to original name if extraction fails
    };

    // Function to extract weight/style from filename
    const extractFontVariant = (filename) => {
        const baseName = path.basename(filename, '.ttf');
        const familyName = extractFontFamily(filename);
        
        // Get the part after the family name
        let variant = baseName.substring(familyName.length);
        variant = variant.replace(/^[-_\s]+/, ''); // Remove leading separators
        
        // If no variant found, check if the family name extraction left some style info
        if (!variant) {
            // Look for common patterns at the end of the base name
            const weightStyles = [
                'ThinItalic', 'ExtraLightItalic', 'UltraLightItalic', 'LightItalic', 
                'RegularItalic', 'NormalItalic', 'MediumItalic', 'SemiBoldItalic', 
                'DemiBoldItalic', 'BoldItalic', 'ExtraBoldItalic', 'UltraBoldItalic', 
                'BlackItalic', 'HeavyItalic', 'CondensedItalic', 'ExpandedItalic',
                'NarrowItalic', 'WideItalic',
                'Thin', 'ExtraLight', 'UltraLight', 'Light', 'Regular', 'Normal', 
                'Medium', 'SemiBold', 'DemiBold', 'Bold', 'ExtraBold', 'UltraBold', 
                'Black', 'Heavy', 'Italic', 'Oblique', 'Condensed', 'Expanded', 
                'Narrow', 'Wide'
            ];
            
            // Sort by length (longest first) to match compound styles first
            const sortedStyles = weightStyles.sort((a, b) => b.length - a.length);
            
            for (const style of sortedStyles) {
                if (baseName.toLowerCase().endsWith(style.toLowerCase())) {
                    variant = baseName.substring(baseName.length - style.length);
                    break;
                }
            }
        }
        
        return variant || 'Regular';
    };

    useEffect(() => {
        const loadFonts = async () => {
            try {
                const fontPath = path.join(templativeRootDirectoryPath, "fonts");
                const files = await fs.readdir(fontPath);
                
                // Get all SVG file base names (without extension) to identify icon fonts
                const svgBaseNames = new Set(
                    files
                        .filter(file => file.toLowerCase().endsWith('.svg'))
                        .map(file => path.basename(file, '.svg'))
                );
                
                // Filter for TTF files and exclude those with corresponding SVG files (icon fonts)
                const ttfFiles = files
                    .filter(file => {
                        if (!file.toLowerCase().endsWith('.ttf')) return false;
                        const baseName = path.basename(file, '.ttf');
                        return !svgBaseNames.has(baseName); // Exclude if there's a matching SVG file
                    })
                    .map(file => {
                        const familyName = extractFontFamily(file);
                        const variant = extractFontVariant(file);
                        const fontPath = path.join(templativeRootDirectoryPath, "fonts", file);
                        return {
                            familyName,
                            variant,
                            filename: file,
                            path: fontPath,
                            cssName: path.basename(file, '.ttf') // Use full filename as CSS font-family
                        };
                    });
                
                // Group fonts by family
                const grouped = ttfFiles.reduce((acc, font) => {
                    if (!acc[font.familyName]) {
                        acc[font.familyName] = [];
                    }
                    acc[font.familyName].push(font);
                    return acc;
                }, {});
                
                // Sort variants within each family
                Object.keys(grouped).forEach(family => {
                    grouped[family].sort((a, b) => {
                        // Custom sort order for common weights
                        const weightOrder = {
                            'thin': 1, 'extralight': 2, 'ultralight': 2, 'light': 3,
                            'regular': 4, 'normal': 4, '': 4, 'medium': 5,
                            'semibold': 6, 'demibold': 6, 'bold': 7,
                            'extrabold': 8, 'ultrabold': 8, 'black': 9, 'heavy': 9
                        };
                        
                        const aWeight = weightOrder[a.variant.toLowerCase()] || 10;
                        const bWeight = weightOrder[b.variant.toLowerCase()] || 10;
                        
                        if (aWeight !== bWeight) return aWeight - bWeight;
                        return a.variant.localeCompare(b.variant);
                    });
                });
                
                // Register fonts with CSS
                ttfFiles.forEach(font => {
                    const fontFace = new FontFace(font.cssName, `url("file://${font.path}")`);
                    fontFace.load().then(() => {
                        document.fonts.add(fontFace);
                    }).catch(err => {
                        console.warn(`Failed to load font ${font.cssName}:`, err);
                    });
                });
                
                setFontFamilies(grouped);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (templativeRootDirectoryPath) {
            loadFonts();
        }
    }, [templativeRootDirectoryPath]);

    if (loading) {
        return <div className="fonts-body">
            <div className="fonts-content">
                <h1>Fonts</h1>
                <p>Loading fonts...</p>
            </div>
        </div>;
    }

    if (error) {
        return <div className="fonts-body">
            <div className="fonts-content">
                <h1>Fonts</h1>
                <p>Error loading fonts: {error}</p>
            </div>
        </div>;
    }

    const installVariants = (variants) => {
        for (const variant of variants) {
            shell.openPath(path.join(templativeRootDirectoryPath, "fonts", variant.filename));
        }
    }

    const installAllVariants = () => {
        for (const familyName in fontFamilies) {
            installVariants(fontFamilies[familyName]);
        }
    }

    const openFontsDirectory = () => {
        shell.openPath(path.join(templativeRootDirectoryPath, "fonts"));
    }

    return <>
        <div className="fonts-header">
            <div className="fonts-header-title">
                <h1>Fonts</h1>
            </div>
            <div className="fonts-header-actions">
                <button className="btn btn-outline-primary btn-sm" onClick={openFontsDirectory}>Open Fonts Directory</button>
                <button className="btn btn-primary btn-sm" onClick={installAllVariants}>Install All</button>
                <TutorialQuestionMark tutorialName="Manage Fonts" />
            </div>
                
        </div>
        <div className="fonts-list">
            {Object.keys(fontFamilies).length === 0 ? (
                <p className="fonts-list-empty">No .ttf font files found in the fonts directory. <br/>Store fonts in your /fonts directory so your collaborators can install them.</p>
            ) : (
                Object.entries(fontFamilies).map(([familyName, variants]) => {
                    return <div key={familyName} className="font-family">
                        <div className="font-family-header">
                            <h2 className="font-family-name">{familyName}</h2>
                            <div className="font-family-actions">
                                <button className="btn btn-outline-primary btn-sm" onClick={() => {
                                    installVariants(variants);
                                }}>
                                    Install
                                </button>
                            </div>
                        </div>
                        <div className="font-variants">
                            {variants.map((font, index) => {
                                return <div key={index} className="font-item">
                                    <p>
                                        <span className="variant-name">{font.variant}</span>
                                        <span className="font-example" style={{ fontFamily: font.cssName, fallback: 'serif' }}>
                                            The quick brown fox jumps over the lazy dog
                                        </span>
                                    </p>
                                </div>
                            })}
                        </div>
                    </div>
                })
            )}
        </div>
        </>
}