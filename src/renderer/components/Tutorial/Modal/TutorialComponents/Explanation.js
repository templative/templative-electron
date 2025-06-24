import React, { useState, useEffect } from 'react';
import "./Explanation.css";

export default function Explanation({title, children}) {
    const [isExtended, setIsExtended] = useState(false);
    const chevronSize = "14";
    const collapsedChevron = <svg xmlns="http://www.w3.org/2000/svg" width={chevronSize} height={chevronSize} fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
    </svg>
    const extendedChevron = <svg xmlns="http://www.w3.org/2000/svg" width={chevronSize} height={chevronSize} fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
    </svg>
    
    return <div className="explanation">
        <div className="explanation-header" onClick={() => setIsExtended(!isExtended)}>
            <div className="explanation-chevron">
                {isExtended ? extendedChevron : collapsedChevron}
            </div>
            <p>{title}</p>
        </div>
        {isExtended &&
            <div className="explanation-content">
                {children}
            </div>
        }
    </div>
}