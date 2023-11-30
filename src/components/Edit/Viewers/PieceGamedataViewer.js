import React from "react";
import "./GamedataViewer.css"

export default class PieceGamedataViewer extends React.Component {   
    render() {
        var headers = Object.keys(this.props.fileContents[0]).map((header)=> {
            return <th className="col">{header}</th>
        })
        var rows = this.props.fileContents.map((element) => {
            var columns = Object.keys(element).map((key) => {
                return <td className="col">{element[key]}</td>
            });
            return <tr className="d-flex">
                {columns}
            </tr>
        })
        
        return <div className="row tableContainer">
            <div className="col">
                <div className="row">
                    <h1>{this.props.filename}</h1>
                </div>
                <div className="row">
            <div className="col">
                <div className="table-responsive">
                    <table className="table table-striped table-dark">
                        <thead>
                            <tr className="d-flex">
                                {headers}
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                        </div> 
                    </div> 
                </div> 
            </div> 
        </div> 
    }
}