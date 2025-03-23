import React from "react";
import "./PrintPanel.css"
import CreatePrintoutButton from "./CreatePrintoutButton";
// import { trackEvent } from "@aptabase/electron/renderer";
import TemplativePurchaseButton from "../../../TemplativePurchaseButton";
import { channels } from "../../../../../../shared/constants";
const { ipcRenderer } = require('electron');
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
        // trackEvent("view_printPanel")
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
        // trackEvent("print")
        var data = { 
            outputDirectorypath: this.props.outputFolderPath,
            isBackIncluded: this.state.isBackIncluded,
            size: this.state.size,
            areMarginsIncluded: this.state.areMarginsDrawn
        }
        try {
            this.setState({isCreatingPrintout: true})
            const result = await ipcRenderer.invoke(channels.TO_SERVER_CREATE_PRINTOUT, data);
            this.setState({isCreatingPrintout: false, rerenderIframeKey: this.state.rerenderIframeKey +1})
        }
        catch(e) {
            console.error(e)
        }
    }
    render() {
        var printoutFilepath = `${this.props.outputFolderPath}/printout.pdf`
        var showPDF = this.props.outputFolderPath !== undefined && fs.existsSync(printoutFilepath)
        return <div className='print-control'>
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
            {(showPDF) && 
                <iframe key={this.state.rerenderIframeKey} title="printout.pdf" src={`file://${printoutFilepath}`} className="printout-pdf-iframe" />
            }
            
        </div>
    }
}