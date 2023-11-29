/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./TopNavbar.css"
import { Link } from 'react-router-dom';

class TopNavbar extends React.Component {   
    render() {
        var elements = this.props.topNavbarItems.map((topNavbarItem) => {
            return <li key={topNavbarItem.name} className="nav-item">
                <Link onClick={()=> {this.props.updateRouteCallback(topNavbarItem.route)}} to={topNavbarItem.route} className={this.props.currentRoute === topNavbarItem.route ? "currentRoute nav-link" : "nav-link"}>{topNavbarItem.name}</Link>
            </li>
        })
        return <div className="topNavbar">
            <ul className="nav justify-content-center">
                {elements}
            </ul>
        </div>
    }
}
export default TopNavbar;