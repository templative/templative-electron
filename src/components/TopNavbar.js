/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./TopNavbar.css"
import { Link } from 'react-router-dom';

class TopNavbar extends React.Component {   
    render() {
        var elements = this.props.topNavbarItems.map((topNavbarItem) => {
            var isSelectedRoute = this.props.currentRoute === topNavbarItem.route
            var buttonClasses = "btn btn-secondary " + (isSelectedRoute ? "currentRoute" : "")
            return <li key={topNavbarItem.name} className="nav-item">
                <Link onClick={()=> {this.props.updateRouteCallback(topNavbarItem.route)}} to={topNavbarItem.route} className={"nav-link"}>
                    <button className={buttonClasses}>
                        {topNavbarItem.svg}
                    </button>
                </Link>
            </li>
        })
        return <div className="topNavbar">
            <ul className="nav flex-column justify-content-center sidebar-buttons">
                {elements}
            </ul>
        </div>
    }
}
export default TopNavbar;