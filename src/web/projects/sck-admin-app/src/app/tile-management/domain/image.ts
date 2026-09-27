export interface Image {
    id: string;
    filename: string;
    // Only present on the upload response, not on a listed image (see
    // sck-api's images-controller.ts) - the client never reads this itself.
    filepath?: string;
    url: string;
    mimetype: string;
    size: number;
    altText?: string;
    // ISO string as it arrives over JSON - never actually a Date instance.
    uploadedAt: string;
}
