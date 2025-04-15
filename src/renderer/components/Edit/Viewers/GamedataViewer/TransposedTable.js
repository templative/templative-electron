import React from "react";

export default class TransposedTable extends React.Component {
    render() {
        if (!this.props.content || this.props.content.length === 0) {
            return null;
        }

        const headers = Object.keys(this.props.content[0]);

        return (
            <div className="table-responsive-horizontal">
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th>Field</th>
                            {this.props.content.map((_, index) => (
                                <th key={index}>
                                    Piece {index + 1}
                                    <div className="btn-group ms-2">
                                        <button 
                                            onClick={() => this.props.duplicatePieceByIndex(index)}
                                            className="btn btn-outline-secondary btn-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => this.props.deletePiece(index)}
                                            className="btn btn-outline-secondary btn-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {headers.map(header => (
                            <tr key={header}>
                                <th>{header}</th>
                                {this.props.content.map((piece, index) => (
                                    <td key={index}>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm table-input-dark"
                                            value={piece[header]}
                                            onChange={(e) => this.props.updateValue(index, header, e.target.value)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
} 