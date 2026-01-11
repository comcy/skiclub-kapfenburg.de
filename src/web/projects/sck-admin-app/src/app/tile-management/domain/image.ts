export interface Image {
    id: string;
    filename: string;
    filepath: string;
    url: string;
    mimetype: string;
    size: number;
    altText?: string;
    uploadedAt: Date;
}
