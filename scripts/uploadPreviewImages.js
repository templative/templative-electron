const { S3Client, PutObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const glob = require("glob");

const PREVIEW_IMAGES_PATH = "/Users/oliverbarnum/Documents/git/templative-electron/src/assets/images/componentPreviewImages";
const bucketName = "templative-component-preview-images";

const uploadPreviewImages = async () => {
    const s3 = new S3Client({
        region: "us-west-2",
    });
    
    try {
        // Get all image files in the directory
        const imageFiles = glob.sync(path.join(PREVIEW_IMAGES_PATH, "**/*.{png,jpg,jpeg,svg}"));
        
        console.log(`Found ${imageFiles.length} images to check/upload...`);
        
        let uploadCount = 0;
        let skipCount = 0;
        
        // Upload each file to S3
        for (const filePath of imageFiles) {
            const fileContent = fs.readFileSync(filePath);
            const fileName = path.relative(PREVIEW_IMAGES_PATH, filePath);
            
            // Check if file already exists in S3
            try {
                await s3.send(new HeadObjectCommand({
                    Bucket: bucketName,
                    Key: fileName
                }));
                console.log(`Skipping ${fileName} - already exists in S3`);
                skipCount++;
                continue; // Skip this file
            } catch (err) {
                // File doesn't exist, proceed with upload
                if (err.name !== 'NotFound') {
                    console.error(`Error checking if ${fileName} exists:`, err);
                }
            }
            
            const params = {
                Bucket: bucketName,
                Key: fileName,
                Body: fileContent,
                ContentType: getContentType(filePath)
            };
            
            try {
                await s3.send(new PutObjectCommand(params));
                console.log(`Successfully uploaded ${fileName}`);
                uploadCount++;
            } catch (err) {
                console.error(`Error uploading ${fileName}:`, err);
            }
        }
        
        console.log(`Upload complete! Uploaded: ${uploadCount}, Skipped: ${skipCount}`);
    } catch (err) {
        console.error("Error:", err);
    }
};

// Helper function to determine content type based on file extension
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.svg': return 'image/svg+xml';
        default: return 'application/octet-stream';
    }
}

// Run the upload function
uploadPreviewImages();

module.exports = { uploadPreviewImages };