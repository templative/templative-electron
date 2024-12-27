import React from "react";
import "../ComponentViewer.css"

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
                return startsWithValue 
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

        const shouldShowAutocomplete = options.length > 0 && this.state.isFocused
        return <React.Fragment>
            <input 
                onFocus={this.onFocus} onBlur={this.onBlur}
                type="text" 
                aria-label={this.props.ariaLabel} 
                className="form-control autocomplete-input no-left-border" 
                onChange={(event)=>this.props.onChange(event.target.value)} 
                value={this.props.value}/>
            { shouldShowAutocomplete &&
                <div className="auto-complete"
                    style={{left: `${this.props.left}px`, top: `${this.props.top}px`,}}
                >
                {options}
            </div>
            }
        </React.Fragment>
    }
}