import React from "react";
import RenderOutputOptions from "../OutputDirectories/RenderOutputOptions";
import "./PrintPanel.css"
import CreatePrintoutButton from "./CreatePrintoutButton";
import axios from "axios"
const fs = require("fs")

export default class PrintPanel extends React.Component {   
    state={
        selectedDirectory: undefined,
        size: "Letter",
        isBackIncluded: false,
        areMarginsDrawn: false,
        rerenderIframeKey: 0,
        isCreatingPrintout: false
    }
    selectDirectoryAsync = async (directory) => {
        this.setState({selectedDirectory:directory})
    }
    setSize = (size) => {
        this.setState({size: size})
    }
    toggleAreMarginsDrawn = () => {
        this.setState({areMarginsDrawn: !this.state.areMarginsDrawn})
    }
    toggleIsBackIncluded = () => {
        this.setState({isBackIncluded: !this.state.isBackIncluded})
    }
    createPrintout = async () => {
        var data = { 
            outputDirectorypath: `${this.props.templativeRootDirectoryPath}/output/${this.state.selectedDirectory}`,
            isBackIncluded: this.state.isBackIncluded,
            size: this.state.size,
            areMarginsIncluded: this.state.areMarginsDrawn
        }
        try {
            this.setState({isCreatingPrintout: true})
            await axios.post(`http://localhost:8080/printout`, data)
            this.setState({isCreatingPrintout: false, rerenderIframeKey: this.state.rerenderIframeKey +1})
        }
        catch(e) {
            console.log(e)
        }
    }
    render() {
        var printoutFilepath = `${this.props.templativeRootDirectoryPath}/output/${this.state.selectedDirectory}/printout.pdf`
        var showPDF = this.state.selectedDirectory !== undefined && fs.existsSync(printoutFilepath)
        return <div className='mainBody row '>
            <div className="col-4 print-control-col-left">
                <RenderOutputOptions selectedDirectory={this.state.selectedDirectory} templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} selectDirectoryAsyncCallback={this.selectDirectoryAsync}/>
                <CreatePrintoutButton 
                    isCreatingPrintout={this.state.isCreatingPrintout}
                    hasOutputDirectoryValue={this.state.selectedDirectory !== undefined}
                    areMarginsIncluded={this.state.areMarginsIncluded}
                    size={this.state.size}
                    isBackIncluded={this.state.isBackIncluded}
                    createPrintoutCallback={this.createPrintout}
                    toggleAreMarginsDrawnCallback={this.toggleAreMarginsDrawn}
                    toggleIsBackIncludedCallback={this.toggleIsBackIncluded}
                    setSizeCallback={this.setSize}
                />
            </div>
            <div className="col print-control-col-right">
                {(showPDF) ? 
                    <iframe key={this.state.rerenderIframeKey} title="printout.pdf" src={`file://${printoutFilepath}`} width="100%" height="100%" />
                :
                <p>{`No pdf to display.`}</p>
                }
            </div>
        </div>
    }
}