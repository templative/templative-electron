from os import walk
import xml.etree.ElementTree as ET

f = []
path = "C:/Users/User/Documents/git/templative-frontend/python/templative/lib/create/componentTemplates"
for (dirpath, dirnames, filenames) in walk(path):
    
    for filename in filenames:
        filepath = 'C:/Users/User/Documents/git/templative-frontend/python/templative/lib/create/componentTemplates/%s' % filename
        tree = ET.parse(filepath)
        root = tree.getroot()
        
        width = root.get("width", "")
        height = root.get("height", "")
        viewbox = root.get("viewBox", "").split(" ")
        print(width, height, viewbox)
        if width == viewbox[2] and height == viewbox[3]:
            continue
        root.set("viewBox", "0 0 %s %s" %(width, height))
        with open(filepath, "wb") as svgFile:
            svgFile.write(ET.tostring(root))
    
    break