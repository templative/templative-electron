import React from "react";
import TemplativeButton from './TemplativeButton';
import TemplativeProjectRenderer from "./TemplativeProjectRenderer"
import "./MainBody.css"

export default class MainBody extends React.Component {   
    render() {
    
        return <div className='row mainBody'>
            <div className='col'>
                <TemplativeProjectRenderer/>
            </div>
            <div className='col'>
            
            </div>
            <div className='col'>
                <TemplativeButton/>
            </div>
      </div>
    }
}