import React from "react";
import "./FeedbackPanel.css"

export default class FeedbackPanel extends React.Component {   
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
      }
    post = () => {
        console.log(this.fileInput.current.files)
        console.log(this.state)
    }
    state = {
        feedbackType: "Bug",
        postBody:"",
        title:""
    }
    updateTitle = (event) => {
        var value = event.target.value
        this.setState({title: value})
    }
    updatePostBody = (event) => {
        var value = event.target.value
        this.setState({postBody: value})
    }
    updateFeedbackType = (event) => {
        var value = event.target.value
        this.setState({feedbackType: value})
    }
    render() {
        return <div className='mainBody row'>
            <div className="col-2 past-feedback-col">
                
            </div>
            <div className="col">
                <div className="feedback">
                    <p>Thanks for providing feedback!</p>
                    <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                        <span className="input-group-text">Title</span>
                        <input 
                            type="text" 
                            className="form-control" 
                            onChange={this.updateTitle} 
                            placeholder="Fix the / Add a / Remove every"
                            value={this.state.title}
                        />
                        <select 
                            value={this.state.feedbackType} 
                            onChange={this.updateFeedbackType} 
                            className="form-select scope-select no-left-border"
                        >
                            <option value="feedback">Feedback</option>
                            <option value="bug">Bug</option>
                            <option value="feature">Feature Request</option>
                        </select>
                    </div>
                    <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                        <textarea 
                            className="form-control"
                            onChange={this.updatePostBody} 
                            rows="3"
                            placeholder="I think that..."
                        >
                            {this.state.textArea}
                        </textarea>
                    </div>
                    <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                        <input className="form-control" type="file" id="formFile" data-bs-theme="dark" ref={this.fileInput} multiple="multiple" />
                    </div>
                    <div className="input-group input-group-sm mb-3"  data-bs-theme="dark">
                        <button 
                            type="submit"
                            disabled={false}
                            onClick={this.post}
                            className="btn btn-outline-secondary btn-lg btn-block"                            
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}