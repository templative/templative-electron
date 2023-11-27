import React from "react";
import TemplativeButton from './TemplativeButton';
import TemplativeProjectRenderer from "./FileExplorer/TemplativeProjectRenderer"
import "./MainBody.css"

export default class MainBody extends React.Component {   
    render() {
    
        return <div className='mainBody row '>
            <div className='col left-column'>
                <TemplativeProjectRenderer/>
            </div>
            <div className='col'>
            
            </div>
            <div className='col'>
                {/* <TemplativeButton/> */}
            </div>
      </div>
    }
}