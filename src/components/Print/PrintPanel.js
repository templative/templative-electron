import React from "react";
import RenderOutputOptions from "../OutputDirectories/RenderOutputOptions";
import "./PrintPanel.css"
import CreatePrintoutButton from "./CreatePrintoutButton";
import { trackEvent } from "@aptabase/electron/renderer";
import TemplativeAccessTools from "../TemplativeAccessTools";
import TemplativeClient from "../../TemplativeClient"
import TemplativePurchaseButton from "../TemplativePurchaseButton";
const path = require('path');
const axios = require("axios");
const fs = require("fs");

export default class PrintPanel extends React.Component {   
    state={
        selectedDirectory: undefined,
        size: "Letter",
        isBackIncluded: false,
        areMarginsDrawn: false,
        rerenderIframeKey: 0,
        isCreatingPrintout: false,
        doesUserOwnTemplative: false,
    }
    checkIfOwnsTemplative = async () => {
        var ownsTemplative = await TemplativeClient.doesUserOwnTemplative(this.props.email, this.props.token)
        this.setState({ doesUserOwnTemplative: ownsTemplative})
    }
    componentDidMount = async () => {
        await this.checkIfOwnsTemplative()
        trackEvent("view_printPanel")
    }
    selectDirectoryAsync = async (directory) => {
        var gameCompose = await TemplativeAccessTools.readFileContentsFromTemplativeProjectAsJsonAsync(this.props.templativeRootDirectoryPath, "game-compose.json")
        var outputDirectory = path.join(this.props.templativeRootDirectoryPath, gameCompose["outputDirectory"], directory)
        this.setState({selectedDirectory:outputDirectory})
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
            outputDirectorypath: `${this.state.selectedDirectory}`,
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
        var printoutFilepath = `${this.state.selectedDirectory}/printout.pdf`
        var showPDF = this.state.selectedDirectory !== undefined && fs.existsSync(printoutFilepath)
        return <div className='mainBody '>
            <div className="row">
                <div className="col-4 print-control-col-left">
                    <RenderOutputOptions selectedDirectory={this.state.selectedDirectory} templativeRootDirectoryPath={this.props.templativeRootDirectoryPath} selectDirectoryAsyncCallback={this.selectDirectoryAsync}/>
                    {this.state.doesUserOwnTemplative ? 
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
                        :
                        <TemplativePurchaseButton action="Creating Printouts"/>
                    }
                    
                </div>
                <div className="col print-control-col-right">
                    {(showPDF) ? 
                        <iframe key={this.state.rerenderIframeKey} title="printout.pdf" src={`file://${printoutFilepath}`} width="100%" height="100%" />
                    :
                    <p className="no-pdf">{`No pdf to display.`}</p>
                    }
                </div>
            </div>
        </div>
    }
}