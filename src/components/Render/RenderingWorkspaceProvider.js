import React from 'react';

const RenderingWorkspaceContext = React.createContext();

const PostRenderOptions = [
    "Images",
    "Rules",
    "Export to Tabletop Simulator Save",
    "Export Tabletop Playground Package",
    "Create Print & Play",
    "Upload to TheGameCrafter",
    "Assemble Animation Library"
]

class RenderingWorkspaceProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedOutputDirectory: undefined,
        selectedComponentFilter: undefined,
        exportOptionIndex: 0,
    };
  }

  setSelectedOutputFolder = (folder) => {
    this.setState({ selectedOutputDirectory: folder });
  };

  setSelectedComponentFilter = (filter) => {
    this.setState({ selectedComponentFilter: filter });
  };

  setExportOptionIndex = (index) => {
    this.setState({ exportOptionIndex: index });
  };

  render() {
    return (
      <RenderingWorkspaceContext.Provider
        value={{
          ...this.state,
          setSelectedOutputFolder: this.setSelectedOutputFolder,
          setSelectedComponentFilter: this.setSelectedComponentFilter,
          setExportOptionIndex: this.setExportOptionIndex,
        }}
      >
        {this.props.children}
      </RenderingWorkspaceContext.Provider>
    );
  }
}

export { RenderingWorkspaceContext, RenderingWorkspaceProvider, PostRenderOptions };
