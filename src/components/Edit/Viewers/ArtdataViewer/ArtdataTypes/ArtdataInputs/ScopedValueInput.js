import React from "react";
import ScopedValueInputWithOptions from "./ScopedValueInputWithOptions";
import ScopedValueInputBasic from "./ScopedValueInputBasic";

export default class ScopedValueInput extends React.Component {
    render() {
        if (this.props.availableDataSources) {
            return <ScopedValueInputWithOptions {...this.props} />;
        }
        return <ScopedValueInputBasic {...this.props} />;
    }
}