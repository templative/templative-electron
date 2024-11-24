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
            { scope: "global", label: "Static Value", icon: staticValueIcon },
            { scope: "piece", label: "Piece's (Manual Input)", icon: pieceIcon },
            { scope: "component", label: "Component's (Manual Input)", icon: componentIcon },
            { scope: "studio", label: "Studio's (Manual Input)", icon: studioIcon },
            { scope: "game", label: "Game's (Manual Input)", icon: gameIcon },
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
        const showManualInput = this.props.scope === 'global' || !currentOption;

        // Create a custom label for manual inputs that aren't 'global'
        let currentValue, currentLabel;
        if (showManualInput) {
            const scopeInfo = {
                studio: "Studio's",
                game: "Game's",
                component: "Component's",
                piece: "Piece's"
            }[this.props.scope];
            currentValue = `${this.props.scope}`;
            currentLabel = scopeInfo ? `${scopeInfo} ${this.props.source}` : 'Static Value';
        } else {
            currentValue = `${this.props.scope}:${this.props.source}`;
            currentLabel = currentOption?.label || 'Static Value';
        }
        
        const scopeIcons = {
            studio: studioIcon,
            game: gameIcon,
            component: componentIcon,
            piece: pieceIcon,
            global: staticValueIcon
        };
        const iconToShow = scopeIcons[this.props.scope] || staticValueIcon;
        
        var title = this.props.scope === 'global' ? 
            `Use the value '${this.props.source}' directly.` :
            `Use the '${this.props.source}' field in the ${this.props.scope[0].toUpperCase() + this.props.scope.slice(1)} Content.`

        return (
            <React.Fragment>
                <span className="input-group-text scope-icon-container" title={title}>
                    <img 
                        className="scope-icon" 
                        src={iconToShow} 
                        alt="Scope icon"
                    /> 
                </span>
                <select 
                    value={currentValue} 
                    onChange={this.handleSelectionChange} 
                    className={`form-select scope-select ${!showManualInput && 'wide-scope-select'}`}
                    title={title}
                >
                    {options.map(opt => {
                        var key = opt.value ? `${opt.scope}:${opt.value}` : opt.scope
                        return <option 
                            key={key} 
                            value={key}
                        >
                            {opt.label}
                        </option>
                    })}
                </select>
                {showManualInput && 
                    <input 
                        type="text" 
                        title={title}
                        className="form-control no-left-border scoped-value-manual-input" 
                        onChange={(event) => this.props.updateArtdataFieldCallback(this.props.index, "source", event.target.value)} 
                        value={this.props.source}
                        placeholder="value..."
                    />
                }
            </React.Fragment>
        );
    }
} 