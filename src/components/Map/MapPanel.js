import React from "react";
import "./MapPanel.css"
import { trackEvent } from "@aptabase/electron/renderer";
import Map from "./controls/Map";
import MapSearch from "./controls/MapSearch";

export default class MapPanel extends React.Component {      
    render() {        
        return <div className='mainBody'>
            <div className="row">
                <div className="col map-column">
                    <Map/>
                </div>
                <div className="col-4 map-search-column">
                    <MapSearch email={this.props.email} token={this.props.token}/>
                </div>
            </div>
        </div>
    }
}