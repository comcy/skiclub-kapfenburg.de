import { promises as fs } from 'fs';
import path from 'path';
import { Boarding, BoardingCreationParams } from '../domain/boarding';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, '..', 'data', 'boardings.json');

async function readBoardings(): Promise<Boarding[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeBoardings(boardings: Boarding[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(boardings, null, 2), 'utf-8');
}

import { PaginatedResponse } from '../domain/paginated-response';
// ... imports

export class BoardingsService {
  public async getBoardings(page: number = 1, limit: number = 100): Promise<PaginatedResponse<Boarding>> {
    const boardings = await readBoardings();
    
    // Sort by name
    boardings.sort((a, b) => a.name.localeCompare(b.name));

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedBoardings = boardings.slice(startIndex, endIndex);

    return {
        items: paginatedBoardings,
        total: boardings.length
    };
  }
// ...

  public async getBoarding(id: string): Promise<Boarding | null> {
    const boardings = await readBoardings();
    return boardings.find((b) => b.id === id) || null;
  }

  public async createBoarding(params: BoardingCreationParams): Promise<Boarding> {
    const boardings = await readBoardings();
    const newBoarding: Boarding = {
      id: (Date.now()).toString(), // Simple ID generation
      ...params,
    };
    boardings.push(newBoarding);
    await writeBoardings(boardings);
    return newBoarding;
  }

  public async updateBoarding(id: string, params: BoardingCreationParams): Promise<Boarding | null> {
    const boardings = await readBoardings();
    const index = boardings.findIndex((b) => b.id === id);
    if (index === -1) {
      return null;
    }
    boardings[index] = { ...params, id };
    await writeBoardings(boardings);
    return boardings[index];
  }

  public async deleteBoarding(id: string): Promise<void> {
    const boardings = await readBoardings();
    const index = boardings.findIndex((b) => b.id === id);
    if (index !== -1) {
      boardings.splice(index, 1);
      await writeBoardings(boardings);
    }
  }
}
