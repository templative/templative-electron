import React from "react";

export default class RulesViewer extends React.Component { 
    render = () => {
        return <React.Fragment>
            <iframe title="rules.pdf" src={`file://${this.props.outputFolderPath}/rules.pdf`} className="rules-pdf-iframe" />
        </React.Fragment>
    }
}