const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');
const { Builder } = require('xml2js');

async function processFiles() {
  const dirPath = "C:/Users/User/Documents/git/templative-frontend/python/../create/componentTemplates";
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const xml = fs.readFileSync(filePath, 'utf-8');
    
    const result = await parseStringPromise(xml);
    const root = result.svg;
    
    const width = root.$.width || "";
    const height = root.$.height || "";
    const viewBox = (root.$.viewBox || "").split(" ");
    console.log(width, height, viewBox);
    
    if (width === viewBox[2] && height === viewBox[3]) {
      continue;
    }
    
    root.$.viewBox = `0 0 ${width} ${height}`;
    
    const builder = new Builder();
    const updatedXml = await builder.buildObject(result);
    
    fs.writeFileSync(filePath, updatedXml);
  }
}

processFiles();