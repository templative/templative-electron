import React from "react";
import "./GamedataViewer.css"

// value, key, trackedKey, currentUpdateValue
export default class KeyValueInput extends React.Component {
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
        var isValueColor = /^#[0-9A-F]{6}$/i.test(this.props.value)

        return <div className="input-group input-group-sm mb-3" data-bs-theme="dark" key={this.props.gamedataKey} 
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
            >
            {/* <span className="input-group-text">🔒</span> */}
            
            <input type="text" className="form-control key-field" 
                onChange={(event) => this.props.trackChangedKeyCallback(this.props.gamedataKey, event.target.value)} 
                onBlur={()=>this.props.freeTrackedChangedKeyCallback()}
                aria-label="What key to get from the scope..." 
                value={this.props.trackedKey === this.props.gamedataKey ? this.props.currentUpdateValue : this.props.gamedataKey}/>
            
            
            {/* <span className="input-group-text">🔑</span> */}
            <input type="text" className="form-control value-field" 
                onChange={(event)=>this.props.updateValueCallback(this.props.gamedataKey, event.target.value)} 
                aria-label="What key to get from the scope..." 
                style={{color: isValueColor ? this.props.value : "inherit"}}
                value={this.props.value}/>

            { this.state.isHovering && <button onClick={()=>this.props.removeKeyValuePairCallback(this.props.gamedataKey)} className="btn btn-outline-secondary trash-button" type="button" id="button-addon1">🗑️</button>}
            
        </div>
    }
}