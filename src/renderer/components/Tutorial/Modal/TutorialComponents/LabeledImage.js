import React, { useState, useEffect } from 'react';
import './LabeledImage.css'
export default function LabeledImage({src, alt, caption}) {
    return <>
        <img className="labeled-image" src={`https://templative.net/${src}`} alt={alt}/>
        <p className="image-caption" dangerouslySetInnerHTML={{ __html: caption }} />
    </>
}