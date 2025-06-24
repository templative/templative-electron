import React from "react";
import "./PrintPanel.css"
import CreatePrintoutButton from "./CreatePrintoutButton";
import { trackEvent } from "@aptabase/electron/renderer";
import TemplativePurchaseButton from "../../../TemplativePurchaseButton";
import { channels } from "../../../../../shared/constants";
import { RenderingWorkspaceContext } from "../../RenderingWorkspaceProvider";
const { ipcRenderer } = require('electron');
const fs = require("fs");

export default class PrintPanel extends React.Component {   
    static contextType = RenderingWorkspaceContext;
    
    state={
        rerenderIframeKey: 0,
        isCreatingPrintout: false,
    }
    
    componentDidMount = async () => {
        trackEvent("view_printPanel")
    }
    
    createPrintout = async () => {
        trackEvent("print")
        var data = { 
            outputDirectorypath: this.props.outputFolderPath,
            isBackIncluded: this.context.isPrintBackIncluded,
            size: this.context.printSize,
            areBordersDrawn: this.context.arePrintBordersDrawn
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
            {(showPDF) && 
                <iframe key={this.state.rerenderIframeKey} title="printout.pdf" src={`file://${printoutFilepath}`} className="printout-pdf-iframe" />
            }
            <CreatePrintoutButton 
                isCreatingPrintout={this.state.isCreatingPrintout}
                hasOutputDirectoryValue={this.props.outputFolderPath !== undefined}
                areBordersDrawn={this.context.arePrintBordersDrawn}
                size={this.context.printSize}
                isBackIncluded={this.context.isPrintBackIncluded}
                createPrintoutCallback={this.createPrintout}
                toggleAreBordersDrawnCallback={this.context.toggleArePrintBordersDrawn}
                toggleIsBackIncludedCallback={this.context.toggleIsPrintBackIncluded}
                setSizeCallback={this.context.setPrintSize}
            />
            
            
        </div>
    }
}