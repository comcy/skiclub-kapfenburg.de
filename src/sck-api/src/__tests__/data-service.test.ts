/*
import fs from 'fs';
import { saveEntity, getEntities, getEntityById, updateEntity, deleteEntity, EntityType } from '../services/data-service';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

describe('DataService', () => {
  const mockedFs = fs as jest.Mocked<typeof fs>;
  const entityType: EntityType = 'events';

  beforeEach(() => {
    (fs.promises.readFile as jest.Mock).mockClear();
    (fs.promises.writeFile as jest.Mock).mockClear();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
  });

  const mockData = [{ id: '1', name: 'Test 1' }, { id: '2', name: 'Test 2' }];
  const mockDataString = mockData.map(d => JSON.stringify(d)).join('\n') + '\n';

  it('getEntities should read and parse entities', async () => {
    (fs.promises.readFile as jest.Mock).mockResolvedValue(mockDataString);
    const entities = await getEntities(entityType);
    expect(entities).toEqual(mockData);
    expect(fs.promises.readFile).toHaveBeenCalledWith(expect.any(String), 'utf-8');
  });
  
  it('getEntityById should return a single entity', async () => {
    (fs.promises.readFile as jest.Mock).mockResolvedValue(mockDataString);
    const entity = await getEntityById(entityType, '1');
    expect(entity).toEqual(mockData[0]);
  });

  it('saveEntity should add a new entity and write to file', async () => {
    (fs.promises.readFile as jest.Mock).mockResolvedValue(mockDataString);
    const newEntity = { name: 'Test 3' };
    const savedEntity = await saveEntity(entityType, newEntity);
    
    expect(savedEntity.name).toBe(newEntity.name);
    expect(savedEntity.id).toBeDefined();

    expect(fs.promises.writeFile).toHaveBeenCalledTimes(1);
    const writtenData = (fs.promises.writeFile as jest.Mock).mock.calls[0][1] as string;
    expect(writtenData).toContain(savedEntity.id);
  });

  it('updateEntity should update an existing entity', async () => {
    (fs.promises.readFile as jest.Mock).mockResolvedValue(mockDataString);
    const updatedData = { name: 'Updated Test 1' };
    const updatedEntity = await updateEntity(entityType, '1', updatedData);

    expect(updatedEntity?.name).toBe(updatedData.name);
    expect(fs.promises.writeFile).toHaveBeenCalledTimes(1);
    const writtenData = (fs.promises.writeFile as jest.Mock).mock.calls[0][1] as string;
    expect(writtenData).toContain('Updated Test 1');
  });

  it('deleteEntity should remove an entity', async () => {
    (fs.promises.readFile as jest.Mock).mockResolvedValue(mockDataString);
    const success = await deleteEntity(entityType, '1');

    expect(success).toBe(true);
    expect(fs.promises.writeFile).toHaveBeenCalledTimes(1);
    const writtenData = (fs.promises.writeFile as jest.Mock).mock.calls[0][1] as string;
    expect(writtenData).not.toContain('"id":"1"');
  });
});
*/
