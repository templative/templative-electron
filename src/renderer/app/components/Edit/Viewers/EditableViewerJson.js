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
        const newFileContents = JSON.stringify(content, null, 4)
        await this.props.saveFileAsyncCallback(filepath, newFileContents)
        this.setState({ lastKnownFileContents: content })
    }

    loadFileContent = async (filepath) => {
        return await TemplativeAccessTools.loadFileContentsAsJson(filepath)
    }
}