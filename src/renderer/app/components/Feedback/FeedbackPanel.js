import React from "react";
import "./FeedbackPanel.css"
import FeedbackForm from "./FeedbackForm";
import FeedbackViewer from "./FeedbackViewer";
import FeedbackPostChoices from "./FeedbackPostChoices";
import { trackEvent } from "@aptabase/electron/renderer";

const axios = require("axios");
const {machineIdSync} = require('node-machine-id');

const FeedbackMode = {
    "VIEWING": "VIEWING",
    "POSTING": "POSTING"
}

export default class FeedbackPanel extends React.Component {   
    // constructor(props) {
    //     super(props);
    //     this.fileInput = React.createRef();
    // }  
    state = {
        feedbackPosts: [],
        selectedFeedbackPost: undefined,
        feedbackMode: FeedbackMode.POSTING,
        body:"",
        title:"",
    }
    componentDidMount = async () => {
        trackEvent("view_feedbackPanel")

        try {
            var response = await axios.get(`https://api.templative.net//feedback?userGuid=${FeedbackPanel.getMachineId()}`)
            this.setState({feedbackPosts: response.data.feedback})
        }
        catch(error) {
            console.error(error)
        }
        
    }
    static getMachineId = () => {
        return encodeURIComponent(machineIdSync())
    }
    uploadFeedbackAsync = async () => {
        // const files = this.fileInput.current.files

        trackEvent("feedback_create")
        axios.post("https://api.templative.net//feedback", {
            title: this.state.title,
            body: this.state.body,
            userGuid: FeedbackPanel.getMachineId()
        })
        try {
            var response = await axios.get(`https://api.templative.net//feedback?userGuid=${FeedbackPanel.getMachineId()}`)
            // this.fileInput.current.value = []
            this.setState({
                feedbackPosts: response.data.feedback, 
                title: "",
                body: "",
            })
        }
        catch(error) {
            console.error(error)
        }
        
    }
    updatePostTitle = (event) => {
        var value = event.target.value
        this.setState({title: value})
    }
    updatePostBody = (event) => {
        var value = event.target.value
        this.setState({body: value})
    }
    createFeedbackPost = () => {
        this.setState({
            feedbackMode: FeedbackMode.POSTING,
            selectedFeedbackPost: undefined
        })
    }
    selectFeedbackPost = (feedbackPost) => {
        this.setState({
            feedbackMode: FeedbackMode.VIEWING,
            selectedFeedbackPost: feedbackPost
        })
    }
    render() {
        return <div className='mainBody'>
            <div className="row feedbackRow">
                <div className="col-2 past-feedback-col">
                    <button type="button" 
                        className="btn btn-outline-secondary create-feedback-post-button" 
                        onClick={this.createFeedbackPost}
                        disabled={this.state.feedbackMode===FeedbackMode.POSTING}
                    >
                        Create Feedback Post
                    </button>
                    <FeedbackPostChoices 
                        selectPostCallback={this.selectFeedbackPost}
                        feedbackPosts={this.state.feedbackPosts} 
                        selectedFeedbackPost={this.state.selectedFeedbackPost}
                    />
                </div>
                <div className="col">
                    { this.state.feedbackMode === FeedbackMode.POSTING && 
                        <FeedbackForm 
                            title={this.state.title}
                            body={this.state.body}
                            // fileInput={this.fileInput}
                            updatePostTitleCallback={this.updatePostTitle}
                            updatePostBodyCallback={this.updatePostBody}
                            uploadFeedbackAsyncCallback={this.uploadFeedbackAsync}
                        />
                    }
                    { this.state.feedbackMode === FeedbackMode.VIEWING && 
                        <FeedbackViewer post={this.state.selectedFeedbackPost}/>
                    }
                </div>
            </div>
        </div>
    }
}