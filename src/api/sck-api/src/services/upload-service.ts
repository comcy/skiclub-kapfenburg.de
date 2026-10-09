/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { dataDir } from './data-service.js';

export const mediaDir = path.join(dataDir, 'media');

if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, mediaDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ALLOWED_MIME_TYPES.has(file.mimetype));
  },
}).single('image');

const MIME_BY_EXTENSION: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

export interface UploadedImage {
  id: string;
  filename: string;
  url: string;
  mimetype: string;
  size: number;
  uploadedAt: string;
}

// No DB table for images (see images-controller.ts) - the media directory
// itself is the record, so listing means reading it back off disk. Sorted
// newest-first to match how an admin actually browses uploads.
export const listImages = (): UploadedImage[] =>
  fs
    .readdirSync(mediaDir)
    .map((filename) => {
      const stat = fs.statSync(path.join(mediaDir, filename));
      return {
        id: filename,
        filename,
        url: `/media/${filename}`,
        mimetype: MIME_BY_EXTENSION[path.extname(filename).toLowerCase()] ?? 'application/octet-stream',
        size: stat.size,
        uploadedAt: stat.mtime.toISOString(),
      };
    })
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

// path.basename strips any directory component a caller might slip into the
// :filename param, so this can never escape mediaDir - no other path-safety
// check is needed on top of that.
export const deleteImage = (filename: string): boolean => {
  const target = path.join(mediaDir, path.basename(filename));
  if (!fs.existsSync(target)) return false;
  fs.unlinkSync(target);
  return true;
};
