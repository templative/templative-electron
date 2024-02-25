import React from "react";
import "./FeedbackPanel.css"

export default class FeedbackPostChoice extends React.Component {    
    render() {
        const isSelected = this.props.selectedFeedbackPost !== undefined && this.props.post.title === this.props.selectedFeedbackPost.title
        
        return <div 
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseOut}
            className={`post-option ${isSelected && "selected-post-option"}`}
            onClick={!isSelected ? ()=>this.props.selectPostCallback(this.props.post) : undefined}
        >
            <span>{this.props.post.title}</span>
        </div>
    }
}