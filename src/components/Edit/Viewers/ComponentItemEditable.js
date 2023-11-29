import React from "react";
import "./ComponentViewer.css"

export default class ComponentItemEditable extends React.Component {   
    render() {

        var isDebug = this.props.component.isDebug === true

        return <div className="row componentEditable">
            <div className="input-group mb-3" data-bs-theme="dark">
                <span className="input-group-text">Name</span>
                <input type="text" aria-label="First name" className="form-control" onChange={()=>{}} value={this.props.component.name}/>

                <span className="input-group-text">Type</span>
                <input type="text" aria-label="First name" className="form-control" onChange={()=>{}} value={this.props.component.type}/>
            </div>

            <div className="input-group mb-3" data-bs-theme="dark">
                <span className="input-group-text">Component Gamedata</span>
                <input type="text" aria-label="First name" className="form-control" onChange={()=>{}} value={this.props.component.componentGamedataFilename}/>

                <span className="input-group-text">Piece Gamedata</span>
                <input type="text" aria-label="First name" className="form-control" onChange={()=>{}} value={this.props.component.piecesGamedataFilename}/>
            </div>

            <div className="input-group mb-3" data-bs-theme="dark">
                <span className="input-group-text">Front Artdata</span>
                <input type="text" aria-label="First name" className="form-control" onChange={()=>{}} value={this.props.component.artdataFrontFilename}/>

                <span className="input-group-text">Back Artdata</span>
                <input type="text" aria-label="First name" className="form-control" onChange={()=>{}} value={this.props.component.artdataBackFilename}/>
            </div>

            <div className="input-group mb-3" data-bs-theme="dark">
                
                <span className="input-group-text">Quantity</span>
                <input type="text" aria-label="First name" className="form-control" onChange={()=>{}} value={this.props.component.quantity}/>

                <span className="input-group-text">Disabled</span>
                <div className="input-group-text">
                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{}} checked={this.props.component.disabled} aria-label="Checkbox for following text input" />
                </div>

                <span className="input-group-text">🪲</span>
                <div className="input-group-text">
                    <input className="form-check-input mt-0" type="checkbox" value="" onChange={()=>{}} checked={isDebug} aria-label="Checkbox for following text input" />
                </div>

            </div>
        </div> 
    }
}