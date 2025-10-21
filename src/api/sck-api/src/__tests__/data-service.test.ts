import fs from 'fs';
import { saveData } from '../services/data-service';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    appendFile: jest.fn(),
  },
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

describe('DataService', () => {
  const mockedFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    (fs.promises.appendFile as jest.Mock).mockClear();
    (fs.existsSync as jest.Mock).mockClear();
    (fs.mkdirSync as jest.Mock).mockClear();
  });

  it('sollte Daten korrekt in eine Zeile umwandeln und speichern', async () => {
    const type = 'test-type';
    const data = { name: 'Test', value: 123 };

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.appendFile as jest.Mock).mockResolvedValue(undefined);

    await saveData(type, data);

    expect(fs.promises.appendFile).toHaveBeenCalledTimes(1);

    const writtenData = (fs.promises.appendFile as jest.Mock).mock.calls[0][1];
    const parsedData = JSON.parse(writtenData as string);

    expect(parsedData.type).toBe(type);
    expect(parsedData.name).toBe(data.name);
    expect(parsedData.value).toBe(data.value);
    expect(parsedData.timestamp).toBeDefined();
  });

  it('sollte einen Fehler werfen, wenn das Speichern fehlschlägt', async () => {
    const errorMessage = 'Speicherfehler';
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.appendFile as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const type = 'test-type';
    const data = { name: 'Test' };

    await expect(saveData(type, data)).rejects.toThrow('Daten konnten nicht gespeichert werden.');
  });

  it('sollte das data-Verzeichnis erstellen, wenn es nicht existiert', async () => {
    const type = 'test-type';
    const data = { name: 'Test' };

    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.promises.appendFile as jest.Mock).mockResolvedValue(undefined);

    await saveData(type, data);

    expect(fs.promises.appendFile).toHaveBeenCalledTimes(1);
  });
});
