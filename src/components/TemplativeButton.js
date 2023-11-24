import React from "react";

export default class TemplativeButton extends React.Component {    
    runTempaltive() {
        console.log("hello")
    }
    render() {
        return <button onClick={()=>this.runTempaltive()}>Hello?</button>        
    }
}