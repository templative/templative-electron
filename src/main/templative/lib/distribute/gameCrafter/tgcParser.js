const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const httpOperations = require('./util/httpOperations.js');
const { STOCK_COMPONENT_INFO } = require('../../../../../shared/stockComponentInfo.js');
const { COMPONENT_INFO } = require('../../../../../shared/componentInfo.js');

const blankSvgFileContents = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg version="1.1" id="template" x="0px" y="0px" width="%s" height="%s" viewBox="0 0 %s %s" enable-background="new 0 0 270 414" xml:space="preserve" sodipodi:docname="blank.svg" inkscape:version="1.2.2 (b0a8486, 2022-12-01)" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"> <defs id="defs728" /> <sodipodi:namedview id="namedview726" pagecolor="#ffffff" bordercolor="#999999" borderopacity="1" showgrid="false" /></svg>';


const INCH_TO_MILLIMETERS = 25.4;

const bannedCustomComponentTagNames = new Set(["and", "bi", "top", "side", "color", "custom"]);

function convertVarNameIntoTagSet(varname) {
    const varnameTags = varname.match(/[A-Z][^A-Z]*/g);
    const varNameTagSet = new Set();
    for (const varnameTag of varnameTags) {
        if (varnameTag.length === 1) {
            continue;
        }
        let lowercaseVarname = varnameTag.toLowerCase();
        if (bannedCustomComponentTagNames.has(lowercaseVarname)) {
            continue;
        }
        if (lowercaseVarname === "d6" || lowercaseVarname === "d4" || lowercaseVarname === "d8" || lowercaseVarname === "d20") {
            varNameTagSet.add(lowercaseVarname);
            continue;
        }
        lowercaseVarname = lowercaseVarname.replace(/[0-9]/g, '');
        varNameTagSet.add(lowercaseVarname);
    }
    return varNameTagSet;
}

function parseArtdataTypes(allArtdataTypes, sides) {
    const ardataTypes = new Set();
    const isDie = sides[0].label.startsWith("Side");
    if (isDie) {
        allArtdataTypes.add("DieFace");
        return ardataTypes;
    }

    for (const side of sides) {
        let ardataType = side.label;
        const isFront = ardataType === "Face" || ardataType === "Top" || ardataType === "Image" || ardataType === "Face(Exposed)" || ardataType === "Outside" || ardataType.startsWith("Side");
        if (isFront) {
            ardataType = "Front";
        }
        if (ardataType === "Bottom" || ardataType === "Back(Reflected)" || ardataType === "Inside") {
            ardataType = "Back";
        }
        ardataTypes.add(ardataType);
        allArtdataTypes.add(ardataType);
    }
    return ardataTypes;
}

function parseUploadTask(uploadTasks, apiEndpoint) {
    const uploadTokens = apiEndpoint.split('/');
    const uploadTask = uploadTokens[uploadTokens.length - 1];
    uploadTasks.add(uploadTask);
    return uploadTask;
}

function collateTagsUsingExistingAndVarname(varnameTagSet, varname) {
    const tags = new Set();
    if (varname in COMPONENT_INFO && "Tags" in COMPONENT_INFO[varname]) {
        for (const tag of COMPONENT_INFO[varname].Tags) {
            tags.add(tag);
        }
    }
    for (const varnameTag of varnameTagSet) {
        tags.add(varnameTag);
    }
    return tags;
}

