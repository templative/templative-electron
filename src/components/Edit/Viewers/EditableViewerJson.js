import TemplativeAccessTools from "../../TemplativeAccessTools";
import EditableViewerRaw from "./EditableViewerRaw";

export default class EditableViewerJson extends EditableViewerRaw {   
    saveAsync = async (filepath, content) => {
        if (filepath === undefined || content === undefined) {
            console.log("Skipping saving due to not being loaded yet.")
            return
        }
        var newFileContents = JSON.stringify(content, null, 4)
        // console.log(`Saving json ${filepath}`)//\n${newFileContents}`)
        await this.props.saveFileAsyncCallback(filepath, newFileContents)
    }

    loadFileContent = async (filepath) => {
        return await TemplativeAccessTools.loadFileContentsAsJson(filepath)
    }
}