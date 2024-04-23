var path = require('path');

// path.isAbsolute(myPath)

export class LocalPath {   
    relativeFilepath = undefined
    basepath = undefined
    constructor(basepath, filepath) {
        this.basepath = basepath
        this.filepath = filepath
    }
    toAbsolutePath = () => new AbsolutePath(path.normalize(path.join(this.basepath, this.filepath)))
}

export class AbsolutePath {   
    filepath = undefined
    constructor(filepath) {
        this.filepath = filepath
    }
    toLocalPath = (basepath) => {
        basepath = path.normalize(basepath)
        const relativeFilepath = path.normalize(path.relative(basepath, this.filepath))
        return new LocalPath(basepath, relativeFilepath)
    }
}
