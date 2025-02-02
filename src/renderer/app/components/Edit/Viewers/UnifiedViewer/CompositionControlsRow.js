import React from "react";
import socket from "../../../../utility/socket";
const addSpaces = (str) => {
    return str
        // First specifically handle D4, D6, D8, D10, D12, D20
        .replace(/D(4|6|8|10|12|20)(\d+)/g, 'D$1 $2')
        // Then handle measurement units, keeping them with their numbers
        .replace(/(\d+)(mm|cm)/g, '$1$2')
        // Add space between lowercase and uppercase
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Add space between letters and numbers (except for measurement units)
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        // Clean up any double spaces
        .replace(/\s+/g, ' ')
        // Fix dice notation
        .replace(/D ?(4|6|8|10|12|20)/g, 'D$1')
        .trim()
}
export default function CompositionControlsRow(props) {
    const {
        componentName, updateComponentName,
        type, updateComponentType,
        quantity, updateQuantity,
        isDisabled, updateIsDisabled,
        componentTypesCustomInfo,
        componentTypesStockInfo,
        isProcessing,
        updateRouteCallback,
        templativeRootDirectoryPath
    } = props;

    const icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-brush component-use-icon" viewBox="0 0 16 16">
        <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04M4.705 11.912a1.2 1.2 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.4 3.4 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3 3 0 0 0 .126-.75zm1.44.026c.12-.04.277-.1.458-.183a5.1 5.1 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005zm3.582-3.043.002.001h-.002z"/>
    </svg>
    const renderCompositionAsyncCallback = async () => {
        var request = {
            isDebug: false,
            isComplex: true,
            componentFilter: componentName,
            language: "en",
            directoryPath: templativeRootDirectoryPath,
        }
        socket.emit('produceGame', request);
        updateRouteCallback("render")
    };
    const isStock = type.startsWith("STOCK_")
    return <div className="row g-0 composition-controls-row">
    <div className="input-group input-group-sm" data-bs-theme="dark">
        
        <span className="input-group-text soft-label">Quantity</span>
        <input type="number" className="form-control no-left-border quantity-input" placeholder={0} aria-label="Search" value={quantity} onChange={async (e) => await updateQuantity(e.target.value)} />
        
        <span className="input-group-text soft-label">Name</span>
        <input type="text" className="form-control no-left-border" placeholder="Name" aria-label="Search" value={componentName} onChange={async (e) => await updateComponentName(e.target.value)} />
        
        <span className="input-group-text soft-label">Type</span>
        <select className="form-select no-left-border" value={type} onChange={async (e) => await updateComponentType(e.target.value)}>
            {Object.entries(isStock ? componentTypesStockInfo : componentTypesCustomInfo).sort((a, b) => a[0].localeCompare(b[0])).map(([key, value]) => (
                <option key={key} value={isStock ?  "STOCK_"+key :key}>{addSpaces(key)}</option>
            ))}
        </select>

        

        <span className="input-group-text soft-label">Disabled</span>
        <div className="input-group-text no-left-border">
            <input 
                className="form-check-input mt-0" 
                type="checkbox" 
                checked={isDisabled}
                onChange={async (e) => await updateIsDisabled(e.target.checked)}
                aria-label="Checkbox to disable component"
            />
        </div>

        <button onClick={renderCompositionAsyncCallback} disabled={isProcessing} className="btn btn-outline-secondary" type="button" title={`Render ${componentName}.`}>
            {icon} Render Composition
        </button>
            
    </div>
</div>
}