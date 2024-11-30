import React from "react";
import "./GamedataViewer.css"

// value, key, trackedKey, currentUpdateValue
export default class KeyValueInput extends React.Component {
    state = {
        isHoveringOverLock: false
    }
    handleMouseOverLock = () => {
        this.setState({isHoveringOverLock: true})
    }
    handleMouseOutLock = () => {
        this.setState({isHoveringOverLock: false})
    }
    render() {
        var isValueColor = /^#[0-9A-F]{6}$/i.test(this.props.value)
        var key = this.props.trackedKey === this.props.gamedataKey ? this.props.currentUpdateValue : this.props.gamedataKey
        var isLocked = this.props.hasLockPotential && this.props.isLocked
        return <div className="input-group input-group-sm mb-3" data-bs-theme="dark" key={this.props.gamedataKey} 
            >
            
            <input type="text" className="form-control key-field" 
                onChange={(event) => this.props.trackChangedKeyCallback(this.props.gamedataKey, event.target.value)} 
                onBlur={()=>this.props.freeTrackedChangedKeyCallback()}
                placeholder="The name of the field" 
                value={key}/>
            
            <textarea rows={Math.max(1,Math.floor(this.props.value.length/70))} className="form-control value-field value-text-area" 
                onChange={(event)=>this.props.updateValueCallback(this.props.gamedataKey, event.target.value)} 
                placeholder="The value of the field"
                style={{color: isValueColor ? this.props.value : "inherit"}}
                value={this.props.value}
            />

            
                <button onClick={()=>this.props.toggleLockCallback(this.props.gamedataKey)} 
                    className={`btn btn-outline-secondary key-value-control-button`} 
                    type="button" 
                    id="button-addon1"
                    onMouseOver={this.handleMouseOverLock}
                    onMouseLeave={this.handleMouseOutLock}
                >
                {(isLocked !== this.state.isHoveringOverLock) ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                    </svg>   
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-unlock-fill" viewBox="0 0 16 16">
                        <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2"/>
                    </svg>
                }
                </button>
                <button disabled={isLocked} 
                    onClick={()=>this.props.removeKeyValuePairCallback(this.props.gamedataKey)} 
                    className="btn btn-outline-secondary key-value-control-button" 
                    type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"
                        />
                    </svg>
                </button>
            
        </div>
    }
}