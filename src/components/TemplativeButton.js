import React from "react";
import axios from 'axios';

export default class TemplativeButton extends React.Component {   
    runTempaltive() {
        axios.get(`http://localhost:3001/example`)
        .then(res => {
            console.log(res)
        })
    }
    render() {
        return <button className="btn btn-light" onClick={()=>this.runTempaltive()}>Produce Caps and Hammers</button>        
    }
}