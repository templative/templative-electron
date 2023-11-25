import React from "react";
// import axios from 'axios';
import { channels } from '../shared/constants';
const { ipcRenderer } = window.require('electron');

export default class TemplativeButton extends React.Component {   
    
    componentDidMount() {
        this.renderer = ipcRenderer.on(channels.GET_DATA, (event, arg) => {
            console.log(arg)
        });
    } 
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GET_DATA);
    }
    runTempaltive() {
        ipcRenderer.send(channels.GET_DATA, { product: 'notebook' });
        // axios.get(`http://localhost:3001/example`)
        // .then(res => {
        //     console.log(res)
        // })
    }
    render() {
        return <button className="btn btn-light" onClick={()=>this.runTempaltive()}>Produce Caps and Hammers</button>        
    }
}