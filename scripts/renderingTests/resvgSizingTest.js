// Keep an svg string with 240x360 width/height and viewBox 0 0 240 360
// Use resvg to render it at 300dpi at 750x1125px
// Check the width of the rendered image

const { convertSvgContentToPngUsingResvg } = require("../../src/main/templative/lib/produce/customComponents/svgscissors/fileConversion/svgToRasterConverter");

const svgString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   id="svg2227"
   version="1.1"
   viewBox="0 0 240 360"
   height="360"
   width="240"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs2221" />
  <rect
     style="fill:#553333;fill-opacity:1;stroke:none;stroke-width:202.938;stroke-dashoffset:318.954;paint-order:markers stroke fill"
     id="rect3"
     width="164.66789"
     height="326.56827"
     x="53.60685"
     y="21.588186" />
</svg>

`;

async function testSvgSizing() {
    const outputFilepath = await convertSvgContentToPngUsingResvg(svgString, [750, 1125], "./scripts/renderingTests/.test.png");
    // Check the width of the rendered image
    const fs = require('fs');
    const { PNG } = require('pngjs');

    const png = PNG.sync.read(fs.readFileSync(outputFilepath));
    console.log(`Width: ${png.width}`);
    console.log(`Height: ${png.height}`);

    // Check the width of the rendered image
    const width = png.width;
    console.log(`Width: ${width}`);
}

testSvgSizing().catch(err => {
    console.error("Error in testSvgSizing:", err);
});