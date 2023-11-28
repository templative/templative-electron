import React from "react";
import "./GamedataViewer.css"

export default class KeyValueGamedataViewer extends React.Component {   
    render() {
        var rows = Object.keys(this.props.fileContents).map((key) => {
            return <tr>
                <th>{key}</th>
                <td>{this.props.fileContents[key]}</td>
          </tr>
        });
        
        return <div className="row tableContainer">
            <div className="col">
                <div className="row">
                    <h1>{this.props.filename}</h1>
                </div>
                <table className="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        </div>
    }
}