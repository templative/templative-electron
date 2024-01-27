export class TabbedFile {
    filepath
    filetype
    canClose
    constructor(filetype, filepath, canClose=true) {
        this.filepath = filepath
        this.filetype = filetype
        this.canClose = canClose 
    }
}