async function parseCustomStuff(gameCrafterSession) {
    const productInfo = await httpOperations.getCustomPartInfo(gameCrafterSession);

    let componentInfo = COMPONENT_INFO;
    const uploadTasks = new Set();
    const allArtdataTypes = new Set();

    componentInfo = COMPONENT_INFO;
    for (const component of productInfo) {
        console.log(component);
        break;
        const varname = component.identity;
        const varnameTagSet = convertVarNameIntoTagSet(varname);
        const widthInches = parseFloat(component.size.finished_inches[0]);
        const heightInches = parseFloat(component.size.finished_inches[1]);
        const widthPixels = component.size.pixels[0];
        const heightPixels = component.size.pixels[1];

        // createTemplateSvgFileAtDimensionsIfMissing(varname, widthPixels, heightPixels);
        const ardataTypes = parseArtdataTypes(allArtdataTypes, component.sides);
        const uploadTask = parseUploadTask(uploadTasks, component.create_api);

        const millimeterDepthIsDefined = component.size.finished_inches.length === 3;
        const millimeterDepth = millimeterDepthIsDefined ? parseFloat(component.size.finished_inches[2]) * INCH_TO_MILLIMETERS : 0;

        const tags = collateTagsUsingExistingAndVarname(varnameTagSet, varname);
        const isDie = component.sides[0].label.startsWith("Side");

        componentInfo[varname] = varname in COMPONENT_INFO ? COMPONENT_INFO[varname] : {};
        componentInfo[varname].DisplayName = varname;
        componentInfo[varname].DimensionsPixels = [widthPixels, heightPixels];
        componentInfo[varname].DimensionsInches = [widthInches, heightInches];
        componentInfo[varname].GameCrafterUploadTask = uploadTask;
        componentInfo[varname].GameCrafterPackagingDepthMillimeters = millimeterDepth;
        componentInfo[varname].HasPieceData = true;
        componentInfo[varname].HasPieceQuantity = !isDie;
        componentInfo[varname].ArtDataTypeNames = Array.from(ardataTypes);
        componentInfo[varname].Tags = Array.from(tags);
        if ("preview_uri" in component && component.preview_uri) {
            componentInfo[varname].PreviewUri = component.preview_uri;
        }
    }

    for (const key in componentInfo) {
        if (!("DisplayName" in componentInfo[key])) {
            componentInfo[key].DisplayName = key;
        }
        if (!("Tags" in componentInfo[key])) {
            componentInfo[key].Tags = [];
        }
    }
    for (const componentKey in COMPONENT_INFO) {
        if (componentKey in componentInfo) {
            continue;
        }
        console.log(`${componentKey} is missing`);
    }
    fs.writeFileSync('./customComponents.json', JSON.stringify(componentInfo, null, 4));
}

function tagListHasColor(tagList, possibleColor) {
    for (const tag of tagList) {
        if (tag.toLowerCase() === possibleColor.toLowerCase()) {
            return true;
        }
    }
    return false;
}

async function downloadPreviewImage(previewUrl, componentName) {
    if (!previewUrl) {
        return null;
    }

    if (previewUrl.startsWith('//')) {
        previewUrl = 'https:' + previewUrl;
    }

    try {
        const response = await new Promise((resolve, reject) => {
            https.get(previewUrl, (res) => {
                if (res.statusCode === 200) {
                    const chunks = [];
                    res.on('data', (chunk) => chunks.push(chunk));
                    res.on('end', () => resolve(Buffer.concat(chunks)));
                } else {
                    reject(new Error(`Failed to download preview image for ${componentName}: HTTP ${res.statusCode}`));
                }
            }).on('error', (err) => reject(err));
        });

        fs.mkdirSync('preview_images', { recursive: true });

        const filePath = `preview_images/${componentName}.png`;
        fs.writeFileSync(filePath, response);

        return filePath;
    } catch (err) {
        console.error(`Error downloading preview image for ${componentName}: ${err.message}`);
        return null;
    }
}

async function convertImageTo3D(imagePath, componentName) {
    try {
        console.log(`Converting ${componentName} image to 3D model...`);

        const objPath = `3d_models/${componentName}/${componentName}.obj`;
        const texturePath = `3d_models/${componentName}/${componentName}_texture.png`;
        const normalPath = `3d_models/${componentName}/${componentName}_normal.png`;

        fs.mkdirSync(`3d_models/${componentName}`, { recursive: true });

        return {
            objPath,
            texturePath,
            normalPath,
        };
    } catch (err) {
        console.error(`Error converting image to 3D for ${componentName}: ${err.message}`);
        return null;
    }
}

async function uploadToS3(filePaths, componentName) {
    try {
        const awsAccessKey = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY;
        const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET;
        const awsRegion = process.env.AWS_REGION || 'us-east-1';
        const s3Bucket = "templative-simulator-images";

        if (!awsAccessKey || !awsSecretKey || !s3Bucket) {
            console.error("Missing AWS credentials or bucket name");
            return null;
        }

        const s3Client = new S3Client({
            region: awsRegion,
            credentials: {
                accessKeyId: awsAccessKey,
                secretAccessKey: awsSecretKey,
            }
        });

        const s3Urls = {};

        for (const [fileType, filePath] of Object.entries(filePaths)) {
            if (fs.existsSync(filePath)) {
                const key = `game_components_3d/${componentName}/${path.basename(filePath)}`;
                
                const command = new PutObjectCommand({
                    Bucket: s3Bucket,
                    Key: key,
                    Body: fs.createReadStream(filePath)
                });
                
                await s3Client.send(command);
                
                s3Urls[fileType] = `https://${s3Bucket}.s3.amazonaws.com/${key}`;
                console.log(`Uploaded ${fileType} to S3: ${s3Urls[fileType]}`);
            } else {
                console.warn(`File not found: ${filePath}`);
            }
        }

        return {
            objUrl: s3Urls.objPath,
            textureUrl: s3Urls.texturePath,
            normalUrl: s3Urls.normalPath,
        };
    } catch (err) {
        console.error(`Error uploading to S3 for ${componentName}: ${err.message}`);
        return null;
    }
}

