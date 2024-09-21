/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./TopNavbar.css";
import { Link } from 'react-router-dom';

class TopNavbar extends React.Component {
    render() {
        var elements = this.props.topNavbarItems.map((topNavbarItem) => {
            var isSelectedRoute = this.props.currentRoute === topNavbarItem.route;
            var buttonClasses = `btn btn-secondary sidebar-button ${isSelectedRoute && "current-sidebar-button"}`;
            return (
                <button key={topNavbarItem.name} className={buttonClasses} onClick={() => { this.props.updateRouteCallback(topNavbarItem.route) }}>
                    {topNavbarItem.svg}
                    <span className="top-navbar-item-label"><br/>{topNavbarItem.name}</span>
                </button>
            );
        });
        return (
            <div className="topNavbar">
                <ul className="nav flex-column justify-content-center sidebar-buttons">
                    {elements}
                </ul>
            </div>
        );
    }
}

export default TopNavbar;
