import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// import {publishers, conventions} from "../mapInfo"
import dayjs from 'dayjs';
const {  shell } = require('electron');

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import conventionMarkerImage from "./marker.png"

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default class Map extends React.Component {      
    goToLink = (link) => {
        shell.openExternal(link)
    }
      
    transformText = (input) => {
        if (input === undefined) {
            return null;
        }
        input = input.toString()
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const combinedRegex = new RegExp(`${emailRegex.source}|${urlRegex.source}`, 'g');
        const parts = input.split(combinedRegex);
        const matches = input.match(combinedRegex) || [];

        let matchIndex = 0;
        return parts.map((part, index) => {
            if (part === '' && matches[matchIndex]) {
                const match = matches[matchIndex++];
                if (emailRegex.test(match)) {
                    return (
                        <span className="publisher-link" key={index} onClick={() => this.goToLink(`mailto:${part}`)}>
                            {part}
                        </span>
                );
            } else if (urlRegex.test(match)) {
            return (
                <span className="publisher-link" key={index} onClick={() => this.goToLink(part)}>
                    {part}
                </span>
                );
            }}
            return part
        });  
    }
    
    render() {
        const currentDate = dayjs();
        // var mentionedConventions = new Set();
        // for (let index = 0; index < publishers.length; index++) {
        //     const publisher = publishers[index];
        //     if (publisher.conventionsRegularlyAttended === undefined){
        //         continue
        //     }
        //     if (typeof(publisher.conventionsRegularlyAttended) !== typeof([])) {
        //         console.log(publisher["name"])
        //         continue
        //     }
        //     if ()
        //     for (let c = 0; c < publisher.mentionedConventions.length; c++) {
        //         const convention = publisher.mentionedConventions[c];
        //         mentionedConventions.add(convention)
        //     }
        // }
        // console.log(mentionedConventions)
        
        return <React.Fragment></React.Fragment>
            // <MapContainer center={[37.8, -96]} zoom={4} style={{ height: "100%", width: "100%" }}>
            //     <TileLayer
            //         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            //         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            //     />
            //     {publishers.map(publisher => {
            //         return <Marker className="publisher-marker" key={publisher.name} position={[publisher.coordinates[0], publisher.coordinates[1]]}>
            //             <Popup className="publisher-popup" >
            //                     {publisher.name}<br/>
            //                     <br/>
            //                     {publisher.submissionBrief}<br/>
            //                     <br/>
            //                     Located in {publisher.location}<br/>
            //                     Often attends {publisher.conventionsRegularlyAttended}<br/>
            //                 
            //             </Popup>
            //         </Marker>
            //     })}
            //     {conventions
            //         .filter(convention => dayjs(convention.date).isAfter(currentDate)) // Filter out past conventions
            //         .map(convention => {
            //         const daysUntilConvention = dayjs(convention.date).diff(currentDate, 'day'); // Calculate days until the convention

            //         // Determine size based on proximity to the convention date
            //         var sizeFactor = 0.25;
            //         if (daysUntilConvention < 30) {
            //             sizeFactor = 1
            //         }
            //         else if (daysUntilConvention < 30*6) {
            //             sizeFactor = 0.5
            //         }

            //         const iconSize = [24*sizeFactor, 40*sizeFactor]; // Maintain aspect ratio
                
            //         const customMarkerIcon = new L.Icon({
            //             iconUrl: conventionMarkerImage,
            //         //   shadowUrl: markerShadow,
            //             iconSize: iconSize,
            //             iconAnchor: [iconSize[0] / 2, iconSize[1]], // Adjust anchor based on size
            //             popupAnchor: [0, -iconSize[1]] // Adjust popup position based on size
            //         });
                
            //         return <Marker icon={customMarkerIcon} className="convention-marker" key={convention.name} position={[convention.coordinates[0], convention.coordinates[1]]}>
            //             <Popup className="convention-popup">
            //                 {this.props.doesUserOwnTemplative ? 
            //                     <React.Fragment>
            //                         <span onClick={()=>this.goToLink(convention['url'])} className="convention-link">
            //                             {convention.name}
            //                         </span>
            //                         <br/>
            //                         <span className="important-convention-info">{convention.date}</span> in <span className="important-convention-info">{convention.location} ({daysUntilConvention} days)</span>
            //                         <br/><br/>
            //                         {convention.description}
            //                     </React.Fragment>
            //                     :
            //                     <p>Buy Templative to Unlock Convention Data</p>
            //                 }
            //             </Popup>
            //         </Marker>
            //     })}
            // </MapContainer>
    }
}