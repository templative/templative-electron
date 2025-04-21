const webfont = require('webfont').default;
const path = require('path');
const fs = require('fs').promises;
const opentype = require('opentype.js');

async function createIconFont(name, inputDir, outputDir) {
    try {
        const svgGlobPattern = path.join(inputDir, '*.svg').replace(/\\/g, '/');
        const result = await webfont({
            files: svgGlobPattern,
            fontName: name,
            formats: ['woff', 'woff2', 'ttf', 'svg'],
            template: 'css',
        });

        // Write the generated font files to the output directory
        try {
            await fs.mkdir(outputDir, { recursive: true });
        }
        catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
        await fs.writeFile(path.join(outputDir, `${name}.ttf`), result.ttf);
        await fs.writeFile(path.join(outputDir, `${name}.svg`), result.svg);

        console.log('Icon font created successfully!');
    } catch (error) {
        console.error('Error creating icon font:', error);
    }
}

function unicodeStringToNumber(unicodeString) {
    // Remove the '&#x' prefix and ';' suffix
    const hexString = unicodeString.replace('&#x', '').replace(';', '');
    // Convert the hexadecimal string to a number
    return parseInt(hexString, 16);
}

/*
When I want to use an icon font in inkscape, i add a `<tspan font-family="gameicons">&#xEA01;</tspan>`
I have a .tff and .svg file for the font, its called gameicons. The .svg file specifies:
```
<glyph glyph-name="3d-glasses" unicode="&#xEA01;" .../>
```
When Inkscape loads the tspan it shows the icon, and when I save the file the tspan becomes ``.

Instead of writing the tspan, I want to skip directly to the `` using this function.
 */
async function getPUACharFromUnicode(fontTffPath, unicodeString) {
    if (!fontTffPath || !unicodeString) {
        throw new Error('fontPath and unicode are required');
    }
    if (!fontTffPath.endsWith('.ttf')) {
        throw new Error('Font path must be a .ttf file');
    }
    var font;
    try {
        font = await opentype.load(fontTffPath);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`Font ${fontTffPath} not found`);
        }
        throw error;
    }
    try {
        // Convert the unicode value to a character
        const unicodeNumber = unicodeStringToNumber(unicodeString);
        const char = String.fromCodePoint(unicodeNumber);

        // Get the glyph from the font
        const glyph = font.charToGlyph(char);

        // Return the Unicode value Inkscape renders
        const codePoint = glyph.unicode;

        if (codePoint === undefined) {
            throw new Error(`No unicode for glyph: ${glyph.name}`);
        }
        return String.fromCodePoint(codePoint);
    }
    catch (error) {
        console.error('Error loading font:', error);
        return "";
    }
}

module.exports = {
    createIconFont,
    getPUACharFromUnicode
};
