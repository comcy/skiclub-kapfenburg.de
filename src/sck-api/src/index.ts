/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config.js';
import express from 'express';
import { RegisterRoutes } from './routes/routes';
import { ImageService } from './utils/image-utils'; // Import ImageService from utils
import path from 'path'; // Import path
import multer from 'multer'; // Import multer


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// --- Image Upload Setup ---
const UPLOADS_DIR = path.resolve(process.cwd(), 'data/media');

const storage = multer.diskStorage({
    destination: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });
// --- End Image Upload Setup ---


// --- Manual Image Retrieval Route ---
const imageService = new ImageService();

const imageRetrievalHandler: express.RequestHandler = async (req, res) => {
    const imageId = req.params.imageId;
    console.log(`[DEBUG] GET /api/images/${imageId}`);
    
    const image = await imageService.getImageById(imageId);
    console.log(`[DEBUG] Image found in DB:`, image);

    if (!image) {
        console.log('[DEBUG] Image not found in DB');
        res.status(404).send({ message: 'Image not found' });
        return; // Explicitly return void
    }

    console.log(`[DEBUG] UPLOADS_DIR: ${UPLOADS_DIR}`);
    const imagePath = path.resolve(UPLOADS_DIR, image.filepath);
    console.log(`[DEBUG] Resolved imagePath: ${imagePath}`);

    res.sendFile(imagePath, (err: Error) => {
        if (err) {
            console.error('[DEBUG] Error sending file:', err);
            if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
                res.status(404).send({ message: 'Image file not found on server' });
            } else {
                res.status(500).send({ message: 'Error retrieving image' });
            }
            return; // Explicitly return void after sending response in callback
        }
        console.log('[DEBUG] File sent successfully');
    });
};

app.get('/api/images/:imageId', imageRetrievalHandler);
// --- End Manual Image Retrieval Route ---


const apiRouter = express.Router();

// Apply multer middleware only to the upload route for TSOA generated controller
// --- Manual Image Upload Route ---
apiRouter.post('/images/upload', upload.single('image'), async (req: express.Request, res: express.Response) => {
    if (!req.file) {
        res.status(400).send({ message: 'No file uploaded' });
        return; // Explicitly return void
    }
    // req.file is populated by multer
    const newImage = await imageService.saveImage(
        req.file.originalname,
        path.basename(req.file.path), // Use basename as path is already absolute
        req.file.mimetype,
        req.file.size
    );
    res.status(201).json(newImage);
    return; // Explicitly return void
});
// --- End Manual Image Upload Route ---

RegisterRoutes(apiRouter);
app.use('/api', apiRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
