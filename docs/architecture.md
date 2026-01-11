# Architecture for Dynamic Tile Management

This document outlines the architecture for a new feature that allows administrators to manage the content displayed in the `sck-app` dynamically. Currently, the tiles in the `sck-app` are static and hard-coded in the frontend. The new feature will replace this static content with dynamic content fetched from the API.

## 1. High-Level Architecture

The high-level architecture consists of three main components:

1.  **`sck-api`:** The RESTful API that provides the backend for the new feature.
2.  **`sck-admin-app`:** The admin application that allows administrators to manage the dynamic content.
3.  **`sck-app`:** The main application that displays the dynamic content to the end-users.

The following diagram illustrates the high-level architecture:

```
+-----------------+      +-----------------+      +-----------------+
|   sck-app       |      |   sck-api       |      | sck-admin-app   |
| (Frontend)      |      | (Backend)       |      | (Frontend)      |
+-----------------+      +-----------------+      +-----------------+
        |                      |                      |
        |  <-- Fetches tiles ---|                      |
        |                      |--- Manages tiles -->  |
        |                      |                      |
```

## 2. API (`sck-api`)

The API will be responsible for storing and managing the tiles. It will expose a RESTful endpoint for CRUD (Create, Read, Update, Delete) operations on the tiles.

### 2.0. Image Management

The `sck-api` handles image uploads and retrieval through manually defined Express routes in `src/index.ts`, rather than TSOA-generated controllers.

*   **Image Upload Endpoint**: A `POST` request to `/api/images/upload` allows clients to upload images. This route utilizes `multer` middleware for processing `multipart/form-data`.
    *   `multer` is configured with `diskStorage` to save uploaded files directly to the `UPLOADS_DIR`.
    *   The `filepath` stored in the image metadata (in `media.ndjson`) is the `basename` (filename) of the uploaded file.
*   **Image Retrieval Endpoint**: A `GET` request to `/api/images/:imageId` retrieves an image by its unique ID.
    *   The `ImageService` (defined in `src/utils/image-utils.ts`) is used to fetch the image's metadata from `media.ndjson`.
    *   The server then resolves the full path to the image file using `UPLOADS_DIR` and the stored `filepath`, and serves the file using `res.sendFile()`.
*   **Image Metadata Storage (`media.ndjson`)**: All uploaded image metadata (id, filename, filepath, mimetype, size, uploadedAt) is stored in a `media.ndjson` file located in the `src/sck-api/data/` directory. Each line in this file represents a JSON object for a single image.
*   **Image File Storage (`UPLOADS_DIR`)**: The actual image files are stored on the filesystem in the `src/sck-api/data/media/` directory.
*   **Path Resolution**: `UPLOADS_DIR` and `MEDIA_FILE_PATH` are resolved using `process.cwd()` to ensure correct path resolution regardless of the execution context (e.g., `ts-node` vs `node dist/...`).

### 2.1. Boarding Management

A dedicated API endpoint allows for the management of "Boardings" (pickup locations), which can be referenced by Tiles.

*   **Controller**: `BoardingsController` (`src/sck-api/src/controllers/boardings-controller.ts`)
*   **Service**: `BoardingsService` (`src/sck-api/src/services/boardings-service.ts`)
*   **Storage**: Data is persisted in `src/sck-api/data/boardings.json`.
*   **Data Model**:
    ```typescript
    export interface Boarding {
        id: string;
        name: string;
    }
    ```
*   **Endpoints**:
    *   `GET /boardings`: List all boardings.
    *   `GET /boardings/:id`: Get a specific boarding.
    *   `POST /boardings`: Create a new boarding.
    *   `PUT /boardings/:id`: Update a boarding.
    *   `DELETE /boardings/:id`: Delete a boarding.

### 2.2. Data Model (`tile.ts`)

The data model for the tiles has been extended to support dynamic features and references.

