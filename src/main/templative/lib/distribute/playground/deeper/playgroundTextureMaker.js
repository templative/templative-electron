const path = require('path');
const { Image } = require('image-js');
const { COMPONENT_INFO } = require('../../../componentInfo.js');

async function createCompositeImageInTextures(componentName, componentTypeInfo, frontInstructions, textureDirectoryFilepath) {
  let totalCount = 0;
  for (const instruction of frontInstructions) {
    totalCount += instruction.quantity;
  }

  if (totalCount === 0) {
    return [0, 0, 0];
  }

  const pixelDimensions = componentTypeInfo.DimensionsPixels;
  let columns = Math.floor(Math.sqrt(totalCount));
  let rows = columns;
  while (columns * rows < totalCount) {
    rows += 1;
  }

  const tiledImage = new Image({
    width: pixelDimensions[0] * columns,
    height: pixelDimensions[1] * rows,
    colorModel: 'rgb'
  });

  let xIndex = 0;
  let yIndex = 0;
  for (const instruction of frontInstructions) {
    const image = await Image.load(instruction.filepath);
    for (let i = 0; i < instruction.quantity; i++) {
      tiledImage.drawImage(image, xIndex * pixelDimensions[0], yIndex * pixelDimensions[1]);
      xIndex += 1;
      if (xIndex === columns) {
        xIndex = 0;
        yIndex += 1;
      }
    }
  }

  const frontImageName = `${componentName}-front.jpeg`;
  const frontImageFilepath = path.join(textureDirectoryFilepath, frontImageName);
  await tiledImage.save(frontImageFilepath, { format: 'jpeg' });
  
  return [totalCount, columns, rows];
}

module.exports = {
  createCompositeImageInTextures
};
