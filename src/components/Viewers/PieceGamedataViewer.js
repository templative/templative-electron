import React from "react";
import "./GamedataViewer.css"

export default class PieceGamedataViewer extends React.Component {   
    render() {
        var headers = Object.keys(this.props.fileContents[0]).map((header)=> {
            return <th scope="col">{header}</th>
        })
        var rows = this.props.fileContents.map((element) => {
            var columns = Object.keys(element).map((key) => {
                return <td>{element[key]}</td>
            });
            return <tr>
                {columns}
            </tr>
        })
        
        return <div className="row tableContainer">
            <div className="col">
                <div className="row">
                    <h1>{this.props.filename}</h1>
                </div>
                <table className="table table-striped table-dark">
                    <thead>
                        <tr>
                            {headers}
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