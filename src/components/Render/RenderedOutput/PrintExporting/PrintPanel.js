import React from "react";
import "./PrintPanel.css"
import CreatePrintoutButton from "./CreatePrintoutButton";
import { trackEvent } from "@aptabase/electron/renderer";
import TemplativePurchaseButton from "../../../TemplativePurchaseButton";

const axios = require("axios");
const fs = require("fs");

export default class PrintPanel extends React.Component {   
    state={
        size: "Letter",
        isBackIncluded: false,
        areMarginsDrawn: false,
        rerenderIframeKey: 0,
        isCreatingPrintout: false,
    }
    
    componentDidMount = async () => {
        trackEvent("view_printPanel")
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
        trackEvent("print")
        var data = { 
            outputDirectorypath: this.props.outputFolderPath,
            isBackIncluded: this.state.isBackIncluded,
            size: this.state.size,
            areMarginsIncluded: this.state.areMarginsDrawn
        }
        // console.log(data)
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
        var printoutFilepath = `${this.props.outputFolderPath}/printout.pdf`
        var showPDF = this.props.outputFolderPath !== undefined && fs.existsSync(printoutFilepath)
        return <div className='print-control'>
            {this.props.doesUserOwnTemplative ? 
                <CreatePrintoutButton 
                    isCreatingPrintout={this.state.isCreatingPrintout}
                    hasOutputDirectoryValue={this.props.outputFolderPath !== undefined}
                    areMarginsIncluded={this.state.areMarginsIncluded}
                    size={this.state.size}
                    isBackIncluded={this.state.isBackIncluded}
                    createPrintoutCallback={this.createPrintout}
                    toggleAreMarginsDrawnCallback={this.toggleAreMarginsDrawn}
                    toggleIsBackIncludedCallback={this.toggleIsBackIncluded}
                    setSizeCallback={this.setSize}
                />
                :
                <TemplativePurchaseButton action="Creating Printouts"/>
            }
            {(showPDF) && 
                <iframe key={this.state.rerenderIframeKey} title="printout.pdf" src={`file://${printoutFilepath}`} className="printout-pdf-iframe" />
            }
            
        </div>
    }
}