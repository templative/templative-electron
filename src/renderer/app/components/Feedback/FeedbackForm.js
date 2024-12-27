import React from "react";
import "./FeedbackPanel.css"

export default class FeedbackForm extends React.Component {   
    render() {
        var canPost = this.props.title.trim() !== "" && this.props.body.trim() !== ""
        return <div className="feedback-form">
            <p>Thank you for providing feedback!</p>
            <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                <span className="input-group-text soft-label">Title</span>
                <input 
                    type="text" 
                    className="form-control no-left-border" 
                    onChange={this.props.updatePostTitleCallback} 
                    placeholder="Fix the / Add a / Remove every"
                    value={this.props.title}
                />
            </div>
            <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                <textarea 
                    className="form-control"
                    onChange={this.props.updatePostBodyCallback} 
                    rows="3"
                    placeholder="I think that..."
                    value={this.props.body}
                />
            </div>

            {/* <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                <input className="form-control" type="file" id="formFile" data-bs-theme="dark" ref={this.props.fileInput} multiple="multiple" />
            </div> */}
            
            <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                <button 
                    type="submit"
                    disabled={!canPost}
                    onClick={async () => await this.props.uploadFeedbackAsyncCallback()}
                    className="btn btn-outline-secondary btn-lg btn-block post-button"                            
                >
                    Post
                </button>
            </div>
            
        </div>
    }
}