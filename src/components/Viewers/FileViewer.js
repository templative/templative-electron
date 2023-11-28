import React from "react";
import "./FileViewer.css"

export default class FileViewer extends React.Component {   
    render() {
        var tokens = this.props.fileContents.split("\n")
        var i = 0
        var elements = tokens.map((element)=>{
            i++
            return <p key={i} className="contents">{element}</p> 
    })
        return <div className="row">
            <div className="col">
                <div className="row">
                    <h1>{this.props.filename}</h1>
                </div>
                {elements}
            </div>
        </div> 
    }
}