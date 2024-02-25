import React from "react";
import "./FeedbackPanel.css"
import FeedbackPostChoice from "./FeedbackPostChoice";

export default class FeedbackPostChoices extends React.Component {     
    render() {
        const postButtons = this.props.feedbackPosts.map((post) => 
            <FeedbackPostChoice key={post.title} post={post} selectedFeedbackPost={this.props.selectedFeedbackPost} selectPostCallback={this.props.selectPostCallback}/>
        )
        return <div className='feedback-post-choices'>
            <h4>Your Feedback</h4>
            <div className="your-feedback">
                {postButtons}
            </div>
        </div>
    }
}