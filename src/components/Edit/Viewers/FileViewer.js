import React from "react";
import "./FileViewer.css"
import TemplativeAccessTools from "../../TemplativeAccessTools";

export default class FileViewer extends React.Component {
    state = {
        fileContents: undefined
    }
    componentDidMount = async () => {
        this.setState({
            fileContents: await TemplativeAccessTools.loadFileContentsAsJson(this.props.filepath)
        })
    }
    componentDidUpdate = async (prevProps) => { 
        if (this.props.filepath === prevProps.filepath) {
            return;
        }
        this.setState({
            fileContents: await TemplativeAccessTools.loadFileContentsAsJson(this.props.filepath)
        })
    }
    render() {
        var tokens = []
        if (this.state.fileContents !== undefined) {
            this.props.fileContents.split("\n")
            var i = 0
            var elements = tokens.map((element)=>{
                i++
                return <p key={i} className="contents">{element}</p> 
        })
        }
        return <div className="row">
            <div className="col">
                {elements}
            </div>
        </div> 
    }
}