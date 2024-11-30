import React from "react";
import "./FeedbackPanel.css"

export default class FeedbackViewer extends React.Component {       
    render() {
        return <div className="feedback-viewer">
            <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                <span className="input-group-text">Title</span>
                <input 
                    type="text" 
                    className="form-control"  
                    readOnly
                    value={this.props.post.title}
                />
            </div>
            <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                <textarea 
                    className="form-control"
                    rows="3"
                    readOnly
                    value={this.props.post.body}
                />
            </div>            
        </div>
    }
}