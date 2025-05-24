import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "./CreateIconFontModal.css";

const SvgPreview = ({ file }) => {
    const [svgContent, setSvgContent] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadSvgContent = async () => {
            try {
                const fs = window.require('fs').promises;
                const content = await fs.readFile(file.path, 'utf-8');
                setSvgContent(content);
            } catch (err) {
                console.error('Error reading SVG file:', err);
                setError(true);
            }
        };

        if (file.path) {
            loadSvgContent();
        }
    }, [file.path]);

    if (error) {
        return <div className="svg-preview-error">!</div>;
    }

    if (!svgContent) {
        return <div className="svg-preview-loading">...</div>;
    }

    return (
        <div 
            className="svg-preview" 
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};

export default function CreateIconFontModal({ onClose, onSubmit }) {
    const [fontName, setFontName] = useState("");
    const [svgFiles, setSvgFiles] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        const svgFilesList = files.filter(file => file.path.toLowerCase().endsWith('.svg'));
        
        if (svgFilesList.length > 0) {
            setSvgFiles(prev => [...prev, ...svgFilesList]);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const svgFilesList = files.filter(file => file.path.toLowerCase().endsWith('.svg'));
        
        if (svgFilesList.length > 0) {
            setSvgFiles(prev => [...prev, ...svgFilesList]);
        }
    };

    const removeFile = (index) => {
        setSvgFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!fontName.trim()) {
            alert("Please enter a font name");
            return;
        }
        
        if (svgFiles.length === 0) {
            alert("Please add at least one SVG file");
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Extract file paths for the main process
            const filePaths = svgFiles.map(file => file.path);
            await onSubmit(filePaths, fontName.trim());
        } catch (error) {
            console.error("Error creating icon font:", error);
            alert("Error creating icon font. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <div className="modal-overlay" onClick={handleModalClick}>
            <div className="create-icon-font-modal">
                <div className="modal-header">
                    <h2 className="modal-title">Create Icon Font</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fontName" className="form-group-label">Name</label>
                        <input
                            id="fontName"
                            type="text"
                            value={fontName}
                            onChange={(e) => setFontName(e.target.value)}
                            placeholder="Enter font name (e.g., my-icons)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-group-label">Add SVG Files</label>
                        <p className="svg-file-instructions">Each SVG file should contain a single icon. Every svg file should have the same width and height and viewBox.</p>
                        <div 
                            className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="drop-zone-content">
                                <p>Drag and drop SVG files here or click to browse</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".svg"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    {svgFiles.length > 0 && (
                        <div className="form-group">
                            <label className="form-group-label">Selected Files ({svgFiles.length})</label>
                            <div className="file-list">
                                {svgFiles.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <div className="file-preview">
                                            <SvgPreview file={file} />
                                        </div>
                                        <span className="file-name">{file.name}</span>
                                        <button 
                                            type="button" 
                                            className="remove-file-btn"
                                            onClick={() => removeFile(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn btn-outline-primary" onClick={onClose}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={isSubmitting || !fontName.trim() || svgFiles.length === 0}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Icon Font'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    // Render the modal content to document.body using createPortal
    return ReactDOM.createPortal(modalContent, document.body);
} 