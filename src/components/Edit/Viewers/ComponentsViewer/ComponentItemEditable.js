import React from "react";
import "./ComponentViewer.css"

export default class ComponentItemEditable extends React.Component {   
    state = {
        isHovering: false
    }
    handleMouseOver = () => {
        this.setState({isHovering: true})
    }
    handleMouseOut = () => {
        this.setState({isHovering: false})
    }
    render() {
        var isDebug = this.props.component.isDebugInfo === true
        var isStock = this.props.component.type.split("_").shift() === "STOCK"
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
                        <button onClick={()=>this.props.duplicateComponentCallback()} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1">Duplicate</button>
                        <button onClick={()=>this.props.deleteComponentCallback()} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1">🗑️</button>
                    </React.Fragment>
                }               
            </div>
            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                <span className="input-group-text component-left-bumper">Type</span>
                <input type="text" aria-label="First name" className="form-control" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("type", event.target.value)} 
                    value={this.props.component.type}/>
            </div> 
            {!isStock && <>
                <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                <span className="input-group-text component-left-bumper">Component Gamedata</span>
                <input type="text" aria-label="First name" className="form-control"                     
                    onChange={(event)=>this.props.updateComponentFieldCallback("componentGamedataFilename", event.target.value)} 
                    value={this.props.component.componentGamedataFilename}/>
                </div>
                <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text component-left-bumper">Piece Gamedata</span>
                    <input type="text" aria-label="First name" className="form-control" 
                        onChange={(event)=>this.props.updateComponentFieldCallback("piecesGamedataFilename", event.target.value)} 
                        value={this.props.component.piecesGamedataFilename}/>
                </div>

                <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text component-left-bumper">Front Artdata</span>
                    <input type="text" aria-label="First name" className="form-control" 
                        onChange={(event)=>this.props.updateComponentFieldCallback("artdataFrontFilename", event.target.value)}
                        value={this.props.component.artdataFrontFilename}/>
                </div>
                <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                    <span className="input-group-text component-left-bumper">Back Artdata</span>
                    <input type="text" aria-label="First name" className="form-control" 
                        onChange={(event)=>this.props.updateComponentFieldCallback("artdataBackFilename", event.target.value)}
                        value={this.props.component.artdataBackFilename}/>
                </div>
            </>}
            

            <div className="input-group mb-3 input-group-sm mb-3" data-bs-theme="dark">
                
                <span className="input-group-text component-left-bumper">Quantity</span>
                <input type="text" aria-label="First name" className="form-control" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("quantity", event.target.value)}
                    value={this.props.component.quantity}/>

                <span className="input-group-text">Disabled</span>
                <div className="input-group-text">
                    <input className="form-check-input mt-0" type="checkbox" value="" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("disabled", !this.props.component.disabled)}
                    checked={this.props.component.disabled} aria-label="Checkbox for following text input" />
                </div>

                <span className="input-group-text">🪲</span>
                <div className="input-group-text">
                    <input className="form-check-input mt-0" type="checkbox" value="" 
                    onChange={(event)=>this.props.updateComponentFieldCallback("isDebugInfo", !isDebug)}
                    checked={isDebug} aria-label="Checkbox for following text input" />
                </div>

            </div>
        </div> 
    }
}