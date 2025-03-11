import {getColorValueHex, allColorVariations} from "../src/shared/stockComponentColors.js";
import { Image } from 'image-js';
import fs from 'fs';
import path from 'path';
import {exportSvgToImage} from "../src/main/templative/lib/produce/customComponents/svgscissors/svgRenderer.js"
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const widthsMillimeters = [3, 4, 5, 6, 8, 10, 15, 16, 18, 20, 22, 24, 25, 30];
const heightsMillimeters = [3, 4, 5, 6, 8, 10, 14, 15, 16, 17, 18, 20, 22, 25, 30];
import chalk from "chalk";

const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION || 'us-west-2';
const s3Bucket = "templative-simulator-images";

if (!awsAccessKey || !awsSecretKey) {
    console.error(`Missing AWS credentials or bucket name ${awsAccessKey==null} ${awsSecretKey==null} ${s3Bucket==null}`);
    process.exit(1)
}

const s3Client = new S3Client({
    region: awsRegion,
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
    }
});

async function uploadToS3(filePath) {
    try {
        if (!fileExists(filePath)) {
            console.warn(`File not found: ${filePath}`);
            return null
        }
        const key = `${path.basename(filePath)}`;
            
        const command = new PutObjectCommand({
            Bucket: s3Bucket,
            Key: key,
            Body: fs.createReadStream(filePath)
        });
        
        await s3Client.send(command);
        
        const url = `https://${s3Bucket}.s3.amazonaws.com/${key}`;
        console.log(`Uploaded S3: ${url}`);
        return url
    } catch (err) {
        console.error(`Error uploading to S3: ${err.message}`);
        return null;
    }
}