async function downloadAllPreviewImages(stockInfo, concurrencyLimit = 5, rateLimitPerMinute = 30) {
    const componentsWithPreview = Object.entries(stockInfo)
        .filter(([, info]) => "PreviewUri" in info && info.PreviewUri)
        .map(([name, info]) => [name, info.PreviewUri]);

    if (componentsWithPreview.length === 0) {
        console.log("No components with preview URIs found.");
        return;
    }

    fs.mkdirSync('preview_images', { recursive: true });

    const delay = 60 / rateLimitPerMinute;

    const semaphore = new Semaphore(concurrencyLimit);

    const downloadedComponents = {};
    const progressFile = './download_progress.json';

    if (fs.existsSync(progressFile)) {
        try {
            const data = fs.readFileSync(progressFile, 'utf8');
            Object.assign(downloadedComponents, JSON.parse(data));
            console.log(`Resuming from previous download progress (${Object.keys(downloadedComponents).length} already downloaded)`);
        } catch (err) {
            console.warn("Could not load download progress, starting fresh");
        }
    }

    async function downloadWithRateLimit(componentName, previewUrl) {
        await semaphore.acquire();
        try {
            if (previewUrl.startsWith('//')) {
                previewUrl = 'https:' + previewUrl;
            }

            const filePath = `preview_images/${componentName}.png`;

            if (componentName in downloadedComponents || fs.existsSync(filePath)) {
                console.log(`Image for ${componentName} already exists, skipping.`);
                if (!(componentName in downloadedComponents)) {
                    downloadedComponents[componentName] = filePath;
                    fs.writeFileSync(progressFile, JSON.stringify(downloadedComponents, null, 2));
                }
                return filePath;
            }

            try {
                const response = await new Promise((resolve, reject) => {
                    https.get(previewUrl, (res) => {
                        if (res.statusCode === 200) {
                            const chunks = [];
                            res.on('data', (chunk) => chunks.push(chunk));
                            res.on('end', () => resolve(Buffer.concat(chunks)));
                        } else {
                            reject(new Error(`Failed to download image for ${componentName}: HTTP ${res.statusCode}`));
                        }
                    }).on('error', (err) => reject(err));
                });

                fs.writeFileSync(filePath, response);
                console.log(`Downloaded image for ${componentName}`);

                downloadedComponents[componentName] = filePath;

                fs.writeFileSync(progressFile, JSON.stringify(downloadedComponents, null, 2));

                await new Promise((resolve) => setTimeout(resolve, delay * 1000));
                return filePath;
            } catch (err) {
                console.error(`Error downloading image for ${componentName}: ${err.message}`);
                return null;
            }
        } finally {
            semaphore.release();
        }
    }

    const tasks = componentsWithPreview.map(([name, url]) => downloadWithRateLimit(name, url));
    const results = await Promise.all(tasks);

    const successful = results.filter((result) => result !== null).length;
    console.log(`Downloaded ${successful} of ${componentsWithPreview.length} images`);

    if (fs.existsSync(progressFile)) {
        fs.unlinkSync(progressFile);
        console.log("Removed download progress tracking file after successful completion");
    }
}

class Semaphore {
    constructor(max) {
        this.max = max;
        this.count = 0;
        this.queue = [];
    }

    async acquire() {
        if (this.count < this.max) {
            this.count++;
            return;
        }

        return new Promise(resolve => {
            this.queue.push(resolve);
        });
    }

    release() {
        this.count--;

        if (this.queue.length > 0) {
            this.count++;
            const next = this.queue.shift();
            next();
        }
    }
}

module.exports = { 
    parseCustomStuff,
    downloadAllPreviewImages,
    convertImageTo3D,
    uploadToS3
};