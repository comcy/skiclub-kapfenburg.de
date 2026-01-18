# Architecture

This document outlines the architecture of the `skiclub-kapfenburg.de` project.

## 1. High-Level Overview

The project is a monorepo that contains the backend API (`sck-api`) and the frontend web applications (`web`).

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

## 2. Backend (`sck-api`)

The backend is a Node.js application written in TypeScript. It uses the Express.js framework and `tsoa` for generating routes from controllers.

### 2.1. Key Technologies

- **Framework**: Express.js
- **API Generation**: `tsoa`
- **Build Tool**: `rollup`
- **Testing**: `jest`
- **Language**: TypeScript

### 2.2. Project Structure

The project follows a standard structure for a Node.js application:

- `src/controllers`: Contains the controllers that handle the HTTP requests.
- `src/services`: Contains the business logic.
- `src/domain`: Contains the data models.
- `src/routes`: Contains the API routes.
- `src/index.ts`: The entry point of the application.
- `data`: Contains the data files (e.g., `boardings.json`, `media.ndjson`, `tiles.json`).

## 3. Frontend (`web`)

The frontend is an Angular monorepo that contains two applications and several libraries.

### 3.1. Key Technologies

- **Framework**: Angular
- **UI Library**: Angular Material
- **Testing**: Karma and Jasmine
- **Linting**: ESLint and Prettier

### 3.2. Project Structure

The frontend is a monorepo with the following structure:

- `projects/sck-app`: The main application for the end-users.
- `projects/sck-admin-app`: The admin application for managing the content.
- `projects/courses-lib`: Library with course-related functionality.
- `projects/gym-lib`: Library with gym-related functionality.
- `projects/membership-lib`: Library with membership-related functionality.
- `projects/shared-lib`: Library with shared functionality.
- `projects/skilift-lib`: Library with skilift-related functionality.
- `projects/trips-lib`: Library with trip-related functionality.

## 4. Workflows

The project uses GitHub Actions for CI/CD. The workflows are defined in the `.github/workflows` directory.

- `sck-api-build.yml`: Builds the `sck-api` application.
- `sck-api-deploy.yml`: Deploys the `sck-api` application.
- `sck-web-app-build-deploy.yml`: Builds and deploys the `sck-app` and `sck-admin-app` applications.
