import React from "react";
import "../../ArtdataViewer.css"

import studioIcon from "../../../../Icons/studioIcon.svg"
import gameIcon from "../../../../Icons/gameIcon.svg"
import componentIcon from "../../../../Icons/componentIcon.svg"
import pieceIcon from "../../../../Icons/pieceIcon.svg"
import staticValueIcon from "../../../../Icons/staticValueIcon.svg"

export default class ScopedValueInputWithOptions extends React.Component {   
    getFlattenedOptions = () => {
        const options = [
            { scope: 'global', value: '', label: 'Static Value', icon: staticValueIcon },
            // { scope: 'utility', value: 'git-sha', label: 'Utility: Git Commit Hash' }
        ];

        const sources = {
            studio: { label: "Studio's", icon: studioIcon },
            game: { label: "Game's", icon: gameIcon },
            component: { label: "Component's", icon: componentIcon },
            piece: { label: "Piece's", icon: pieceIcon }
        };

        Object.entries(sources).forEach(([scope, info]) => {
            this.props.availableDataSources[scope]?.forEach(field => {
                options.push({
                    scope: scope,
                    value: field,
                    label: `${info.label} ${field}`,
                    icon: info.icon
                });
            });
        });

        return options;
    }

    handleSelectionChange = (event) => {
        const [scope, value] = event.target.value.split(':');
        this.props.updateArtdataFieldCallback(this.props.index, "scope", scope);
        if (scope === 'utility' || value) {
            this.props.updateArtdataFieldCallback(this.props.index, "source", value);
        }
    }

    render() {
        const options = this.getFlattenedOptions();
        const currentOption = options.find(opt => 
            opt.scope === this.props.scope && opt.value === this.props.source
        );
        const currentValue = `${this.props.scope}:${this.props.source}`;
        const showManualInput = this.props.scope === 'global';
        
        return (
            <React.Fragment>
                <span className="input-group-text scope-icon-container">
                    <img 
                        className="scope-icon" 
                        src={currentOption?.icon || staticValueIcon} 
                        alt="Scope icon"
                    /> 
                </span>
                <select 
                    value={currentValue} 
                    onChange={this.handleSelectionChange} 
                    className={`form-select scope-select ${!showManualInput && 'wide-scope-select'}`}
                >
                    {options.map(opt => (
                        <option 
                            key={`${opt.scope}:${opt.value}`} 
                            value={`${opt.scope}:${opt.value}`}
                        >
                            {opt.label}
                        </option>
                    ))}
                </select>
                {showManualInput && (
                    <React.Fragment>
                        <input 
                            type="text" 
                            className="form-control no-left-border scoped-value-manual-input" 
                            onChange={(event) => this.props.updateArtdataFieldCallback(this.props.index, "source", event.target.value)} 
                            value={this.props.source}
                            placeholder="Field name..."
                        />
                        
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
} 