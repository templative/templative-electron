import React from "react";
import "./ComponentViewer.css"

export default class AutocompleteInput extends React.Component {   
    state = {
        isFocused: false
    }
    onFocus = () => {
        this.setState({isFocused: true})
    }
    onBlur = () => {
        this.setState({isFocused: false})
    }
    render() {
        var options = this.props.options
            .filter(option => {
                const startsWithValue = option.startsWith(this.props.value)
                const isntEqual = option.toUpperCase() !== this.props.value.toUpperCase()
                return startsWithValue && isntEqual
            })
            .sort()
            .map(option => {
                return <p 
                    key={option}
                >
                    <span className="already-written-autocomplete">
                        {this.props.value}
                    </span>
                    {option.replace(this.props.value, "")}
                </p>
            })

        const shouldShowAutocomplete =  options.length > 0 && this.state.isFocused && this.props.value.length > 0
        return <div className="input-group mb-3 input-group-sm mb-3 autocomplete-input-group" data-bs-theme="dark">
            <span className="input-group-text component-left-bumper">Type</span>
            <input 
                onFocus={this.onFocus} onBlur={this.onBlur}
                type="text" 
                aria-label={this.props.ariaLabel} 
                className="form-control autocomplete-input" 
                onChange={(event)=>this.props.onChange(event.target.value)} 
                value={this.props.value}/>
            { shouldShowAutocomplete &&
                <div className="auto-complete"
                    style={{left: `${this.props.left}px`, top: `${this.props.top}px`,}}
                >
                {options}
            </div>
            }
        </div>
    }
}