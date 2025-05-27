import React from 'react';
const { channels } = require("../../../shared/constants");
const RenderingWorkspaceContext = React.createContext();
const { ipcRenderer } = require('electron');

const PostRenderOptions = [
    "Images",
    "Rules",
    "Export to Tabletop Simulator",
    // "Export to TTP Package",
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

        selectedProjectTab: "Game Content",
        selectedFontTab: "Fonts",

        // Create
        componentName: "", //"citizens",
        selectedComponentType: undefined, //"CustomPrintedMeeple",
        selectedMajorCategory: undefined,
        selectedBaseComponent: undefined,
        selectedSize: undefined,
        selectedColor: undefined,
        isToggledToComponents: true,
        componentAIDescription: "",//"This is a deck of people. There are thirty cards in it. Each card has a shirt color, hat color, and pants color. The background of the card is three rectangles stacked on top of each other, with the top taking the hat color, the middle taking the shirt color, and the bottom taking the pants color. The name of each card is a random first name.",
        componentTypeSearch: "",
        fileExplorerColumnWidth: 20,
        renderControlsColumnWidth: 20,
        isPreviewVisible: false,
        lastViewedContentType: "Piece Content", // Default to Piece Content
        unit: "px",
        isCompositionsExtended: true,
        isStockCompositionsExtended: true,
        
        // Print settings
        printSize: "Letter",
        isPrintBackIncluded: false,
        arePrintBordersDrawn: false,

        // Preview
        isGeneratingPreview: false,

        // Markdown Editor State
        markdownEditorScrollPosition: 0,
        markdownPreviewScrollPosition: 0,
        markdownPreviewOpen: false,
    };
  }

  async componentDidMount() {
    try {
      const settings = await ipcRenderer.invoke(channels.TO_SERVER_GET_SETTINGS);
      if (settings) {
        this.setState({
          printSize: settings.printSize || "Letter",
          unit: settings.unit || "px"
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  setIsGeneratingPreview = (isGenerating) => {
    this.setState({ isGeneratingPreview: isGenerating });
  }

  setMarkdownEditorScrollPosition = (position) => {
    this.setState({ markdownEditorScrollPosition: position });
  }

  setMarkdownPreviewScrollPosition = (position) => {
    this.setState({ markdownPreviewScrollPosition: position });
  }

  setMarkdownPreviewOpen = (isOpen) => {
    this.setState({ markdownPreviewOpen: isOpen });
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

  setPrintSize = async (size) => {
    this.setState({ printSize: size });
    try {
      await ipcRenderer.invoke(channels.TO_SERVER_UPDATE_SETTING, 'printSize', size);
    } catch (error) {
      console.error('Error updating printSize setting:', error);
    }
  };

  toggleIsPrintBackIncluded = () => {
    this.setState(prevState => ({
      isPrintBackIncluded: !prevState.isPrintBackIncluded
    }));
  };

  toggleArePrintBordersDrawn = () => {
    this.setState(prevState => ({
      arePrintBordersDrawn: !prevState.arePrintBordersDrawn
    }));
  };

  toggleCustomOrStock = () => {
    this.setState(prevState => ({
      isToggledToComponents: !prevState.isToggledToComponents,
      selectedComponentType: undefined,
      selectedMajorCategory: undefined,
      selectedBaseComponent: undefined,
      selectedSize: undefined,
      selectedColor: undefined,
      componentName: "" // Reset component name when toggling between custom and stock
    }));
  };

  selectComponent = (category, baseComponent, size, color, type) => {
    // console.log("selectComponent", category, baseComponent, size, color, type);
    
    this.setState(prevState => ({
      selectedComponentType: prevState.selectedComponentType === type ? undefined : type,
      selectedMajorCategory: category,
      selectedBaseComponent: baseComponent,
      selectedSize: size,
      selectedColor: color
    }));
  };

  setFileExplorerColumnWidth = (width) => {
    this.setState({ fileExplorerColumnWidth: width });
  };
  setRenderControlsColumnWidth = (width) => {
    this.setState({ renderControlsColumnWidth: width });
  };

  togglePreviewVisibility = () => {
    this.setState(prevState => ({ isPreviewVisible: !prevState.isPreviewVisible }));
  };
  showPreview = () => {
    this.setState({ isPreviewVisible: true });
  }

  setLastViewedContentType = (contentType) => {
    this.setState({ lastViewedContentType: contentType });
  };

  selectContentTypeForComposition = (availableContentTypes) => {
    const { lastViewedContentType } = this.state;
    
    // If the last viewed content type is available, use it
    if (availableContentTypes.includes(lastViewedContentType)) {
      return lastViewedContentType;
    }
    
    // Otherwise, try to use Piece Content
    if (availableContentTypes.includes("Piece Content")) {
      return "Piece Content";
    }
    
    // If Piece Content is not available, try Component Content
    if (availableContentTypes.includes("Component Content")) {
      return "Component Content";
    }
    
    // If neither is available, use the first available content type
    return availableContentTypes.length > 0 ? availableContentTypes[0] : null;
  };

  setUnit = async (unit) => {
    this.setState({ unit: unit });
    try {
      await ipcRenderer.invoke(channels.TO_SERVER_UPDATE_SETTING, 'unit', unit);
    } catch (error) {
      console.error('Error updating unit setting:', error);
    }
  };

  setSelectedProjectTab = (tab) => {
    this.setState({ selectedProjectTab: tab });
  };

  setSelectedFontTab = (tab) => {
    this.setState({ selectedFontTab: tab });
  };

  toggleCompositionsExtended = async () => {
    this.setState(prevState => ({
      isCompositionsExtended: !prevState.isCompositionsExtended
    }));
  };

  toggleStockCompositionsExtended = async () => {
    this.setState(prevState => ({
      isStockCompositionsExtended: !prevState.isStockCompositionsExtended
    }));
  };

  render() {
    return (
      <RenderingWorkspaceContext.Provider
        value={{
          ...this.state,
          setIsGeneratingPreview: this.setIsGeneratingPreview,
          setMarkdownEditorScrollPosition: this.setMarkdownEditorScrollPosition,
          setMarkdownPreviewScrollPosition: this.setMarkdownPreviewScrollPosition,
          setMarkdownPreviewOpen: this.setMarkdownPreviewOpen,
          setSelectedOutputFolder: this.setSelectedOutputFolder,
          setSelectedComponentFilter: this.setSelectedComponentFilter,
          setExportOptionIndex: this.setExportOptionIndex,
          setComponentName: this.setComponentName,
          setSelectedComponentType: this.setSelectedComponentType,
          setIsToggledToComponents: this.setIsToggledToComponents,
          setComponentAIDescription: this.setComponentAIDescription,
          setComponentTypeSearch: this.setComponentTypeSearch,
          setPrintSize: this.setPrintSize,
          toggleIsPrintBackIncluded: this.toggleIsPrintBackIncluded,
          toggleArePrintBordersDrawn: this.toggleArePrintBordersDrawn,
          toggleCustomOrStock: this.toggleCustomOrStock,
          selectComponent: this.selectComponent,
          fileExplorerColumnWidth: this.state.fileExplorerColumnWidth,
          isPreviewVisible: this.state.isPreviewVisible,
          setFileExplorerColumnWidth: this.setFileExplorerColumnWidth,
          setRenderControlsColumnWidth: this.setRenderControlsColumnWidth,
          togglePreviewVisibility: this.togglePreviewVisibility,
          showPreview: this.showPreview,
          lastViewedContentType: this.state.lastViewedContentType,
          setLastViewedContentType: this.setLastViewedContentType,
          selectContentTypeForComposition: this.selectContentTypeForComposition,
          setUnit: this.setUnit,
          setSelectedProjectTab: this.setSelectedProjectTab,
          setSelectedFontTab: this.setSelectedFontTab,
          toggleCompositionsExtended: this.toggleCompositionsExtended,
          toggleStockCompositionsExtended: this.toggleStockCompositionsExtended,
        }}
      >
        {this.props.children}
      </RenderingWorkspaceContext.Provider>
    );
  }
}

export { RenderingWorkspaceContext, RenderingWorkspaceProvider, PostRenderOptions };
