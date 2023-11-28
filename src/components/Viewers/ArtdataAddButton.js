import React from "react";

export default class ArtdataAddButton extends React.Component {   
    
    render() {
        return <div className="row" key="➕">
            <div className="input-group mb-3"  data-bs-theme="dark">
                <button className="btn btn-outline-secondary" type="button" id="button-addon1">➕</button>
            </div>
        </div> 
    }
}