import React from "react";
import "./AdPanel.css"
const fsOld = require('fs');

export default class LabelledImage extends React.Component {   
    state = {
        key: 0
    }
    componentDidMount = () => {
        this.#closeWatcher()
        this.watcher = fsOld.watch(this.props.path, {}, async () => {
            console.log("AH!")
            this.setState({key: this.state.key + 1})
        });
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.path === this.props.path) {
            return
        }
        this.setState({key: this.state.key + 1})
    }

    #closeWatcher = () => {
        if (this.watcher === undefined) {
            return
        }
        this.watcher.close();
        this.watcher = undefined;
    }

    componentWillUnmount = () => {
        this.#closeWatcher()
    }
    render() {
        return <div className="gamecrafter-ad-wrapper">
            <div className="gamecrafter-ad-label"><p className="ad-label">{this.props.name}</p></div>
            <img className="gamecrafter-ad-image" src={`file://${this.props.path}?${Date.now()}`} alt={this.props.name} key={this.state.key}/>
        </div> 
    }
}