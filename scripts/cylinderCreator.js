import {getColorValueHex, allColorVariations} from "../src/shared/stockComponentColors.js";
import { Image } from 'image-js';
import fs from 'fs';
import path from 'path';
import {exportSvgToImage} from "../src/main/templative/lib/produce/customComponents/svgscissors/inkscapeProcessor.js"
import { uploadToS3 } from "../src/main/templative/lib/distribute/simulator/imageProcessing/imageUploader.js"
const heightsMillimeters = [10, 14, 15, 16, 17, 18, 20, 22, 25, 30];
const widthsMillimeters = [3, 4, 5, 6, 8, 10, 15];
import chalk from "chalk";

async function createCylinders() {
    // Create ./colorSvgs directory if it doesn't exist
    const outputDirSvg = './scripts/colorSvgs';
    const outputDirPng = './scripts/colorPngs';
    if (!fs.existsSync(outputDirSvg)) {
        fs.mkdirSync(outputDirSvg, { recursive: true });
    }
    else {
        // Delete all files in the directory
        fs.readdirSync(outputDirSvg).forEach(file => {
            fs.unlinkSync(path.join(outputDirSvg, file));
        });
    }
    if (!fs.existsSync(outputDirPng)) {
        fs.mkdirSync(outputDirPng, { recursive: true });
    }
    else {
        // Delete all files in the directory
        fs.readdirSync(outputDirPng).forEach(file => {
            fs.unlinkSync(path.join(outputDirPng, file));
        });
    }
    const scale = 10
    // Loop through all colors and widths
    for (const color in allColorVariations) {
        for (const width of widthsMillimeters) {
            // Create SVG string directly for a 15x15mm canvas with a centered circle
            const svgSize = 15 * scale;
            const centerPoint = svgSize / 2;
            const colorHex = getColorValueHex(allColorVariations[color]);
            
            const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}mm" height="${svgSize}mm" viewBox="0 0 ${svgSize} ${svgSize}">
    <circle cx="${centerPoint}" cy="${centerPoint}" r="${width/2*scale}" fill="${colorHex}" stroke="#000000" stroke-width="0" />
</svg>`;
            
            // Save the svg to ./colorSvgs/${width}mm_${color}.svg
            const filename = path.join(outputDirSvg, `${width}mm_${colorHex}.svg`);
            fs.writeFileSync(filename, svgContent);
            await exportSvgToImage(filename, 15, `${width}mm_${colorHex.replace("#", "")}`, outputDirPng);
            console.log(`Created ${filename}`);
        }
    }
    
    console.log('All cylinder SVGs generated successfully.');
}

async function loadImage(filepath) {
    try {
        await fs.promises.access(filepath);
    } catch (error) {
        console.log(chalk.red(`!!! Image file not found: ${filepath}`));
        return null;
    }
    
    try {
        return await Image.load(filepath);
    } catch (error) {
        console.log(chalk.red(`!!! Error loading image ${filepath}: ${error}`));
        return null;
    }
}

async function uploadCylinders() {
    let urls = {};
    const outputDirPng = './scripts/colorPngs';
    const colorUrlsPath = './scripts/colorUrls.json';
    
    // Load existing URLs if available
    try {
        const existingUrlsData = await fs.promises.readFile(colorUrlsPath, 'utf8');
        urls = JSON.parse(existingUrlsData);
        console.log('Loaded existing color URLs');
    } catch (error) {
        console.log('No existing color URLs found, creating new file');
    }
    
    const files = await fs.promises.readdir(outputDirPng);
    
    // Create array of upload tasks, but only for files not already in urls
    const uploadTasks = files.map(async (file) => {
        const key = file.split(".")[0];
        
        // Skip if already uploaded
        if (urls[key]) {
            // console.log(`Skipping ${key} - already uploaded`);
            return;
        }
        
        const filePath = path.join(outputDirPng, file);
        const image = await loadImage(filePath);
        if (!image) {
            return;
        }
        
        const imageUrl = await uploadToS3(image);
        console.log(`Uploaded ${imageUrl}`);
        urls[key] = imageUrl;
    });
    
    // Wait for all uploads to complete
    await Promise.all(uploadTasks);
    
    await fs.promises.writeFile(colorUrlsPath, JSON.stringify(urls, null, 2));
    return urls;
}

const urls = await uploadCylinders();
console.log(urls);