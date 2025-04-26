const fs = require('fs-extra');
const path = require('path');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

/**
 * Create an art file from SVG contents
 * @param {string} contents - SVG content
 * @param {string} artFileOutputName - Output file name
 * @param {number[]} imageSizePixels - Width and height in pixels
 * @param {string} outputDirectory - Output directory
 * @returns {Promise<string>} - Path to output file
 */
async function outputSvgArtFile(contents, artFileOutputName, imageSizePixels, outputDirectory) {
  if (contents === null) {
    throw new Error("Contents cannot be null");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(contents, 'image/svg+xml');
  const root = doc.documentElement;

  const scale_factor = 96 / 300;

  root.setAttribute('width', `${imageSizePixels[0] * scale_factor}`);
  root.setAttribute('height', `${imageSizePixels[1] * scale_factor}`);

  root.setAttribute('viewBox', `0 0 ${imageSizePixels[0] * scale_factor} ${imageSizePixels[1] * scale_factor}`);

  const wrapper = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
  wrapper.setAttribute('transform', `scale(${scale_factor})`);

  while (root.firstChild) {
    wrapper.appendChild(root.firstChild);
  }
  root.appendChild(wrapper);

  const serializer = new XMLSerializer();
  contents = serializer.serializeToString(doc);

  const artFileOutputFileName = `${artFileOutputName}.svg`;
  const artFileOutputFilepath = path.join(outputDirectory, artFileOutputFileName);
  await fs.writeFile(artFileOutputFilepath, contents, 'utf8');
  return artFileOutputFilepath;
}


module.exports = {
  outputSvgArtFile
}; 