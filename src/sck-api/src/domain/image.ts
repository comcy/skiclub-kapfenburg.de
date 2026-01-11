// src/sck-api/src/domain/image.ts
export interface Image {
    id: string;
    filename: string;
    filepath: string; // Internal path on the server
    url: string;      // Public URL to access the image
    mimetype: string;
    size: number;
    altText?: string;
    uploadedAt: Date;
}
