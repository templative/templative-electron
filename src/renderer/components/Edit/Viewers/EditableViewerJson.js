import TemplativeAccessTools from "../../TemplativeAccessTools";
import EditableViewerRaw from "./EditableViewerRaw";

export default class EditableViewerJson extends EditableViewerRaw {
    constructor(props) {
        super(props);
    }
    
    saveAsync = async (filepath, content) => {
        if (filepath === undefined || content === undefined) {
            return
        }
        try {
            // Validate that content can be stringified
            const newFileContents = JSON.stringify(content, null, 4)
            // Validate that the stringified content can be parsed back
            JSON.parse(newFileContents)
            await this.props.saveFileAsyncCallback(filepath, newFileContents)
            this.setState({ lastKnownFileContents: content })
        } catch (error) {
            console.error("Failed to save JSON:", error)
            // You might want to show an error to the user here
        }
    }

    loadFileContent = async (filepath) => {
        return await TemplativeAccessTools.loadFileContentsAsJson(filepath)
    }
}