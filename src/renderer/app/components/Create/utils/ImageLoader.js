import React, { useState, useEffect } from 'react';

/**
 * Loads an image from a PreviewUri that might use webpack aliases
 * This handles the webpack require in a way that is statically analyzable
 * @param {string} previewUri - The uri path to load
 * @returns {string|null} The resolved path or null if error occurred
 */
export const loadPreviewImage = (previewUri) => {
    if (!previewUri) return null;
    
    try {
        // Handle paths that use the @previewImages alias format explicitly
        if (previewUri.startsWith('@previewImages/')) {
            const imagePath = previewUri.replace('@previewImages/', '');
            return require(`@previewImages/${imagePath}`);
        }
        
        // For other formats, extract just the filename and use the alias
        const previewPath = previewUri.replace(/^.*[\\\/]/, '');
        return require(`@previewImages/${previewPath}`);
    } catch (e) {
        console.error('Failed to load preview image:', e);
        return null;
    }
};

/**
 * Load a template SVG from the templates directory
 * @param {string} templatePath - Path to the template file
 * @returns {string|null} The resolved path or null if error occurred
 */
export const loadTemplateImage = (templatePath) => {
    if (!templatePath) return null;
    
    try {
        return require(`@templates/${templatePath}.svg`);
    } catch (e) {
        console.error('Failed to load template image:', e);
        return null;
    }
};

/**
 * Component for displaying a preview image with error handling
 */
export const ComponentImagePreview = ({ 
    previewUri, 
    altText = 'Component', 
    className = 'preview-image',
    fallbackContent = 'No preview available',
    fallbackClassName = 'preview-placeholder' 
}) => {
    const [imageError, setImageError] = useState(false);
    const [imageSource, setImageSource] = useState(null);

    useEffect(() => {
        if (previewUri) {
            const source = loadPreviewImage(previewUri);
            setImageSource(source);
            setImageError(!source);
        } else {
            setImageSource(null);
            setImageError(true);
        }
    }, [previewUri]);

    if (imageError || !imageSource) {
        return (
            <div className={fallbackClassName}>
                <span>{fallbackContent}</span>
            </div>
        );
    }

    return (
        <img 
            src={imageSource}
            alt={altText}
            className={className}
            onError={() => setImageError(true)}
        />
    );
};

export default {
    loadPreviewImage,
    loadTemplateImage,
    ComponentImagePreview
}; 