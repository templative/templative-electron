class ProduceProperties:
    def __init__(self, inputDirectoryPath: str, outputDirectoryPath: str, isPublish: bool, isSimple: bool, targetLanguage: str):
        self.inputDirectoryPath = inputDirectoryPath
        self.outputDirectoryPath = outputDirectoryPath
        self.isPublish = isPublish
        self.isSimple = isSimple
        self.targetLanguage = targetLanguage