const fs = require('fs-extra');
const path = require('path');

async function outputSvgArtFile(contents, artFileOutputName, outputDirectory) {
  if (contents === null) {
    throw new Error("Contents cannot be null");
  } 

  const artFileOutputFileName = `${artFileOutputName}.svg`;
  const artFileOutputFilepath = path.join(outputDirectory, artFileOutputFileName);
  await fs.writeFile(artFileOutputFilepath, contents, 'utf8');
  return artFileOutputFilepath;
}

async function scaleSvg(document, imageSizePixels) {
  if (!document) {
    throw new Error("Document cannot be null");
  }
  
  const root = document.documentElement;
  const scale_factor = 96 / 300;

  root.setAttribute('width', `${imageSizePixels[0] * scale_factor}`);
  root.setAttribute('height', `${imageSizePixels[1] * scale_factor}`);

  root.setAttribute('viewBox', `0 0 ${imageSizePixels[0] * scale_factor} ${imageSizePixels[1] * scale_factor}`);

  const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  wrapper.setAttribute('transform', `scale(${scale_factor})`);

  // Move all children to wrapper, EXCEPT defs which should stay at root level
  const childrenToMove = Array.from(root.childNodes);
  for (const child of childrenToMove) {
    // Skip defs elements - they should remain at the root level unscaled
    if (child.nodeType === 1 && child.tagName === 'defs') {
      continue;
    }
    wrapper.appendChild(child);
  }
  
  root.appendChild(wrapper);
}

module.exports = {
  outputSvgArtFile,
  scaleSvg
}; 