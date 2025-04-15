import React from "react";
import { channels } from '../../../../../shared/constants';
import { addSpaces } from "../../../../utility/addSpaces";
const { ipcRenderer } = window.require('electron');
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
        templativeRootDirectoryPath,
        onOpenFileModal
    } = props;

    const icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-brush component-use-icon" viewBox="0 0 16 16">
        <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04M4.705 11.912a1.2 1.2 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.4 3.4 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3 3 0 0 0 .126-.75zm1.44.026c.12-.04.277-.1.458-.183a5.1 5.1 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005zm3.582-3.043.002.001h-.002z"/>
    </svg>
    const gearIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
    </svg>
    const renderCompositionAsyncCallback = async () => {
        var request = {
            isDebug: false,
            isComplex: true,
            componentFilter: componentName,
            language: "en",
            directoryPath: templativeRootDirectoryPath,
        }
        await ipcRenderer.invoke(channels.TO_SERVER_PRODUCE_GAME, request);
        updateRouteCallback("render")
    };
    const isStock = type.startsWith("STOCK_")
    return <div className="row g-0 composition-controls-row">
        <div className="col">
            <div className="input-group input-group-sm" data-bs-theme="dark">
            
            <span className="input-group-text soft-label">Quantity</span>
            <input type="number" className="form-control no-left-border quantity-input" placeholder={0} aria-label="Search" value={quantity} onChange={async (e) => await updateQuantity(e.target.value)} />
            
            <span className="input-group-text soft-label">Name</span>
            <input type="text" className="form-control no-left-border no-right-border" placeholder="Name" aria-label="Search" value={componentName} onChange={async (e) => await updateComponentName(e.target.value)} />
            
            <span className="input-group-text soft-label no-left-border">{(isDisabled) ? "Disabled " : ""}{addSpaces(type)}</span>
            

            <button 
                className="btn btn-outline-secondary comp-controls-gear-btn" 
                type="button" 
                onClick={async (e) => await onOpenFileModal()}
                aria-label="Checkbox component settings"
            >
                {gearIcon}
            </button>

            <button onClick={renderCompositionAsyncCallback} disabled={isProcessing} className="btn btn-primary" type="button" title={`Render ${componentName}.`}>
                {icon} Render Composition
            </button>
            </div>
        </div>
    </div>
}