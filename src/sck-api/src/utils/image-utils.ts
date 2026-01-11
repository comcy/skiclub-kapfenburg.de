// src/sck-api/src/services/image-service.ts
import { Image } from '../domain/image';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fs } from 'fs';

const IMAGES_BASE_URL = '/api/images'; // Base URL for serving images
const MEDIA_FILE_PATH = path.resolve(process.cwd(), 'data/media.ndjson');

// Helper to read all images from the NDJSON file
async function readImagesFromFile(): Promise<Image[]> {
    try {
        const data = await fs.readFile(MEDIA_FILE_PATH, 'utf-8');
        // Each line is a JSON object, parse them all
        return data.split('\n')
                   .filter(line => line.trim() !== '')
                   .map(line => {
                       const image = JSON.parse(line);
                       // Convert uploadedAt string back to Date object
                       image.uploadedAt = new Date(image.uploadedAt);
                       return image;
                   });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // File does not exist, return empty array
            return [];
        }
        throw error;
    }
}

// Helper to write all images to the NDJSON file
async function writeImagesToFile(images: Image[]): Promise<void> {
    const data = images.map(image => JSON.stringify(image)).join('\n');
    await fs.writeFile(MEDIA_FILE_PATH, data, 'utf-8');
}

export class ImageService {

    public async saveImage(
        originalFilename: string,
        storedFilepath: string, // Relative path from the UPLOADS_DIR
        mimetype: string,
        size: number
    ): Promise<Image> {
        const id = uuidv4();
        const url = `${IMAGES_BASE_URL}/${id}`;

        const newImage: Image = {
            id,
            filename: originalFilename,
            filepath: storedFilepath,
            url,
            mimetype,
            size,
            uploadedAt: new Date(),
        };

        const images = await readImagesFromFile();
        images.push(newImage);
        await writeImagesToFile(images); // Persist the updated list
        return newImage;
    }

    public async getImageById(id: string): Promise<Image | undefined> {
        const images = await readImagesFromFile();
        return images.find(img => img.id === id);
    }
}
