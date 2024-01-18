import React from "react";
import onClickOutside from 'react-onclickoutside'
import "./ContextMenu.css"

class ContextMenu extends React.Component {  
    handleClickOutside = () => {
        this.props.closeContextMenuCallback()
    } 
    render() {

        var elements = this.props.commands.map((command) => {
            return <p 
                key={command.name} 
                className="context-menu-item" 
                onClick={() => {
                    command.callback()
                    this.props.closeContextMenuCallback()
                }}
            >
                {command.name}
            </p>
        })
        return <div className="context-menu"
            onBlur={(e) => {console.log(e)}}
            style={{left: `${this.props.left}px`, top: `${this.props.top}px`,}}
        >
            {elements}
        </div>
    }
}
export default onClickOutside(ContextMenu);