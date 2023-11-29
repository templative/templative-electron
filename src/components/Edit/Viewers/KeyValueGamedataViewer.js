import React from "react";
import "./GamedataViewer.css"

export default class KeyValueGamedataViewer extends React.Component {   
    render() {
        var rows = Object.keys(this.props.fileContents).map((key) => {
            return <tr className="d-flex" key={key}>
                <th>{key}</th>
                <td className="col">{this.props.fileContents[key]}</td>
          </tr>
        });
        
        return <div className="row tableContainer">
            <div className="col">
                <div className="row">
                    <h1>{this.props.filename}</h1>
                </div>
                <div class="table-responsive">
                <table className="table table-striped table-dark">
                    <thead>
                        <tr className="d-flex">
                            <th className="col">Key</th>
                            <th className="col">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    }
}