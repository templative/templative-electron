import React from 'react';

const RenderingWorkspaceContext = React.createContext();

const PostRenderOptions = [
    "Images",
    "Rules",
    "Export to Tabletop Simulator Save",
    "Export Tabletop Playground Package",
    "Create Print & Play",
    "Upload to TheGameCrafter",
    // "Assemble Animation Library"
]

class RenderingWorkspaceProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        // Render
        selectedOutputDirectory: undefined, 
        selectedComponentFilter: undefined,
        exportOptionIndex: 0,
        // Create
        componentName: "", //"citizens",
        selectedComponentType: undefined, //"CustomPrintedMeeple",
        isToggledToComponents: true,
        componentAIDescription: "",//"This is a deck of people. There are thirty cards in it. Each card has a shirt color, hat color, and pants color. The background of the card is three rectangles stacked on top of each other, with the top taking the hat color, the middle taking the shirt color, and the bottom taking the pants color. The name of each card is a random first name.",
        componentTypeSearch: "",
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

  setComponentName = (name) => {
    this.setState({ componentName: name });
  };

  setSelectedComponentType = (type) => {
    this.setState({ selectedComponentType: type });
  };

  setIsToggledToComponents = (isToggled) => {
    this.setState({ isToggledToComponents: isToggled });
  };

  setComponentAIDescription = (description) => {
    this.setState({ componentAIDescription: description });
  };

  setComponentTypeSearch = (search) => {
    this.setState({ componentTypeSearch: search });
  };

  toggleCustomOrStock = () => {
    this.setState(prevState => ({
      isToggledToComponents: !prevState.isToggledToComponents,
      selectedComponentType: undefined
    }));
  };

  selectComponent = (type) => {
    this.setState(prevState => ({
      selectedComponentType: prevState.selectedComponentType === type ? undefined : type
    }));
  };

  render() {
    return (
      <RenderingWorkspaceContext.Provider
        value={{
          ...this.state,
          setSelectedOutputFolder: this.setSelectedOutputFolder,
          setSelectedComponentFilter: this.setSelectedComponentFilter,
          setExportOptionIndex: this.setExportOptionIndex,
          setComponentName: this.setComponentName,
          setSelectedComponentType: this.setSelectedComponentType,
          setIsToggledToComponents: this.setIsToggledToComponents,
          setComponentAIDescription: this.setComponentAIDescription,
          setComponentTypeSearch: this.setComponentTypeSearch,
          toggleCustomOrStock: this.toggleCustomOrStock,
          selectComponent: this.selectComponent,
        }}
      >
        {this.props.children}
      </RenderingWorkspaceContext.Provider>
    );
  }
}

export { RenderingWorkspaceContext, RenderingWorkspaceProvider, PostRenderOptions };