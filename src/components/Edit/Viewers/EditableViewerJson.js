import TemplativeAccessTools from "../../TemplativeAccessTools";
import EditableViewerRaw from "./EditableViewerRaw";

export default class EditableViewerJson extends EditableViewerRaw {   
    saveAsync = async (filepath, content) => {
        if (!this.state.hasLoaded || content === undefined) {
            console.log("Skipping saving due to not being loaded yet.")
            return
        }
        var newFileContents = JSON.stringify(content, null, 4)
        // console.log(`Saving json ${filepath}`)//\n${newFileContents}`)
        await this.props.saveFileAsyncCallback(filepath, newFileContents)
    }

    loadFileContent = async () => {
        const filepath = this.getFilePath(this.props)
        // console.log(`Loading json ${filepath}`)
        const content = await TemplativeAccessTools.loadFileContentsAsJson(filepath)
        // console.log(`Loaded json ${filepath}\n${content}`)
        return content
    }
}