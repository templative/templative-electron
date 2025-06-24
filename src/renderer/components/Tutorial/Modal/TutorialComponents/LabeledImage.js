import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './LabeledImage.css'

function ImageModal({ src, alt, isOpen, onClose }) {
    if (!isOpen) return null;

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, []);

    return createPortal(
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-content" onClick={onClose}>
                <img className="image-modal-image" src={src} alt={alt} onClick={onClose} />
            </div>
        </div>,
        document.body
    );
}

export function TemplativeLabeledImage({src, alt, caption}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fullSrc = `https://templative.net/${src}`;

    return <>
        <img 
            className="labeled-image" 
            src={fullSrc} 
            alt={alt}
            onClick={() => setIsModalOpen(true)}
            style={{ cursor: 'pointer' }}
        />
        <p className="image-caption" dangerouslySetInnerHTML={{ __html: caption }} />
        <ImageModal 
            src={fullSrc} 
            alt={alt} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
        />
    </>
}

export function LocalLabeledImage({src, alt, caption}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return <>
        <img 
            className="labeled-image" 
            src={src} 
            alt={alt}
            onClick={() => setIsModalOpen(true)}
            style={{ cursor: 'pointer' }}
        />
        <p className="image-caption" dangerouslySetInnerHTML={{ __html: caption }} />
        <ImageModal 
            src={src} 
            alt={alt} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
        />
    </>
}