class ProduceProperties:
    def __init__(self, inputDirectoryPath: str, outputDirectoryPath: str, isPublish: bool, isSimple: bool, targetLanguage: str):
        self.inputDirectoryPath = inputDirectoryPath
        self.outputDirectoryPath = outputDirectoryPath
        self.isPublish = isPublish
        self.isSimple = isSimple
        self.targetLanguage = targetLanguage
        
class PreviewProperties:
    def __init__(self, inputDirectoryPath: str, outputDirectoryPath: str, pieceName:str, targetLanguage: str):
        self.inputDirectoryPath = inputDirectoryPath
        self.outputDirectoryPath = outputDirectoryPath
        self.pieceName = pieceName
        self.isPublish = False
        self.isSimple = False
        self.targetLanguage = targetLanguage