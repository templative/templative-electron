/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./TopNavbar.css"

export default class TopNavbar extends React.Component {   
    render() {
        var elements = this.props.topNavbarItems.map((topNavbarItem) => {
            return <li key={topNavbarItem.name} className="nav-item">
                <a className="nav-link">{topNavbarItem.name}</a>
            </li>
        })
        return <div className="topNavbar">
            <ul className="nav justify-content-center">
                {elements}
            </ul>
        </div>
    }
}