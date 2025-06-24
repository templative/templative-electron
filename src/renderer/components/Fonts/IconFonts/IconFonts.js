import React, { useState, useEffect } from "react";
import fs from "fs/promises";
import path from "path";
const { shell, ipcRenderer } = window.require("electron");
import { channels } from "../../../../shared/constants";
import CreateIconFontModal from "./CreateIconFontModal";
import IconFont from "./IconFont";
import TutorialQuestionMark from "../../Tutorial/TutorialQuestionMark";

export default function IconFonts({templativeRootDirectoryPath}) {
    const [iconFonts, setIconFonts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const loadIconFonts = async () => {
        try {
            const fontPath = path.join(templativeRootDirectoryPath, "fonts");
            const files = await fs.readdir(fontPath);
            
            // Find SVG files and check for corresponding TTF files
            const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'));
            const ttfFiles = files.filter(file => file.toLowerCase().endsWith('.ttf'));
            
            const iconFontPairs = [];
            
            for (const svgFile of svgFiles) {
                const baseName = path.basename(svgFile, '.svg');
                const correspondingTtf = ttfFiles.find(ttf => 
                    path.basename(ttf, '.ttf').toLowerCase() === baseName.toLowerCase()
                );
                
                if (correspondingTtf) {
                    iconFontPairs.push({
                        name: baseName,
                        svgPath: path.join(fontPath, svgFile),
                        ttfPath: path.join(fontPath, correspondingTtf),
                        svgFile,
                        ttfFile: correspondingTtf
                    });
                }
            }
            
            setIconFonts(iconFontPairs);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (templativeRootDirectoryPath) {
            loadIconFonts();
        }
    }, [templativeRootDirectoryPath]);

    const installIconFont = (iconFont) => {
        shell.openPath(iconFont.ttfPath);
    };

    const installAllIconFonts = () => {
        iconFonts.forEach(iconFont => {
            shell.openPath(iconFont.ttfPath);
        });
    };

    const openFontsDirectory = () => {
        shell.openPath(path.join(templativeRootDirectoryPath, "fonts"));
    };

    const handleCreateIconFont = async (svgFiles, fontName) => {
        try {
            // Send to main process for icon font creation
            const result = await ipcRenderer.invoke(channels.TO_SERVER_CREATE_ICON_FONT, {
                name: fontName,
                svgFiles: svgFiles,
                outputPath: path.join(templativeRootDirectoryPath, "fonts")
            });
            
            if (result.success) {
                // Reload icon fonts to show the new one
                await loadIconFonts();
                setShowCreateModal(false);
            } else {
                console.error('Icon font creation failed:', result.error);
                // TODO: Show error to user
            }
        } catch (error) {
            console.error('Error creating icon font:', error);
            // TODO: Show error to user
        }
    };

    if (loading) {
        return <>
            <h1>Icon Fonts</h1>
            <p>Loading icon fonts...</p>
        </>;
    }

    if (error) {
        return <>
            <h1>Icon Fonts</h1>
            <p>Error loading icon fonts: {error}</p>
        </>;
    }

    return <>
        <div className="fonts-header">
            <div className="fonts-header-title">
                <h1>Icon Fonts</h1>
            </div>
            <div className="fonts-header-actions">
                <button className="btn btn-outline-primary btn-sm" onClick={openFontsDirectory}>
                    Open Fonts Directory
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
                    Create Icon Font
                </button>
                {iconFonts.length > 0 && (
                    <button className="btn btn-primary btn-sm" onClick={installAllIconFonts}>
                        Install All
                    </button>
                )}
                <TutorialQuestionMark tutorialName="Use Icon Fonts" />
            </div>
        </div>
        
        <div className="icon-fonts-list">
            {iconFonts.length === 0 ? (
                <p className="fonts-list-empty">No icon fonts found in the fonts directory. <br/>Icon fonts require both a .ttf and .svg file with the same name.<br/>Create one by using the Create Icon Font button.</p>
            ) : (
                iconFonts.map((iconFont) => (
                    <IconFont 
                        key={iconFont.name} 
                        iconFont={iconFont} 
                        onInstall={installIconFont}
                    />
                ))
            )}
        </div>

        {showCreateModal && (
            <CreateIconFontModal
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateIconFont}
            />
        )}
    </>;
}