async function fileExists(filepath) {
    try {
        await fs.promises.access(filepath);
        return true;
    } catch (error) {
        return false;
    }
}
async function createCylinderObject(widthMillimeters, heightMillimeters, ) {
    const millimetersToInches = 0.0393701
    const widthInches = widthMillimeters * millimetersToInches;
    const heightInches = heightMillimeters * millimetersToInches;
    const radius = widthInches / 2;
                    
    const vertices = [];
    const normals = [];
    const faces = [];
    
    // Add vertices and faces for a cylinder
    const segments = 32; // Number of segments to approximate the circle
    
    // Add first dummy vertex (OBJ indexing starts at 1)
    vertices.push(`v 0 0 0`);
    normals.push(`vn 0 0 0`);
    
    // Add center vertices for top and bottom circles
    vertices.push(`v 0 ${heightInches} 0`); // Top center (index 2)
    normals.push(`vn 0 1 0`);  // Top normal points up
    
    vertices.push(`v 0 0 0`);         // Bottom center (index 3)
    normals.push(`vn 0 -1 0`); // Bottom normal points down
    
    // Create vertices for top circle
    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        vertices.push(`v ${x.toFixed(6)} ${heightInches} ${z.toFixed(6)}`);
        normals.push(`vn 0 1 0`); // Top circle normals point up
    }
    
    // Create vertices for bottom circle
    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        vertices.push(`v ${x.toFixed(6)} 0 ${z.toFixed(6)}`);
        normals.push(`vn 0 -1 0`); // Bottom circle normals point down
    }
    
    // Create side normals
    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;
        const nx = Math.cos(angle);
        const nz = Math.sin(angle);
        normals.push(`vn ${nx.toFixed(6)} 0 ${nz.toFixed(6)}`); // Side normals point outward
    }
    
    // Create faces for top circle (index 2 is top center)
    for (let i = 0; i < segments; i++) {
        const current = 4 + i; // First circle vertex starts at index 4
        const next = 4 + ((i + 1) % segments);
        faces.push(`f 2//2 ${next}//${next} ${current}//${current}`);
    }
    
    // Create faces for bottom circle (index 3 is bottom center)
    for (let i = 0; i < segments; i++) {
        const current = 4 + segments + i; // First bottom circle vertex
        const next = 4 + segments + ((i + 1) % segments);
        faces.push(`f 3//3 ${current}//${current} ${next}//${next}`);
    }
    
    // Create faces for side of cylinder
    const sideNormalStartIndex = 4 + segments * 2;
    for (let i = 0; i < segments; i++) {
        const topCurrent = 4 + i;
        const topNext = 4 + ((i + 1) % segments);
        const bottomCurrent = 4 + segments + i;
        const bottomNext = 4 + segments + ((i + 1) % segments);
        const normalIndex = sideNormalStartIndex + i;
        
        // Create two triangular faces for each quad section
        faces.push(`f ${topCurrent}//${normalIndex} ${bottomNext}//${normalIndex} ${bottomCurrent}//${normalIndex}`);
        faces.push(`f ${topCurrent}//${normalIndex} ${topNext}//${normalIndex} ${bottomNext}//${normalIndex}`);
    }
    
    const objectContent = [
        `# Cylinder ${widthInches}in x ${heightInches}in`,
        `# Generated by Templative`,
        ...vertices,
        ...normals,
        ...faces
    ].join('\n');
    
    return objectContent
}
async function createAndUploadCylinders() {
    const objDirectory = './scripts/objects/objs';
    const textureSvgsDirectory = './scripts/objects/textures';
    const texturePngsDirectory = './scripts/objects/textures';
    const normalMapSvgsDirectory = './scripts/objects';
    const normalMapPngsDirectory = './scripts/objects';
    const objectUrlsPath = './scripts/objects/urls.json';
    
    // Create directories if they don't exist
    if (!fs.existsSync(objDirectory)) {
        fs.mkdirSync(objDirectory, { recursive: true });
    }
    if (!fs.existsSync(textureSvgsDirectory)) {
        fs.mkdirSync(textureSvgsDirectory, { recursive: true });
    }
    if (!fs.existsSync(texturePngsDirectory)) {
        fs.mkdirSync(texturePngsDirectory, { recursive: true });
    }
    if (!fs.existsSync(normalMapSvgsDirectory)) {
        fs.mkdirSync(normalMapSvgsDirectory, { recursive: true });
    }
    if (!fs.existsSync(normalMapPngsDirectory)) {
        fs.mkdirSync(normalMapPngsDirectory, { recursive: true });
    }
    
    // Create result structure with the requested format
    let urls = {
        colors: {},
        meshes: {}
    };
    
    // Load existing URLs if available
    try {
        const existingUrlsData = await fs.promises.readFile(objectUrlsPath, 'utf8');
        urls = JSON.parse(existingUrlsData);
        console.log('Loaded existing object URLs');
    } catch (error) {
        console.log('No existing object URLs found, creating new file');
    }
    
    // First create the single normal map (only need one)
    const normalMapContent = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#8080FF" />
    </svg>`;
    
    const normalMapFilename = path.join(normalMapSvgsDirectory, `cylinder_normal.svg`);
    const normalMapPngFilename = path.join(normalMapPngsDirectory, `cylinder_normal.png`);
    
    if (!await fileExists(normalMapFilename)) {
        await fs.promises.writeFile(normalMapFilename, normalMapContent);
        console.log(`Created normal map SVG file: ${normalMapFilename}`);
        
        // Convert SVG normal map to PNG
        await exportSvgToImage(normalMapFilename, 15, `cylinder_normal`, normalMapPngsDirectory);
        console.log(`Created normal map PNG file: ${normalMapPngFilename}`);
    }
    
    // Upload normal map if not already uploaded
    if (!urls.normalMap) {
        const normalMapUrl = await uploadToS3(normalMapPngFilename);
        if (normalMapUrl) {
            urls.normalMap = normalMapUrl;
            // Save immediately after uploading normal map
            await fs.promises.writeFile(objectUrlsPath, JSON.stringify(urls, null, 2));
        }
    }
    
    // Create and upload texture for each color
    for (const color of Object.keys(allColorVariations)) {
        const colorHex = getColorValueHex(allColorVariations[color]);
        const colorKey = colorHex.replace("#", "");
        
        // Skip if this color texture is already uploaded
        if (urls.colors && urls.colors[colorKey]) {
            console.log(`Color texture for ${colorKey} already uploaded: ${urls.colors[colorKey]}`);
            continue;
        }
        
        const textureContent = `
        <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${colorHex}" />
        </svg>`;
        
        const textureFilename = path.join(textureSvgsDirectory, `texture_${colorKey}.svg`);
        const texturePngFilename = path.join(texturePngsDirectory, `texture_${colorKey}.png`);
        
        if (!await fileExists(texturePngFilename)) {
            await fs.promises.writeFile(textureFilename, textureContent);
            console.log(`Created texture SVG file: ${textureFilename}`);
            
            // Convert SVG texture to PNG
            await exportSvgToImage(textureFilename, 15, `texture_${colorKey}`, texturePngsDirectory);
            console.log(`Created texture PNG file: ${texturePngFilename}`);
            
            // Delete the SVG file after exporting to PNG
            try {
                await fs.promises.unlink(textureFilename);
                console.log(`Deleted texture SVG file: ${textureFilename}`);
            } catch (error) {
                console.error(`Error deleting texture SVG file: ${error.message}`);
            }
        }
        
        // Upload texture to S3
        const textureUrl = await uploadToS3(texturePngFilename);
        if (textureUrl) {
            if (!urls.colors) urls.colors = {};
            urls.colors[colorKey] = textureUrl;
            // Save after each color upload
            await fs.promises.writeFile(objectUrlsPath, JSON.stringify(urls, null, 2));
        }
    }
    
    const tasks = [];
    
    for (const width of widthsMillimeters) {
        for (const height of heightsMillimeters) {
            const key = `${width}x${height}mm`;
            if (urls.meshes && urls.meshes[key]) {
                console.log(`Mesh for ${key} already uploaded: ${urls.meshes[key]}`);
                continue;
            }
            tasks.push({
                width,
                height,
                key
            });
        }
    }
    
    // Process tasks in batches of 20 per minute
    const batchSize = 60;
    const batchDelay = 60000; // 60 seconds = 1 minute
    
    for (let i = 0; i < tasks.length; i += batchSize) {
        const batch = tasks.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(tasks.length/batchSize)} (${batch.length} items)`);
        
        await Promise.all(batch.map(async (task) => {
            try {
                const { width, height, key } = task;
                
                if (urls.meshes && urls.meshes[key]) {
                    return;
                }
                
                const objKey = `${width}mm_${height}mm`;
                const objectFilename = path.join(objDirectory, `${objKey}.obj`);
                console.log(`Creating 3D cylinder object: ${width}mm diameter x ${height}mm height`);
                
                const objectContent = await createCylinderObject(width, height);
                await fs.promises.writeFile(objectFilename, objectContent);
                console.log(`Created obj file: ${objectFilename}`);
                
                // Upload OBJ to S3
                const objUrl = await uploadToS3(objectFilename);
                if (objUrl) {
                    if (!urls.meshes) urls.meshes = {};
                    urls.meshes[key] = objUrl;
                }
            } catch (error) {
                console.error(`Error processing ${task.key}: ${error.message}`);
            }
        }));
        
        // Save after each batch
        await fs.promises.writeFile(objectUrlsPath, JSON.stringify(urls, null, 2));
        
        // Wait before processing the next batch, but only if there are more batches
        if (i + batchSize < tasks.length) {
            console.log(`Waiting ${batchDelay/1000} seconds before processing next batch...`);
            await new Promise(resolve => setTimeout(resolve, batchDelay));
        }
    }
    
    console.log('All cylinder processing completed successfully.');
    return urls;
}

const urls = await createAndUploadCylinders();
console.log(urls);
