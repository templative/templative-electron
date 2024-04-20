import React from "react";
import "./ComponentViewer.css"
import AutocompleteInput from "./AutocompleteInput";

export default class ComponentItemEditableStock extends React.Component {   
    state = {
        isHovering: false,
    }
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    render() {
        var stockOptions = Object.keys(this.props.componentTypesStockInfo).map(key => "STOCK_" + key)
        var typeOptions = Object.keys(this.props.componentTypesCustomInfo).concat(stockOptions)

        return <div className="vertical-input-group editable-component" 
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}>
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                <span className="input-group-text component-left-bumper">Name</span>
                <input type="text" aria-label="First name" className="form-control " 
                    onChange={(event) => this.props.updateFloatingNameCallback(event.target.value)}
                    onBlur={() => this.props.releaseFloatingNameCallback()}
                    value={this.props.isFloatingName ? this.props.floatingName : this.props.component.name}/> 
                {this.state.isHovering && 
                    <React.Fragment>
                        <button onClick={()=>this.props.duplicateComponentCallback()} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg></button>
                        <button onClick={()=>this.props.deleteComponentCallback()} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/></svg></button>
                    </React.Fragment>
                }               
            </div>
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                <span className="input-group-text component-left-bumper">Type</span>
                <AutocompleteInput 
                    value={this.props.component.type} 
                    onChange={(value)=> this.props.updateComponentFieldCallback("type", value)}
                    ariaLabel="Type"
                    options={typeOptions}
                />   
            </div>
                      

            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                
                <span className="input-group-text component-left-bumper">Quantity</span>
                <input type="text" aria-label="First name" className="form-control" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("quantity", event.target.value)}
                    value={this.props.component.quantity}/>

                <span className="input-group-text no-right-border">Disabled</span>
                <div className="input-group-text no-left-border">
                    <input className="form-check-input mt-0" type="checkbox" value="" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("disabled", !this.props.component.disabled)}
                    checked={this.props.component.disabled} aria-label="Checkbox for following text input" />
                </div>

                <span className="input-group-text no-right-border">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bug" viewBox="0 0 16 16"><path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/></svg>
                </span>
                <div className="input-group-text no-left-border">
                    <input className="form-check-input mt-0" type="checkbox" value="" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("isDebugInfo", !this.props.isDebugInfo)}
                    checked={this.props.isDebugInfo} aria-label="Checkbox for following text input" />
                </div>

            </div>
        </div> 
    }
}