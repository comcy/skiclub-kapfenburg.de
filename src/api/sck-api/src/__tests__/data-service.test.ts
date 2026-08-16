import { jest } from '@jest/globals';

const mockAppendFile = jest.fn();
const mockExistsSync = jest.fn();
const mockMkdirSync = jest.fn();

jest.unstable_mockModule('fs', () => ({
  __esModule: true,
  default: {
    promises: { appendFile: mockAppendFile },
    existsSync: mockExistsSync,
    mkdirSync: mockMkdirSync,
  },
}));

mockExistsSync.mockReturnValue(true);

const { saveData } = await import('../services/data-service');

describe('DataService', () => {
  beforeEach(() => {
    mockAppendFile.mockClear();
    mockExistsSync.mockClear();
    mockMkdirSync.mockClear();
  });

  it('sollte Daten korrekt in eine Zeile umwandeln und speichern', async () => {
    const type = 'test-type';
    const data = { name: 'Test', value: 123 };

    mockExistsSync.mockReturnValue(true);
    mockAppendFile.mockResolvedValue(undefined);

    await saveData(type, data);

    expect(mockAppendFile).toHaveBeenCalledTimes(1);

    const writtenData = mockAppendFile.mock.calls[0][1];
    const parsedData = JSON.parse(writtenData as string);

    expect(parsedData.type).toBe(type);
    expect(parsedData.name).toBe(data.name);
    expect(parsedData.value).toBe(data.value);
    expect(parsedData.timestamp).toBeDefined();
  });

  it('sollte einen Fehler werfen, wenn das Speichern fehlschlägt', async () => {
    const errorMessage = 'Speicherfehler';
    mockExistsSync.mockReturnValue(true);
    mockAppendFile.mockRejectedValue(new Error(errorMessage));

    const type = 'test-type';
    const data = { name: 'Test' };

    await expect(saveData(type, data)).rejects.toThrow('Daten konnten nicht gespeichert werden.');
  });

  it('sollte das data-Verzeichnis erstellen, wenn es nicht existiert', async () => {
    const type = 'test-type';
    const data = { name: 'Test' };

    mockExistsSync.mockReturnValue(false);
    mockAppendFile.mockResolvedValue(undefined);

    await saveData(type, data);

    expect(mockAppendFile).toHaveBeenCalledTimes(1);
  });
});