```typescript
import { TileActions, TileBehavior, TileStatus, TileType } from './tile-enums';

export interface Tile {
    id: string;
    order: number;
    type: TileType;
    title: string;
    date: string;
    subTitle: string;
    image: string;      // The resolved URL or relative path to the image
    imageId?: string;   // Reference to the managed Image ID (optional)
    imageDescription: string;
    description: string;
    status: TileStatus;
    expiration: string;
    behavior: TileBehavior;
    boardings?: string[]; // Array of boarding names selected from the available list
    actions?: TileActions[];
    downloadActionLink?: string;
    avatar?: string;
    visible?: boolean;
    expired?: boolean;
}
```

### 2.3. API Controller (`tiles-controller.ts`)

The `tiles-controller.ts` handles the HTTP requests for the tiles, supporting standard CRUD operations (`GET`, `POST`, `PUT`, `DELETE`). It uses `TilesService` to interact with `src/sck-api/data/tiles.json`.

## 3. Admin Application (`sck-admin-app`)

The `sck-admin-app` provides the interface for administrators to manage Tiles and Boardings.

### 3.1. Layout & Navigation

The application uses a Tabbed Interface (`MatTabsModule`) to separate concerns:

1.  **Tiles Tab**: The core tile management interface.
2.  **Boardings Tab**: Management of pickup locations.
3.  **Media Tab**: Placeholder for future media gallery features.

### 3.2. Tile Management

The Tile Management view (`TileManagementComponent`) uses a **Split-View** layout:

*   **Left Column (List)**: `TileListComponent` displays all existing tiles. Clicking a tile selects it for editing.
*   **Right Column (Editor)**: `TileEditorComponent` allows modification of the selected tile.
    *   **Form Area**: Contains editable fields for all tile properties.
    *   **Live Preview**: `TilePreviewComponent` renders the tile exactly as it will appear in the main app, using shared styles. This provides immediate visual feedback during editing.

**Key Components:**

*   **`TilePreviewComponent`**: Handles the rendering of the tile preview. It includes logic (`getImageUrl`) to correctly resolve relative API image paths (`/api/images/...`) to absolute URLs for display.
*   **`EditableImageComponent`**: A specialized component for image handling.
    *   Displays the current image with a "Remove" button.
    *   Allows uploading a new image via file selection.
    *   Automatically uploads the file to the API (`POST /api/images/upload`) and updates the Tile's `image` and `imageId` properties.
*   **`Editable Components`** (`EditableText`, `EditableTextarea`, `EditableDate`, `EditableLink`): Refactored to use standard Angular Material `MatFormField` with clear labels and consistent styling (`appearance="outline"`).

### 3.3. Boarding Management

The Boarding Management view (`BoardingManagementComponent`) allows administrators to maintain the list of available pickup locations.

*   **List**: Displays existing boardings with Edit/Delete actions.
*   **Editor**: A simple form to create or update boarding names.
*   **Integration**: In the `TileEditorComponent`, the "Boardings" field is a multi-select dropdown (`mat-select`) that is populated dynamically from the Boardings API. This ensures tiles only reference valid, managed boarding locations.

### 3.4. URL Resolution Strategy

To ensure images work correctly in both the Admin App (preview) and the Main App:

*   **Storage**: Images are stored as relative API paths (e.g., `/api/images/uuid...`) or potential external URLs.
*   **Resolution**: Both applications implement a helper method `getImageUrl(path)`:
    *   If the path starts with `http`, it is treated as absolute.
    *   If it is a relative path, the application's configured API base URL (e.g., `http://localhost:3000`) is prepended (handling potential double slashes).
*   **Configuration**: The Admin App exposes its API URL via `TilesDataService.apiUrl`.

## 4. Main Application (`sck-app`)

The `sck-app` fetches tiles from the `/api/tiles` endpoint.

*   **Display**: Iterates over the fetched tiles.
*   **Image Handling**: Uses the `getImageUrl` helper in `HomeComponent` to bind `[src]` attributes, ensuring images load correctly from the backend.
*   **Filtering/Sorting**: (As planned) Filters by publication/expiration dates.