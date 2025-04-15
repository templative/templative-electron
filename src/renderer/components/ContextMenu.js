import React from "react";
import "./ContextMenu.css"

class ContextMenu extends React.Component {  
    constructor(props) {
        super(props);
        this.menuRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.menuRef.current && !this.menuRef.current.contains(event.target)) {
            this.props.closeContextMenuCallback();
        }
    }

    render() {
        const { commands, left, top } = this.props;
        const elements = commands.map((command) => (
            <p 
                key={command.name} 
                className="context-menu-item" 
                onClick={async (e) => {
                    e.stopPropagation();
                    await command.callback();
                    this.props.closeContextMenuCallback();
                }}
            >
                {command.name}
            </p>
        ));

        return (
            <div 
                ref={this.menuRef}
                className="context-menu"
                style={{
                    left: `${left}px`,
                    top: `${top}px`,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {elements}
            </div>
        );
    }
}

export default ContextMenu;