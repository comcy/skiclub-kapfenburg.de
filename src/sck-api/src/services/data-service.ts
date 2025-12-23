/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export type EntityType = 'registrations' | 'events' | 'gym-courses';

const getFilePath = (entityType: EntityType): string => {
    return path.join(dataDir, `${entityType}.ndjson`);
};

export const readEntities = async <T extends Record<string, any>>(entityType: EntityType): Promise<T[]> => {
    const filePath = getFilePath(entityType);
    try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        const lines = data.split('\n').filter((line) => line.length > 0);
        return lines.map((line) => JSON.parse(line));
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error(`Fehler beim Lesen der Daten für ${entityType}:`, error);
        throw new Error('Daten konnten nicht gelesen werden.');
    }
};

const writeEntities = async <T>(entityType: EntityType, entities: T[]): Promise<void> => {
    const filePath = getFilePath(entityType);
    const data = entities.map((entity) => JSON.stringify(entity)).join('\n') + '\n';
    try {
        await fs.promises.writeFile(filePath, data, 'utf-8');
    } catch (error) {
        console.error(`Fehler beim Schreiben der Daten für ${entityType}:`, error);
        throw new Error('Daten konnten nicht geschrieben werden.');
    }
};

export const saveEntity = async <T extends { id?: string }>(entityType: EntityType, entity: T): Promise<T> => {
    const entities = await readEntities<T>(entityType);
    const newEntity = { ...entity, id: randomUUID(), timestamp: new Date().toISOString() };
    entities.push(newEntity);
    await writeEntities(entityType, entities);
    return newEntity;
};

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const getEntities = async <T extends Record<string, any>>(
    entityType: EntityType,
    page = 1,
    limit = 10,
    sort?: string,
    filter?: string,
): Promise<PaginatedResult<T>> => {
    let entities = await readEntities<T>(entityType);

    // Filtering
    if (filter) {
        entities = entities.filter((entity) => {
            return Object.values(entity).some((value) =>
                typeof value === 'string' ? value.toLowerCase().includes(filter.toLowerCase()) : false,
            );
        });
    }

    // Sorting
    if (sort) {
        const [sortBy, sortOrder] = sort.split(':');
        entities.sort((a, b) => {
            const valA = a[sortBy as keyof T];
            const valB = b[sortBy as keyof T];

            if (valA < valB) {
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    // Pagination
    const total = entities.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = entities.slice(startIndex, startIndex + limit);

    return {
        data,
        total,
        page,
        limit,
        totalPages,
    };
};

export const getEntityById = async <T extends { id?: string }>(entityType: EntityType, id: string): Promise<T | null> => {
    const entities = await readEntities<T>(entityType);
    return entities.find((e) => e.id === id) || null;
};

export const updateEntity = async <T extends { id?: string }>(
    entityType: EntityType,
    id: string,
    updatedEntity: Partial<T>,
): Promise<T | null> => {
    const entities = await readEntities<T>(entityType);
    const index = entities.findIndex((e) => e.id === id);
    if (index === -1) {
        return null;
    }
    entities[index] = { ...entities[index], ...updatedEntity, timestamp: new Date().toISOString() };
    await writeEntities(entityType, entities);
    return entities[index];
};

export const deleteEntity = async <T extends { id?: string }>(entityType: EntityType, id: string): Promise<boolean> => {
    let entities = await readEntities<T>(entityType);
    const initialLength = entities.length;
    entities = entities.filter((e) => e.id !== id);
    if (entities.length === initialLength) {
        return false; // No entity found with the given id
    }
    await writeEntities(entityType, entities);
    return true;
};
