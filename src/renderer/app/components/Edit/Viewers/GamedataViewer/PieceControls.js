import React from "react";
import "./GamedataViewer.css"

export default class PieceControls extends React.Component {
    static preventSpacesAndNumbers = (e) => {
        if (/[\s]/.test(e.key)) {
            e.preventDefault();
        }
    }
    static preventNonNumbers = (e) => {
        if (e.key === "Backspace" || e.key === "Tab") {
            return
        }
        if(/[0-9\b]/.test(e.key)) {
            return
        }
        e.preventDefault();
    }
    render() {
        return <div key="main-row" className="input-group input-group-sm mb-3" data-bs-theme="dark">

            <span className="input-group-text input-group-text soft-label">name</span>
            <input type="text" className="form-control value-field no-left-border"
                onChange={(event)=> this.props.updateValueCallback("name", event.target.value.replace(/[<>:"/\\|?*]/g, ""))} 
                aria-label="What key to get from the scope..." 
                value={this.props.piece["name"]}/>
                
                <span className="input-group-text input-group-text soft-label">quantity</span>
            <input type="number" className="form-control value-field gamedata-quantity-input no-left-border" 
                onKeyDown={(e) => PieceControls.preventNonNumbers(e)}
                onChange={(event) => {
                    const value = event.target.value;
                    if (value === '-' || value === '') {
                        this.props.updateValueCallback("quantity", value)
                    } else {
                        const numValue = parseInt(value);
                        if (!isNaN(numValue)) {
                            this.props.updateValueCallback("quantity", numValue)
                        }
                    }
                }}
                aria-label="What key to get from the scope..." 
                value={this.props.piece["quantity"]}
            />

            

            <button onClick={this.props.duplicatePieceByIndexCallback} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                </svg>
            </button>
            
            <button onClick={this.props.deleteCallback} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/></svg></button>   
            
            {this.props.isPreviewEnabled &&
                <button 
                    onClick={async ()=> await this.props.previewPieceCallback()}
                    className="btn btn-primary preview-piece-button" 
                    type="button"
                    title={`Preview ${this.props.piece["name"]}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-brush render-piece-icon" viewBox="0 0 16 16">
                        <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04M4.705 11.912a1.2 1.2 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.4 3.4 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3 3 0 0 0 .126-.75zm1.44.026c.12-.04.277-.1.458-.183a5.1 5.1 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005zm3.582-3.043.002.001h-.002z"/>
                    </svg> Preview
                </button>
            }
        </div>
    }
}