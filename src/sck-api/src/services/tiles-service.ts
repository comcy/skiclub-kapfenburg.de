import { promises as fs } from 'fs';
import path from 'path';
import { Tile, TileCreationParams } from '../domain/tile';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, '..', 'data', 'tiles.ndjson');

async function readTiles(): Promise<Tile[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const lines = data.split('\n').filter((line) => line.trim().length > 0);
    return lines.map((line) => {
      const tile = JSON.parse(line);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { publicationDate, expirationDate, ...rest } = tile;
      return rest;
    });
  } catch (error) {
    // If the file does not exist, return an empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeTiles(tiles: Tile[]): Promise<void> {
  const data = tiles.map((tile) => JSON.stringify(tile)).join('\n');
  await fs.writeFile(dataFilePath, data, 'utf-8');
}

import { PaginatedResponse } from '../domain/paginated-response';

// ... imports

export class TilesService {
  public async getTiles(
    page: number = 1,
    limit: number = 100,
    sort: string = 'order',
    direction: 'asc' | 'desc' = 'asc',
    search?: string,
    type?: string,
    status?: string
  ): Promise<PaginatedResponse<Tile>> {
    let tiles = await readTiles();

    // Filtering
    if (search) {
      const searchLower = search.toLowerCase();
      tiles = tiles.filter(
        (t) =>
          t.title?.toLowerCase().includes(searchLower) ||
          t.subTitle?.toLowerCase().includes(searchLower)
      );
    }

    if (type) {
      tiles = tiles.filter((t) => t.type === type);
    }

    if (status) {
      tiles = tiles.filter((t) => t.status === status);
    }

    // Sorting
    tiles.sort((a, b) => {
      const valA = (a as any)[sort];
      const valB = (b as any)[sort];

      if (valA < valB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTiles = tiles.slice(startIndex, endIndex);

    return {
      items: paginatedTiles,
      total: tiles.length,
    };
  }
// ...

  public async getTile(id: string): Promise<Tile | null> {
    const tiles = await readTiles();
    return tiles.find((tile) => tile.id === id) || null;
  }

  public async createTile(tile: TileCreationParams): Promise<Tile> {
    const tiles = await readTiles();
    const newTile: Tile = {
      id: (tiles.length + 1).toString(),
      ...tile,
    };
    tiles.push(newTile);
    await writeTiles(tiles);
    return newTile;
  }

  public async updateTile(id: string, tile: Tile): Promise<Tile | null> {
    const tiles = await readTiles();
    const index = tiles.findIndex((t) => t.id === id);
    if (index === -1) {
      return null;
    }
    tiles[index] = { ...tile, id };
    await writeTiles(tiles);
    return tiles[index];
  }

  public async deleteTile(id: string): Promise<void> {
    const tiles = await readTiles();
    const index = tiles.findIndex((t) => t.id === id);
    if (index !== -1) {
      tiles.splice(index, 1);
      await writeTiles(tiles);
    }
  }
}