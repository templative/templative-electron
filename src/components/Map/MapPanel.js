import React from "react";
import "./MapPanel.css"
import { trackEvent } from "@aptabase/electron/renderer";
import Map from "./controls/Map";
import MapSearch from "./controls/MapSearch";
import TemplativeClient from "../../TemplativeClient"

export default class MapPanel extends React.Component {    
    state = {
        doesUserOwnTemplative: false
    }    
    checkIfOwnsTemplative = async () => {
        var ownsTemplative = await TemplativeClient.doesUserOwnTemplative(this.props.email, this.props.token)
        this.setState({ doesUserOwnTemplative: ownsTemplative})
    }  
    componentDidMount = async () => {
        await this.checkIfOwnsTemplative()
    }
    render() {        
        return <div className='mainBody'>
            <div className="row">
                <div className="col map-column">
                    <Map doesUserOwnTemplative={this.state.doesUserOwnTemplative}/>
                </div>
                <div className="col-4 map-search-column">
                    <MapSearch doesUserOwnTemplative={this.state.doesUserOwnTemplative} email={this.props.email} token={this.props.token}/>
                </div>
            </div>
        </div>
    }
}